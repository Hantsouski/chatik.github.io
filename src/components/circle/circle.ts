import { div } from '@thi.ng/hiccup-html';

import './circle.css';

export const circle = (name: string | undefined) => div({ class: 'circle' }, abbriviatedName(name));

const abbriviatedName = (name: string | undefined) => {
  if (!name) {
    return '👻';
  }

  const words = name.split(' ');

  return `${words[0][0]} ${words.length > 1 ? words[words.length - 1]?.[0] : ''}`;
};
