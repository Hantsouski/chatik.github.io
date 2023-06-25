import { CloseMode, fromView, syncRAF } from '@thi.ng/rstream';
import { DB } from './root';
import { distinct, map, trace } from '@thi.ng/transducers';
import { AuthorizationStates } from './api';
import telegram from '../data-access/telegram/telegram';

export const auth = syncRAF(
  fromView(DB, {
    path: ['auth'],
  }),
  {
    id: "authState",
    closeOut: CloseMode.NEVER,
  }
).transform(distinct(), trace('auth STATE: '));

export const isAuthorized = auth.transform(
  map(state => state === AuthorizationStates.Ready),
  distinct(),
);

export const waitingPhoneNumber = auth.transform(
  map(state => state === AuthorizationStates.WaitPhoneNumber),
);

const setAuthState = (authState: AuthorizationStates) => {
  DB.resetIn(['auth'], authState);
};

telegram.auth().updates().on('any', update => {
  setAuthState(update['@type'] as AuthorizationStates);
})