import { CloseMode, fromView, syncRAF } from '@thi.ng/rstream';
import { DB } from './root';
import { comp, distinct, filter, map, pluck, trace } from '@thi.ng/transducers';
import { AuthorizationStates, CodeInfo } from './api';
import telegram from '../data-access/telegram/telegram';

const telegramAuth = telegram.auth();

export const authState = syncRAF(
  fromView(DB, {
    path: ['auth', 'state'],
  }),
  {
    id: 'authState',
    closeOut: CloseMode.NEVER,
  }
).transform(distinct());

export const authCodeInfo = syncRAF(
  fromView(DB, {
    path: ['auth', 'meta', 'code_info'],
  }),
  {
    id: 'authCodeInfo',
    closeOut: CloseMode.NEVER,
  }
).transform(filter(Boolean), distinct());

export const qrCodeLink = syncRAF(
  fromView(DB, {
    path: ['auth', 'meta', 'link'],
  }),
  {
    id: 'qrCodeLink',
    closeOut: CloseMode.NEVER,
  }
).transform(filter(Boolean), distinct());

export const yourPhoneNumber = authCodeInfo.transform<string>(pluck('phone_number'));
export const requiredCodeLength = authCodeInfo.transform<number>(comp(pluck('type'), pluck('length')));

authState.transform(trace('authState: '));

authState.subscribe(({ next: state => {
  /*
    reloading is bad :(
    but it's required to reinstantiate tdlib properly
    and it is what I described here: src/pages/auth/components/qr-code-form/qr-code-form.ts
  */
  if (state === AuthorizationStates.Closed) {
    location.reload();
  }

  /*
    quite often logged out state from tdlib can hang indefinetely
    so setting a timeout is a workaround to reload the page properly
    because if I reload the page in case of AuthorizationStates.LoggingOut and AuthorizationStates.Closed
    then the tdlib won't reinitialise properly
  */
  if (state === AuthorizationStates.LoggingOut) {
    setTimeout(() => {
      // still logging out
      if (authState.deref() === AuthorizationStates.LoggingOut) {
        location.reload();
      }
    }, 1000);
  }
}}));

export const isAuthorized = authState.transform(
  map(state => state === AuthorizationStates.Ready),
  distinct<boolean>(),
);

export const waitingPhoneNumber = authState.transform(
  map(state => state === AuthorizationStates.WaitPhoneNumber),
);

const setAuthState = (authState: AuthorizationStates) => {
  DB.resetIn(['auth', 'state'], authState);
};

const setCodeInfoState = (codeInfo: CodeInfo) => {
  DB.resetIn(['auth', 'meta', 'code_info'], codeInfo);
};

const setQrCodeState = (link: string) => {
  DB.resetIn(['auth', 'meta', 'link'], link);
};

export const sendPhone = (phone: string) => {
  telegramAuth.sendPhoneNumber(phone);
};

export const sendCode = (code: string) => {
  telegramAuth.sendAuthCode(code);
}

export const requestQrCodeAuthentication = () => {
  telegramAuth.requestQrCodeAuthentication();
};

export const logOut = () => {
  telegramAuth.logOut();
};

telegramAuth.updates().on('any', update => {
  if (update.code_info) {
    setCodeInfoState(update.code_info as unknown as CodeInfo);
  }

  if (update.link) {
    setQrCodeState(update.link as unknown as string);
  }

  setAuthState(update['@type'] as AuthorizationStates);
});

window.addEventListener('log out', () => logOut());
