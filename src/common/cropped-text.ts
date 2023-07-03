import { FormattedText } from '../state';

export const croppedText = (text: FormattedText) => {
  return `${text.text.replace(/\n/g, ' ').slice(0, 100)} ${text.text.length > 100 ? '...' : ''}`;
}
