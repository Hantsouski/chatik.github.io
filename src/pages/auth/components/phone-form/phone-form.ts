import { button, h1, inputText, label } from '@thi.ng/hiccup-html';
import { reactive, stream, sync, syncRAF } from '@thi.ng/rstream';
import { comp, filter, map } from '@thi.ng/transducers';
import { $input, $inputTrigger, $replace } from '@thi.ng/rdom';
import { centerL, logo, note, sideBarL, stackL } from '../../../../components';
import { requestQrCodeAuthentication, sendPhone } from '../../../../state';
import { Country, CountrySelect } from '../country-select/country-select';

const phone = reactive('');
const formSubmit = reactive(false);

const selectedCountry = stream<Country>();
let previousSelectedCountry: Country;

selectedCountry.subscribe({
  next: (country) => {
    const currentPhone = phone.deref()!;

    // simple country code replacement logic
    if (currentPhone.includes(`+${previousSelectedCountry?.prefix}`)) {
      const changedCode = phone.deref()!.replace(`+${previousSelectedCountry.prefix} `, `+${country.prefix} `);
      phone.next(changedCode);
    } else {
      phone.next(`+${country.prefix} `);
    }

    document.getElementById('phone')?.focus();
  },
});

formSubmit.transform(
  comp(
    filter(Boolean),
    map(() => sendPhone(phone.deref()!))
  )
);

const submitButton = $replace(
  syncRAF(
    sync({
      src: {
        selectedCountry,
        phone,
      },
    }).transform(
      map(({ selectedCountry, phone }) => {
        if (!Number(selectedCountry.count) || Number(selectedCountry.count) === phone.trim().replace(/\s/g, '').length - 1) {
          return button({ onclick: $inputTrigger(formSubmit), type: 'button' }, 'NEXT');
        }

        return null;
      })
    )
  )
);

const loginByQRCode = () => requestQrCodeAuthentication();

const onCountrySelect = async (country: Country) => {
  previousSelectedCountry = selectedCountry.deref()!;
  selectedCountry.next(country);
};

export const phoneForm = stackL(
  {},
  centerL({ andText: true }, logo, h1(null, 'Telegram'), note({}, 'Please confirm your country code and enter your phone number.')),
  new CountrySelect({
    onCountrySelect,
  }),
  $replace(
    selectedCountry.map((country) => {
      if (country.pattern) {
        return sideBarL({ sideWidth: '4rem' }, 'Example', `+${country.pattern}`);
      }

      return null;
    })
  ),
  stackL(
    null,
    sideBarL(
      { sideWidth: '4rem' },
      label({ for: 'phone' }, 'Phone'),
      inputText({ id: 'phone', class: 'text-input', type: 'tel', value: phone, oninput: $input(phone) })
    ),
    submitButton
  ),
  button({ onclick: loginByQRCode }, 'Log in by QR code')
);
