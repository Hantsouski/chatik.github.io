import { Nullable } from '@thi.ng/api';
import type { Attribs } from '@thi.ng/hiccup-html';

import './frame.css';

type Opts = Partial<Attribs & FrameLOpts>;

interface FrameLOpts {
  ratio: string;
}

/**
 * @module frame-l
 * @description
 * A custom element for augmenting image ratios
 * @property {string} ratio=16:9 The element's aspect ratio
 *
 * https://every-layout.dev/
 */
export const frameL = (opts: Nullable<Opts>, ...body: unknown[]) => {
  const ratio = opts?.ratio || '16:9';

  const id = `Frame-${[ratio].join('')}`;
  const data = { id };

  addStyles({
    ratio,
    id,
  });

  return ['frame-l', { ...opts, data }, ...body];
};

const addStyles = ({ ratio, id }: FrameLOpts & { id: string }) => {
  if (document.getElementById(id)) {
    return;
  }

  const ratioSplitted = ratio.split(':');

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = `
    [data-id="${id}"] {
      aspect-ratio: ${ratioSplitted[0]} / ${ratioSplitted[1]};
    }
    `.replace(/\s\s+/g, ' ')
    .trim();
  document.head.appendChild(styleEl);
};
