import { CloseMode, fromView, syncRAF } from '@thi.ng/rstream';
import { DB } from './root';
import { comp, distinct, filter, map, pluck } from '@thi.ng/transducers';
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

export const yourPhoneNumber = authCodeInfo.transform<string>(pluck('phone_number'));
export const requiredCodeLength = authCodeInfo.transform<number>(comp(pluck('type'), pluck('length')));

// authState.transform(trace('authState: '))
// authCodeInfo.transform(trace('authCodeInfo: '))
// yourPhoneNumber.transform(trace('yourPhoneNumber: '))
// requiredCodeLength.transform(trace('requiredCodeLength: '))

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

export const sendPhone = (phone: string) => {
  telegramAuth.sendPhoneNumber(phone);
};

export const sendCode = (code: string) => {
  telegramAuth.sendAuthCode(code);
}

export const logOut = () => {
  telegramAuth.logOut();
}

telegramAuth.updates().on('any', update => {
  if (update.code_info) {
    setCodeInfoState(update.code_info as unknown as CodeInfo);
  }
  setAuthState(update['@type'] as AuthorizationStates);
})
