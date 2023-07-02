import { $replace } from '@thi.ng/rdom';
import { authState, AuthorizationStates } from '../../state';
import { centerL } from '../../components';
import { codeForm, phoneForm, qrCodeForm } from './components';

const pageLayout = (specificForm: unknown) => (
  centerL(
    { max: '40ch', andText: true },
    specificForm,
  )
);

const page = authState.map((state) => {
  switch (state) {
    case AuthorizationStates.WaitCode:
      return pageLayout(codeForm);

    case AuthorizationStates.WaitOtherDeviceConfirmation:
      return pageLayout(qrCodeForm);

    case AuthorizationStates.WaitPhoneNumber:
      return pageLayout(phoneForm);

    default:
      return null;
  }
});

export const authPage = $replace(page);
