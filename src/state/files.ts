import telegram from '../data-access/telegram/telegram';
import { File } from '../state';

const telegramMedia = telegram.media();

export const fetchFile = (file: File) => telegramMedia.fetchFile(file);
