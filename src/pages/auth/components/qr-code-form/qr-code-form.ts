import { button, h1, li, ol } from '@thi.ng/hiccup-html';
import { stackL } from '../../../../components';
import { qrCode } from '../qr-code/qr-code';
import { logOut } from '../../../../state';

import './qr-code-form.css';

/*
  due to not having a supported tdlib flow to get from authorizationStateWaitOtherDeviceConfirmation (qr code auth)
  to authorizationStateWaitPhoneNumber, I need to logout completely to start again
  unfortunately it'll reload the page as tdlib should be reinstantiated again

  found out about it here: https://github.com/tdlib/td/issues/1645
*/
const loginByPhoneNumber = () => logOut();

export const qrCodeForm = stackL(
  { class: 'qr-code-form' },
  qrCode(),
  h1(null, 'Log in to Telegram by QR Code'),
  ol(
    {},
    li({}, 'Open Telegram on your phone'),
    li({}, 'Go to Settings > Devices > Link Desktop Device'),
    li({}, 'Point your phone at this screen to confirm login'),
  ),
  button({ onclick: loginByPhoneNumber }, 'Log in by phone number'),
);
