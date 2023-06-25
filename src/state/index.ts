import { defAtom } from '@thi.ng/atom';
import { AppState, AuthorizationStates } from './api';

export const DB = defAtom<AppState>({
  auth: AuthorizationStates.WaitTdlib,
});

export * from './api';
export * from './auth';