import { $replace } from '@thi.ng/rdom';
import { h2 } from '@thi.ng/hiccup-html';
import { authState, AuthorizationStates } from '../../state';
import { centerL } from '../../components';
import { codeForm, phoneForm } from './components';

const pageLayout = (specificForm: unknown) => (
  centerL(
    { max: '36ch', andText: true },
    specificForm,
  )
);

const page = authState.map((state) => {
  switch (state) {
    case AuthorizationStates.WaitCode:
      return pageLayout(codeForm);

    case AuthorizationStates.WaitOtherDeviceConfirmation:
      return h2(null, 'waiting other device confirmation');

    case AuthorizationStates.WaitPhoneNumber:
      return pageLayout(phoneForm);

    default:
      return null;
  }
});

export const authPage = $replace(page);
