import { reactive } from '@thi.ng/rstream';
import { comp, filter, map } from '@thi.ng/transducers';
import { h3, inputText } from '@thi.ng/hiccup-html';
import { $input } from '@thi.ng/rdom';
import { note, stackL } from '../../../../components';
import { requiredCodeLength, sendCode, yourPhoneNumber } from '../../../../state';

const code = reactive('');

code.transform(
  comp(
    filter(x => x.length === requiredCodeLength.deref()),
    map(x => sendCode(x),
  ),
));

export const codeForm = stackL(
  {},
  h3(null, yourPhoneNumber),
  note({}, `We've sent the code to the Telegram app on your other device.`),
  inputText({ value: code, oninput: $input(code), maxlength: requiredCodeLength })
)
