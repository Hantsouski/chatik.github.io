import { AuthorizationStates, CodeInfo } from '../data-access/telegram/api';

export * from '../data-access/telegram/api';

interface AuthStateMeta {
  code_info: CodeInfo;
}

export interface AppState {
  auth: {
    state: AuthorizationStates,
    meta?: AuthStateMeta,
  };
}
