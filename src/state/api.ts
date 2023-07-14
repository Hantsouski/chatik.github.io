import { IObjectOf, Nullable } from '@thi.ng/api';
import { AuthorizationStates, Chat, CodeInfo, Message, User } from '../data-access/telegram/api';

export * from '../data-access/telegram/api';
export * from '../data-access/telegram/type-checks';

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
  selectedChatId: string;
  messages: Message[];
  users: IObjectOf<User>;
  me: Nullable<User>;
}
