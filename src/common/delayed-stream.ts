import { delayed } from '@thi.ng/compose';
import { stream } from '@thi.ng/rstream';

export const delayedStream = (delay: number) => (n: any) => {
  return stream(o => {
    delayed(n, delay).then(x => {
      o.next(x);
      o.done();
    });
  });
};
