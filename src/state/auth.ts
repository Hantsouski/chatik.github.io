import { CloseMode, fromView, syncRAF } from '@thi.ng/rstream';
import { DB } from './root';
import { distinct, map, trace } from '@thi.ng/transducers';
import { AuthorizationStates } from './api';
import telegram from '../data-access/telegram/telegram';

const telegramAuth = telegram.auth();

export const authState = syncRAF(
  fromView(DB, {
    path: ['auth'],
  }),
  {
    id: 'authState',
    closeOut: CloseMode.NEVER,
  }
).transform(distinct());

authState.transform(trace('authState: '))

export const isAuthorized = authState.transform(
  map(state => state === AuthorizationStates.Ready),
  distinct<boolean>(),
);

export const waitingPhoneNumber = authState.transform(
  map(state => state === AuthorizationStates.WaitPhoneNumber),
);

const setAuthState = (authState: AuthorizationStates) => {
  DB.resetIn(['auth'], authState);
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
  setAuthState(update['@type'] as AuthorizationStates);
})
