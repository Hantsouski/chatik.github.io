import TdClient from 'tdweb';
import { User } from './api';

export class TelegramUsers {

  constructor(
    private readonly tdClient: TdClient,
  ) {}

  public async getMe(): Promise<User> {
    return this.tdClient.send({
      '@type': 'getMe'
    }) as unknown as User;
  }
}
