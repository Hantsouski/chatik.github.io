import { $replace } from '@thi.ng/rdom';
import { waitingPhoneNumber } from '../state';
import { centerL } from '../components';

const mocked = ['div.container', {}, ['h1', {}, 'Need your phone number'], ['h2', {}, 'Need your phone number']];

const page = waitingPhoneNumber.map(x => (
  x ? centerL({ max: '60ch' }, mocked) : ['h1', {}, 'Need something else']
))

export const authPage = $replace(page);
