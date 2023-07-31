import { div, inputText, label, li, ul } from '@thi.ng/hiccup-html';
import { $input, $replace, Component, NumOrElement } from '@thi.ng/rdom';
import { comp, map, mapcat, push, rename, sideEffect, transduce } from '@thi.ng/transducers';
import { fromDOMEvent, reactive, stream, sync, syncRAF } from '@thi.ng/rstream';

import { countries as countryList } from './countries';
import { boxL, sideBarL, stackL } from '../../../../components';

import './country-select.css';
import { countryCode } from '../../../../state';

export interface Country {
  prefix: string;
  code: string;
  name: string;
  pattern: string;
  count: string;
  emoji: string;
}

const namesToCountryMap = new Map<string, Country>();

const parseCountries = comp<string, string, string[], Country, Country>(
  mapcat((x) => x.split('\n')),
  map((x) => x.split(';')),
  rename({ prefix: 0, code: 1, name: 2, pattern: 3, count: 4, emoji: 5 }),
  sideEffect((country) => namesToCountryMap.set(country.name, country))
);

const countries = transduce(parseCountries, push(), [countryList]);

interface CountrySelectOptions {
  onCountrySelect: (country: Country) => any;
}

export class CountrySelect extends Component {
  private inputText!: HTMLInputElement;

  private query = reactive('');
  private showMatchedCountries = reactive<boolean>(false);
  private matchedCountries = stream<Country[] | null>();

  private highlightCountryOption = stream<'next' | 'prev'>().map((direction) => {
    const currentlyHighlighted = document.querySelector('#autocomplete-options > li[aria-selected="true"]');

    if (!currentlyHighlighted) {
      !this.showMatchedCountries.deref() && this.showMatchedCountries.next(true);

      const option = document.querySelector<HTMLLIElement>('#autocomplete-options li:first-child');
      option?.setAttribute('aria-selected', 'true');
      option?.scrollIntoView({ block: 'center' });
      option?.focus();
      return;
    }

    const sibling = direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';
    const nextToHighlight = currentlyHighlighted[sibling] as HTMLLIElement;

    if (!nextToHighlight) {
      if (direction === 'prev') {
        this.inputText.focus();
        this.showMatchedCountries.next(false);
      }
      return;
    }

    currentlyHighlighted.setAttribute('aria-selected', 'false');
    nextToHighlight.setAttribute('aria-selected', 'true');
    nextToHighlight.scrollIntoView({ block: 'center' });
    nextToHighlight.focus();
  });

  private countriesMenu = $replace(
    syncRAF(
      sync({
        src: {
          showMatchedCountries: this.showMatchedCountries,
          matchedCountries: this.matchedCountries,
        },
      }).transform(
        map(({ showMatchedCountries, matchedCountries }) =>
          showMatchedCountries
            ? ul(
                {
                  id: 'autocomplete-options',
                  role: 'listbox',
                  onclick: this.onOptionClick,
                  onkeydown: this.onMenuKeyDown,
                },
                ...(matchedCountries || []).map((country, index) =>
                  li(
                    {
                      id: country.name,
                      role: 'option',
                      tabindex: -1,
                      'aria-selected': 'false',
                      'data-option-value': index,
                    },
                    boxL(
                      { borderWidth: '0', padding: 'calc(var(--size-step-0) / 2.5)' },
                      country.emoji,
                      boxL({ borderWidth: '0', padding: '0 calc(var(--size-step-0) / 2.5)' }, country.name),
                      `+${country.prefix}`,
                    )
                  )
                )
              )
            : null
        )
      )
    )
  );

  private onCountrySelect: (country: Country) => any;

  constructor(opts: CountrySelectOptions) {
    super();

    this.onCountrySelect = opts.onCountrySelect;
  }

  public async mount(parent: Element, index?: NumOrElement | undefined): Promise<Element> {
    const countrySelect = div(
      { class: 'country-select' },
      stackL(
        {},
        sideBarL(
          { sideWidth: '4rem' },
          label({ for: 'country' }, 'Country'),
          div(
            { class: 'autocomplete' },
            inputText({
              'aria-owns': 'autocomplete-options',
              'aria-expanded': this.showMatchedCountries.map((x) => !!x),
              'aria-autocomplete': 'list',
              class: 'text-input',
              autocapitalize: 'off',
              autocomplete: 'off',
              role: 'combobox',
              id: 'country',
              value: this.query,
              oninput: $input(this.query),
              onkeyup: this.onInputKeyUp,
              onkeydown: this.onInputKeyDown,
              onclick: () => this.showMatchedCountries.next(true),
            }),
            this.countriesMenu
            // div({ 'aria-live': 'polite', role: 'status', class: 'visually-hidden' }, 'Some results available')
          )
        )
      )
    );

    countryCode.subscribe({
      next: (code) => {
        const yourLocation = countries.find((country) => country.code === (code as any).text)!;
        this.query.next(yourLocation.name);
        this.showMatchedCountries.next(false);
        this.onCountrySelect(yourLocation);
      },
    });

    this.el = await this.$tree(this.$compile(countrySelect), parent, index);

    this.inputText = document.getElementById('country') as HTMLInputElement;

    fromDOMEvent(document, 'click').map((e: MouseEvent) => {
      if (!this.inputText!.contains(e.target as HTMLElement)) {
        this.showMatchedCountries.next(false);
      }
    });

    this.query.map((query) => {
      if (!query) {
        return this.matchedCountries.next(countries);
      }

      const matches = [];

      for (const country of countries) {
        if (country.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
          matches.push(country);
        }
      }

      !this.showMatchedCountries.deref() && this.showMatchedCountries.next(true);
      this.matchedCountries.next(matches);
    });

    return this.el!;
  }

  private onInputKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Escape':
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Space':
      case 'Enter':
      case 'ShiftLeft':
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.highlightCountryOption.next('next');
        break;
    }
  };

  private onInputKeyDown = (e: KeyboardEvent) => {
    if (e.code !== 'Tab') return;

    this.showMatchedCountries.next(false);
  };

  private onOptionClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const option = target.closest('li');

    if (!option) {
      return;
    }

    this.query.next(option.getAttribute('id')!);
    this.showMatchedCountries.next(false);
    this.onCountrySelect(namesToCountryMap.get(option.getAttribute('id')!)!);
  };

  private onMenuKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault();
        this.highlightCountryOption.next('prev');
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.highlightCountryOption.next('next');
        break;
      case 'Enter':
        this.selectHighlightedOption(e);
        break;
      case 'Spance':
        this.selectHighlightedOption(e);
        break;
      case 'Escape':
        this.showMatchedCountries.next(false);
        this.inputText.focus();
        break;
      case 'Tab':
        break;

      default:
        this.inputText.focus();
        break;
    }
  };

  private selectHighlightedOption = (e: KeyboardEvent) => {
    e.preventDefault();

    const highlightedOption = document.querySelector('#autocomplete-options > li[aria-selected="true"]');

    if (highlightedOption) {
      this.query.next(highlightedOption.getAttribute('id')!);
      this.inputText.focus();
      this.showMatchedCountries.next(false);
      this.onCountrySelect(namesToCountryMap.get(highlightedOption.getAttribute('id')!)!);
    }
  };
}
