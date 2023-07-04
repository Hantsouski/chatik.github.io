interface TypedEntity<Type> {
  '@type': Type;
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

export type UpdateChatLastMessage = 'updateChatLastMessage';
export type UpdateChatPosition = 'updateChatPosition';
export type UpdateChatReadInbox = 'updateChatReadInbox';

export type AnyUpdates = 'any';
export type AuthorizationUpdates = 'updateAuthorizationState';
export type AuthorizationStateUpdates = `${AuthorizationStates}` | AnyUpdates;
export type ChatUpdates = UpdateChatLastMessage | UpdateChatPosition | UpdateChatReadInbox;
export type OptionUpdates = 'updateOption';
export type MessagesUpdates = 'updateMessageInteractionInfo' | 'updateNewMessage';
export type UserUpdates = 'updateUser';
export type FileUpdates = 'updateFile';

export interface CodeTypeTelegramMessage extends TypedEntity<'authenticationCodeTypeTelegramMessage'> {
  length: number;
}

export interface CodeInfo extends TypedEntity<'authenticationCodeInfo'> {
  phone_number: string;
  timeout: number;
  // can be other types
  type: CodeTypeTelegramMessage;
}

export type AllTelegramUpdates =
  AuthorizationUpdates |
  ChatUpdates |
  OptionUpdates |
  MessagesUpdates |
  UserUpdates |
  FileUpdates |
  AnyUpdates;

export type TextEntityTypeBold = TypedEntity<'textEntityTypeBold'>;

export type TextEntityTypeItalic = TypedEntity<'textEntityTypeItalic'>;

export type TextEntityTypeUrl = TypedEntity<'textEntityTypeUrl'>;

export interface TextEntityTypeTextUrl extends TypedEntity<'textEntityTypeTextUrl'> {
  url: string;
}

export type TextEntityTypeHashtag = TypedEntity<'textEntityTypeHashtag'>;

export interface TextEntity extends TypedEntity<'textEntity'> {
  length: number;
  offset: number;
  type: TextEntityTypeBold | TextEntityTypeItalic | TextEntityTypeUrl | TextEntityTypeTextUrl | TextEntityTypeHashtag;
}

export interface FormattedText extends TypedEntity<'formattedText'> {
  entities: TextEntity[];
  text: string;
}

export interface Minithumbnail extends TypedEntity<'minithumbnail'> {
  data: string;
  height: number;
  width: number;
}

export interface LocalFile extends TypedEntity<'localFile'> {
  is_downloading_active: boolean;
  is_downloading_complete: boolean;
}

export interface RemoteFile extends TypedEntity<'remoteFile'> {
  id: string;
  is_uploading_active: boolean;
  is_uploading_completed: boolean;
  unique_id: string;
  uploaded_size: number;
}

export interface File extends TypedEntity<'file'> {
  expected_size: number;
  id: number;
  local: LocalFile;
  remote: RemoteFile;
}

export type PhotoSizeType = 'm' | 'x' | 's' | 'y' | 'w';

export interface PhotoSize extends TypedEntity<'photoSize'> {
  height: number;
  width: number;
  photo: File;
  type: PhotoSizeType;
}

export interface Photo extends TypedEntity<'photo'> {
  has_stickers: boolean;
  minithumbnail: Minithumbnail;
  sizes: PhotoSize[];
}

export interface MessagePhoto extends TypedEntity<'messagePhoto'> {
  caption: FormattedText;
  photo: Photo;
}

export interface InteractionInfo extends TypedEntity<'messageInteractionInfo'> {
  forward_count: number;
  reply_info: any;
  view_count: number;
}

export interface WebPage extends TypedEntity<'webPage'> {
  author: string;
  description: FormattedText;
  display_url: string;
  duration: number;
  embed_height: number;
  embed_width: number;
  embed_type: 'iframe' | '';
  embed_url: string;
  instant_view_version: 0 | 1;
  photo: Photo;
  site_name: string;
  title: string;
  type: 'video';
  url: string;
}

export interface MessageText extends TypedEntity<'messageText'> {
  text: FormattedText;
  web_page: any;
}

export interface MessageChatAddMembers extends TypedEntity<'messageChatAddMembers'> {
  member_user_ids: number[];
}

export interface MessageSenderChat extends TypedEntity<'messageSenderChat'> {
  chat_id: number;
}

export interface MessageSenderUser extends TypedEntity<'messageSenderUser'> {
  user_id: number;
}

export interface Message extends TypedEntity<'message'> {
  id: number;
  chat_id: number;
  media_album_id: '0' | string;
  content: MessagePhoto | MessageText | MessageChatAddMembers;
  interaction_info: InteractionInfo;
  sender_id: MessageSenderChat | MessageSenderUser;
  date: number;
  edit_date: 0 | number;
}

export interface Permissions extends TypedEntity<'chatPermissions'> {
  can_add_web_page_previews: boolean;
  can_change_info: boolean;
  can_invite_users: boolean;
  can_pin_messages: boolean;
  can_send_media_messages: boolean;
  can_send_messages: boolean;
  can_send_other_messages: boolean;
  can_send_polls: boolean;
}

export type ChatListMain = TypedEntity<'chatListMain'>;

export type ChatListArchive = TypedEntity<'chatListArchive'>;

export interface ChatPosition extends TypedEntity<'chatPosition'> {
  is_pinned: boolean;
  list: ChatListMain | ChatListArchive;
  order: string;
}

export interface ChatTypePrivate extends TypedEntity<'chatTypePrivate'> {
  user_id: number;
}

export interface ChatTypeBasicGroup extends TypedEntity<'chatTypeBasicGroup'> {
  basic_group_id: number;
}

export interface ChatTypeSupergroup extends TypedEntity<'chatTypeSupergroup'> {
  is_channel: boolean;
  supergroup_id: number;
}

export interface ChatPhotoInfo extends TypedEntity<'chatPhotoInfo'> {
  big: File;
  has_animation: boolean;
  minithumbnail: Minithumbnail;
  small: File;
}

export interface Chat extends TypedEntity<'chat'> {
  id: number;
  last_message: Message;
  permissions: Permissions;
  positions: ChatPosition[];
  title: string;
  type: ChatTypePrivate | ChatTypeBasicGroup | ChatTypeSupergroup;
  theme_name: string;
  unread_count: number;
  unread_mention_count: number;
  photo?: ChatPhotoInfo;
}
