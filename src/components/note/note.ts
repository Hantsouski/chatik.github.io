import { Attribs, para } from '@thi.ng/hiccup-html';

import './note.css';

export const note = (attribs: Partial<Attribs>, ...body: any[] ) => para({ class: 'note', ...attribs }, ...body);
