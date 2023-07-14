import { div } from '@thi.ng/hiccup-html';

import './bubble.css';

interface BubbleOpts {
  named: boolean;
  straightCorner: 'left' | 'right';
}

export const bubble = (opts: Partial<BubbleOpts>, ...body: any[]) => {
  const straightCorner = opts?.straightCorner;

  return div({ class: `bubble ${straightCorner ? `bubble--${straightCorner}` : ''}` }, div({ class: 'bubble-interior' }, ...body));
}
