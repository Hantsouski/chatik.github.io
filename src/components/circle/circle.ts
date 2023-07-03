import { div } from '@thi.ng/hiccup-html';

import './circle.css';

interface CircleOpts {
  name: string;
  width: string;
  height: string;
  color: string;
}

export const circle = ({ name, width, height, color }: CircleOpts) =>
  div({ class: 'circle', style: { width, height, 'background-color': color } }, name);
