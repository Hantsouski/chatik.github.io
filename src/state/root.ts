import { defAtom } from '@thi.ng/atom';
import { AppState, AuthorizationStates } from './api';

export const DB = defAtom<AppState>({
  auth: {
    state: AuthorizationStates.WaitTdlib,
  },
  chats: [],
});
