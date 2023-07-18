import { TextAreaAttribs, div, textArea } from '@thi.ng/hiccup-html';
import { ISubscription } from '@thi.ng/rstream';

import './autogrow-textarea.css';

export const autogrowTextArea = (attr: Partial<TextAreaAttribs>, src: ISubscription<string, string>) => {
  return div(
    {
      class: 'autogrow-textarea-container',
      data: { replicatedValue: src },
    },
    textArea({ ...attr, value: src, oninput: (e) => src.next((<HTMLTextAreaElement>e.target).value) }),
  );
};
