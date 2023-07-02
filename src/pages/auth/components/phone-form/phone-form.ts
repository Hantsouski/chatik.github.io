import { button, form, h1, inputText } from '@thi.ng/hiccup-html';
import { centerL, logo, note, stackL } from '../../../../components';
import { reactive } from '@thi.ng/rstream';
import { comp, filter, map } from '@thi.ng/transducers';
import { requestQrCodeAuthentication, sendPhone } from '../../../../state';
import { $input, $inputTrigger, $replace } from '@thi.ng/rdom';

const phone = reactive('');
const formSubmit = reactive(false);

formSubmit.transform(
  comp(
    filter(Boolean),
    map(() => sendPhone(phone.deref()!))
  )
);

// dumb phone validation
// will change later
const submitButton = $replace(
  phone.map((x) => (
    x.length > 7
      ? button({ onclick: $inputTrigger(formSubmit), type: 'button' }, 'NEXT')
      : null
  ))
);

const loginByQRCode = () => requestQrCodeAuthentication();

export const phoneForm = stackL(
  {},
  centerL(null, logo),
  h1(null, 'Telegram'),
  note({}, 'Please confirm your country code and enter your phone number.'),
  form({ id: 'phone-form' }, stackL(null, inputText({ id: 'phone', value: phone, oninput: $input(phone), minlength: 7 }), submitButton)),
  button({ onclick: loginByQRCode }, 'Log in by QR code')
);
