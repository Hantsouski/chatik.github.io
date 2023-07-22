import { button, div, span } from '@thi.ng/hiccup-html';
import { Component, NumOrElement } from '@thi.ng/rdom';
import * as MenuButton from 'inclusive-menu-button';

import './settings.menu.css';

import { circle } from '..';

const hamburgerIcon = div({ class: 'hamburger' }, span());

export class SettingsMenu extends Component {
  async mount(parent: Element, index?: NumOrElement): Promise<Element> {
    const settingsMenu = div(
      { 'data-inclusive-menu': '' },
      button(
        { 'data-inclusive-menu-opens': 'settings' },
        circle({
          body: hamburgerIcon,
          width: '3rem',
          height: '3rem',
          color: '',
        })
      ),
      div(
        { id: 'settings', 'data-inclusive-menu-from': 'left' },
        button({}, 'Log out'),
      ),
    );

    this.el = await this.$tree(
      this.$compile(settingsMenu),
      parent,
      index,
    );

    const openButton = document.querySelector('[data-inclusive-menu-opens]');
    const settingsMenuButton = MenuButton.default ? new MenuButton.default(openButton) : new MenuButton(openButton);

    // Listen to choose event
    settingsMenuButton.on('choose', () => {
      this.el?.dispatchEvent(new CustomEvent('log out', { bubbles: true }));
    });

    return this.el!;
  }
}
