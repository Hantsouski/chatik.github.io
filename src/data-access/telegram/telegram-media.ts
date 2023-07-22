import TdClient from 'tdweb';
import { AllTelegramUpdates, File } from './api';
import { TelegramUpdates } from './telegram-updates';

export class TelegramMedia {
  private readonly fileUpdateSubscribers = new Map();

  constructor(
    private readonly tdClient: TdClient,
    private readonly telegramUpdate: TelegramUpdates<AllTelegramUpdates>,
  ) {
    this.telegramUpdate.on('updateFile', async (update) => {
      if (!update) {
        return;
      }

      const fileUpdate = update.file as any;

      if (!(fileUpdate)?.local.is_downloading_completed) {
        return;
      }

      const subscriber = this.fileUpdateSubscribers.get(fileUpdate.id);

      if (!subscriber) {
        return;
      }

      const file = await this.readFile(fileUpdate.id);

      if (!file) {
        return;
      }

      this.fileUpdateSubscribers.delete(fileUpdate.id);

      subscriber(URL.createObjectURL(file));
    });
  }

  public async fetchFile(file: File): Promise<string> {
    const localFile = await this.readFile(file.id).catch(console.log);

    if (localFile) {
      return URL.createObjectURL(localFile);
    }

    this.downloadFile(file.id);

    return new Promise((resolve) => {
      this.fileUpdateSubscribers.set(file.id, resolve);
    });
  }

  private async downloadFile(id: number): Promise<void> {
    this.tdClient.send({
      '@type': 'downloadFile',
      file_id: id,
      priority: 32,
    });
  }

  private async readFile(id: number): Promise<Blob> {
    const response = await this.tdClient.send({
        '@type': 'readFile',
        file_id: id
    });
    return (response as unknown as any).data;
  }
}
