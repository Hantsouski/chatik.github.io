export enum AuthorizationStates {
  WaitTdlib = 'authorizationStateWaitTdlib',
  WaitTdlibParameters = 'authorizationStateWaitTdlibParameters',
  WaitPhoneNumber = 'authorizationStateWaitPhoneNumber',
  WaitEmailAddress = 'authorizationStateWaitEmailAddress',
  WaitEmailCode = 'authorizationStateWaitEmailCode',
  WaitCode = 'authorizationStateWaitCode',
  WaitRegistration = 'authorizationStateWaitRegistration',
  WaitPassword = 'authorizationStateWaitPassword',
  WaitEncryptionKey = 'authorizationStateWaitEncryptionKey',
  WaitOtherDeviceConfirmation = 'authorizationStateWaitOtherDeviceConfirmation',

  Ready = 'authorizationStateReady',
  Closed = 'authorizationStateClosed',
  Closing = 'authorizationStateClosing',
  LoggingOut = 'authorizationStateLoggingOut',
}

export type AnyUpdates = 'any';
export type AuthorizationUpdates = 'updateAuthorizationState';
export type AuthorizationStateUpdates = `${AuthorizationStates}` | AnyUpdates;
export type ChatUpdates = 'updateChatLastMessage' | 'updateChatPosition';
export type OptionUpdates = 'updateOption';
export type MessagesUpdates = 'updateMessageInteractionInfo' | 'updateNewMessage';
export type UserUpdates = 'updateUser';

export type AllTelegramUpdates =
  AuthorizationUpdates |
  ChatUpdates |
  OptionUpdates |
  MessagesUpdates |
  UserUpdates |
  AnyUpdates;
