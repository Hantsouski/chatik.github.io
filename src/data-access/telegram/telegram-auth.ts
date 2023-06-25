import TdClient, { TdObject } from 'tdweb';
import { TelegramUpdates } from './telegram-updates';
import { Browser } from '../../common/browser';

const browser = new Browser();

export default class TelegramAuth {
  constructor(
    private readonly tdClient: TdClient,
    private readonly telegramUpdate: TelegramUpdates,
    private readonly apiKey: { id: string, hash: string }
  ) {
    this.telegramUpdate.on('updateAuthorizationState', (update) => {
      const authState = update['authorization_state'] as TdObject;

      switch (authState['@type']) {
        case 'authorizationStateWaitEncryptionKey':
          this.tdClient.send({'@type': 'checkDatabaseEncryptionKey' })
          break;

        case 'authorizationStateWaitCode':
          // this.tdClient.send({'@type': 'checkDatabaseEncryptionKey' })
          break;

        case 'authorizationStateWaitOtherDeviceConfirmation':
          break;
  
        case 'authorizationStateWaitPhoneNumber':
          // this.tdClient.send({
          //   '@type': 'requestQrCodeAuthentication',
          //   other_user_ids: []
          // });
          break;
  
        case 'authorizationStateWaitTdlibParameters':
          this.tdClient.send({
            '@type': 'setTdlibParameters',
            parameters: {
              '@type': 'tdParameters',
              use_test_dc: false,
              api_id: this.apiKey.id,
              api_hash: this.apiKey.hash,
              system_language_code: navigator.language || 'en',
              device_model: browser.name,
              system_version: browser.osName,
              application_version: 'dev',
              use_secret_chats: false,
              use_message_database: true,
              use_file_database: false,
              database_directory: '/db',
              enable_storage_optimizer: true,
              files_directory: '/',
            },
          });
      
          this.tdClient.send({
            '@type': 'setOption',
            name: 'use_quick_ack',
            value: {
              '@type': 'optionValueBoolean',
              value: true,
            },
          });
          break;
      
        default:
          break;
      }
    });
  }

  public logOut() {
    this.tdClient.send({ '@type': 'logOut' })
  }

  public sendPhoneNumber(number: string): void {
      this.tdClient.send({'@type': 'setAuthenticationPhoneNumber', 'phone_number': number});
  }
  
  public sendAuthCode(code: string): void {
      this.tdClient.send({'@type': 'checkAuthenticationCode', 'code': code});
  }

  public send2FACode(pass: string): void {
      this.tdClient.send({'@type': 'checkAuthenticationPassword', 'password': pass});
  }

  public registerNewAccount(firstName: string, lastName: string): void {
      this.tdClient.send({'@type': 'registerUser', 'first_name': firstName, 'last_name': lastName });
  }
}