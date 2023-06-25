export interface AppState {
  auth: AuthorizationStates;
}

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