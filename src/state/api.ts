import { AuthorizationStates } from '../data-access/telegram/api';

export * from '../data-access/telegram/api';

export interface AppState {
  auth: AuthorizationStates;
}