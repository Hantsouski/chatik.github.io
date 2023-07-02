import { Nullable } from '@thi.ng/api';
import type { Attribs } from '@thi.ng/hiccup-html';

import './sidebar.css';

type Opts = Partial<Attribs & SidebarLOpts>;

interface SidebarLOpts {
  side: 'left' | 'right';
  sideWidth: string;
  contentMin: string;
  space: string;
  noStretch: boolean;
}

/**
 * @module sidebar-l
 * @description
 * A custom element for placing two elements side-by-side. If space permits, the sidebar element has a set width, and the companion takes up the rest of the available horizontal space. If not, the elements are collapsed into a single column, each taking up 100% of the horizontal space.
 * @property {string} side=left Which element to treat as the sidebar (all values but "left" are considered "right")
 * @property {string} sideWidth Represents the width of the sidebar _when_ adjacent. If not set (`null`) it defaults to the sidebar's content width
 * @property {string} contentMin=50% A CSS **percentage** value. The minimum width of the content element in the horizontal configuration
 * @property {string} space=var(--s1) A CSS margin value representing the space between the two elements
 * @property {boolean} noStretch=false Make the adjacent elements adopt their natural height
 *
 * https://every-layout.dev/
 */
export const sideBarL = (opts: Nullable<Opts>, ...body: unknown[]) => {
  const side = opts?.side || 'left';
  const sideWidth = opts?.sideWidth || '';
  const contentMin = opts?.contentMin || '50%';
  const space = opts?.space || 'var(--size-step-1)';
  const noStretch = !!opts?.noStretch;

  if (!contentMin.includes('%')) {
    console.warn('The value for each <sidebar-l> `contentMin` property should be a percentage. Otherwise overflow is likely to occur');
  }

  const id = `Sidebar-${[side, sideWidth, contentMin, space, noStretch].join('')}`;
  const data = { id };

  addStyles({
    side,
    sideWidth,
    contentMin,
    space,
    noStretch,
    id,
  });

  return ['sidebar-l', { ...opts, data }, ...body];
};

const addStyles = ({
  side,
  sideWidth,
  contentMin,
  space,
  noStretch,
  id,
}: SidebarLOpts & { id: string }) => {
  if (document.getElementById(id)) {
    return;
  }

  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.innerHTML = `
    [data-id="${id}"] {
      gap: ${space};
      ${noStretch ? 'align-items: flex-start;' : ''}
    }

    [data-id="${id}"] > * {
      ${sideWidth ? `flex-basis: ${sideWidth};` : ''}
    }

    [data-id="${id}"] > ${side !== 'left' ? `:first-child` : `:last-child`} {
      flex-basis: 0;
      flex-grow: 999;
      min-inline-size: ${contentMin};
    }`
    .replace(/\s\s+/g, ' ')
    .trim();
  document.head.appendChild(styleEl);
};
