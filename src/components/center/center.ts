import { Nullable } from '@thi.ng/api';
import type { Attribs } from '@thi.ng/hiccup-html';

import './center.css';

type Opts = Partial<Attribs & CenterLOpts>;

interface CenterLOpts {
  max: string;
  andText: boolean;
  gutters: string;
  intrinsic: boolean;
}

/**
 * @module center-l
 * @description
 * A custom element for centering a block-level element horizontally,
 * with a max-width value representing the typographic measure
 * @property {string} max=var(--measure) A CSS `max-width` value
 * @property {boolean} andText=false Center align the text too (`text-align: center`)
 * @property {boolean} gutters=0 The minimum space on either side of the content
 * @property {boolean} intrinsic=false Center child elements based on their content width
 */
export const centerL = (opts: Nullable<Opts>, ...body: unknown[]) => {
  const max = opts?.max || 'var(--measure)';
  const andText = opts?.andText || false;
  const gutters = opts?.gutters || '';
  const intrinsic = opts?.intrinsic || false;

  const id = `Center-${[max, andText, gutters, intrinsic].join('')}`;
  const data = { id };

  addStyles({
    max,
    andText,
    gutters,
    intrinsic,
    id,
  });

  return ['center-l', { ...opts, data }, ...body];
};

const addStyles = ({ max, andText, gutters, intrinsic, id }: CenterLOpts & { id: string }) => {
  if (document.getElementById(id)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = `
          [data-id="${id}"] {
            max-width: ${max};
            ${
              gutters
                ? `
            padding-inline-start: ${gutters};
            padding-inline-end: ${gutters};`
                : ''
            }
            ${andText ? `text-align: center;` : ''}
            ${
              intrinsic
                ? `
            display: flex;
            flex-direction: column;
            align-items: center;`
                : ''
            }
          }
        `
    .replace(/\s\s+/g, ' ')
    .trim();
  document.head.appendChild(styleEl);
};
