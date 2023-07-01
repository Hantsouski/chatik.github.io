import { Nullable } from '@thi.ng/api';
import type { Attribs } from '@thi.ng/hiccup-html';

import './stack.css';

type Opts = Partial<Attribs & StackLOpts>;

interface StackLOpts {
  align: string;
  reverse: boolean;
  space: string;
  recursive: boolean;
  splitAfter: string | null;
}

type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * @module stack-l
 * @description
 * A custom element for injecting white space (margin) between flow
 * (block) elements along a vertical axis.
 * @property {string} space=var(--s1) A CSS `margin` value
 * @property {boolean} recursive=false Whether the spaces apply recursively (i.e. regardless of nesting level)
 * @property {number} splitAfter=null The element after which to _split_ the stack with an auto margin
 *
 * https://every-layout.dev/
 */
export const stackL = (opts: Nullable<Opts>, ...body: unknown[]) => {
  const align = opts?.align || '';
  const space = opts?.space || 'var(--size-step-0)';
  const recursive = opts?.recursive ? 'recursive' : '';
  const reverse = opts?.reverse ? 'reverse' : '';
  const splitAfter = opts?.splitAfter || null;

  const id = `Stack-${[align, space, recursive, reverse, splitAfter].join('')}`;
  const data = { id };

  addStyles({
    align,
    space,
    recursive,
    reverse,
    splitAfter,
    id,
  });

  return ['stack-l', { ...opts, data }, ...body];
};

type ModifiedOpts = Modify<StackLOpts, { recursive: string; reverse: string }>;

const addStyles = ({ reverse, align, recursive, space, id, splitAfter }: ModifiedOpts & { id: string }) => {
  if (document.getElementById(id)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = `
      [data-id="${id}"] {
        flex-direction: ${reverse ? 'column-reverse' : 'column'};
        ${align ? `align-items: ${align}` : ''};
      }

      [data-id="${id}"]${recursive ? ' ' : ' >'} * + * {
        margin-block-${reverse ? 'end' : 'start'}: ${space};
      }


      ${
        splitAfter
          ? `
            [data-id="${id}"]:only-child {
              block-size: 100%;
            }

            [data-id="${id}"] > :nth-child(${splitAfter}) {
              margin-block-end: auto;
            }`
          : ''
      }`
    .replace(/\s\s+/g, ' ')
    .trim();
  document.head.appendChild(styleEl);
};
