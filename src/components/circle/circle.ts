import { div } from '@thi.ng/hiccup-html';

import './circle.css';

interface CircleOpts {
  body: any;
  width: string;
  height: string;
  color: string;
}

export const circle = ({ body, width, height, color }: CircleOpts) =>
  div({ class: 'circle', style: { width, height, 'background-color': color } }, body);
