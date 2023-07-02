import { Nullable } from '@thi.ng/api';
import type { Attribs } from '@thi.ng/hiccup-html';

import './box.css';

type Opts = Partial<Attribs & BoxLOpts>;

interface BoxLOpts {
  padding: string;
  borderWidth: string;
  invert: boolean;
}

/**
 * @module box-l
 * @description
 * A custom element for generic boxes/containers
 * @property {string} padding=var(--size-step-1) A CSS `padding` value
 * @property {string} borderWidth=var(--border-thin) A CSS `border-width` value
 * @property {boolean} invert=false Whether to apply an inverted theme. Only recommended for greyscale designs.
 *
 * https://every-layout.dev/
 */
export const boxL = (opts: Nullable<Opts>, ...body: unknown[]) => {
  const padding = opts?.padding || 'var(--size-step-1)';
  const borderWidth = opts?.borderWidth || 'var(--border-thin)';
  const invert = !!opts?.invert;

  const id = `Box-${[padding, borderWidth, invert].join('')}`;
  const data = { id };

  addStyles({
    padding,
    borderWidth,
    invert,
    id,
  });

  return ['box-l', { ...opts, data }, ...body];
};

const addStyles = ({ padding, borderWidth, invert, id }: BoxLOpts & { id: string }) => {
  if (document.getElementById(id)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = `
    [data-id="${id}"] {
      padding: ${padding};
      border: ${borderWidth} solid;
      ${invert ?
      `background-color: var(--color-light);
        filter: invert(100%);`
      : ''}
    }

    [data-id="${id}"] {
      background-color: inherit;
    }`
    .replace(/\s\s+/g, ' ')
    .trim();
  document.head.appendChild(styleEl);
};
