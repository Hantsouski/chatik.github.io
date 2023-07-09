import { Nullable } from '@thi.ng/api';
import type { Attribs } from '@thi.ng/hiccup-html';

import './switcher.css';

type Opts = Partial<Attribs & SwitcherLOpts>;

interface SwitcherLOpts {
  threshold: string;
  space: string;
  limit: number;
}

/**
 * @module switcher-l
 * @description Switch directly between horizontal and vertical layouts at a given (container width-based) breakpoint or 'threshold'
 * @property {string} threshold=var(--measure) A CSS `width` value (representing the 'container breakpoint')
 * @property {string} space=var(--s1) A CSS `margin` value
 * @property {integer} limit=4 A number representing the maximum number of items permitted for a horizontal layout
 * https://every-layout.dev/
 */
export const switcherL = (opts: Nullable<Opts>, ...body: unknown[]) => {
  const threshold = opts?.threshold || 'var(--measure)';
  const space = opts?.space || 'var(--size-step-1)';
  const limit = opts?.limit || 5;

  const id = `Switcher-${[threshold, space, limit].join('')}`;
  const data = { id };

  addStyles({
    threshold,
    space,
    limit,
    id,
  });

  return ['switcher-l', { ...opts, data }, ...body];
};

const addStyles = ({ threshold, space, limit, id }: SwitcherLOpts & { id: string }) => {
  if (document.getElementById(id)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = `
    [data-id="${id}"] {
      gap: ${space};
    }

    [data-id="${id}"] > * {
      flex-basis: calc((${threshold} - 100%) * 999);
    }

    [data-id="${id}"] > :nth-last-child(n+${limit + 1}),
    [data-id="${id}"] > :nth-last-child(n+${limit + 1}) ~ * {
      flex-basis: 100%;
    }`
    .replace(/\s\s+/g, ' ')
    .trim();
  document.head.appendChild(styleEl);
};
