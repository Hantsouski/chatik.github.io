import { div } from '@thi.ng/hiccup-html';
import { abbreviatedName } from '../../common';

import './circle.css';

export const circle = (name: string | undefined) => div({ class: 'circle' }, abbreviatedName(name));
