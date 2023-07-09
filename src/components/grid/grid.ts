import { Nullable } from '@thi.ng/api';
import type { Attribs } from '@thi.ng/hiccup-html';

import './grid.css';

type Opts = Partial<Attribs & GridLOpts>;

interface GridLOpts {
  min: string;
  space: string;
}

/**
 * @module grid-l
 * @description
 * A custom element for creating a responsive grid using the CSS Grid module
 * @property {string} min=250px A CSS length value representing x in `minmax(min(x, 100%), 1fr)`
 * @property {string} space=var(--s1) The space between grid cells
 *
 * https://every-layout.dev/
 */
export const gridL = (opts: Nullable<Opts>, ...body: unknown[]) => {
  const min = opts?.min || '250px';
  const space = opts?.space || 'var(--size-step-1)';

  const id = `Grid-${[min, space].join('')}`;
  const data = { id };

  addStyles({
    min,
    space,
    id,
  });

  return ['grid-l', { ...opts, data }, ...body];
};

const addStyles = ({ min, space, id }: GridLOpts & { id: string }) => {
  if (document.getElementById(id)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = `
    [data-id="${id}"] {
      grid-gap: ${space};
    }

    @supports (width: min(${min}, 100%)) {
      [data-id="${id}"] {
        grid-template-columns: repeat(auto-fill, minmax(min(${min}, 100%), 1fr));
      }
    }`
    .replace(/\s\s+/g, ' ')
    .trim();
  document.head.appendChild(styleEl);
};
