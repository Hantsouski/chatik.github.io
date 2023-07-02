import { AuthorizationStates, Chat, CodeInfo } from '../data-access/telegram/api';

export * from '../data-access/telegram/api';

interface AuthStateMeta {
  code_info: CodeInfo;
  link: string;
}

export interface AppState {
  auth: {
    state: AuthorizationStates,
    meta?: Partial<AuthStateMeta>,
  };
  chats: Chat[];
}
