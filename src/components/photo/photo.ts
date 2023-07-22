import { fromPromise } from '@thi.ng/rstream';
import { ImageAttribs, img } from '@thi.ng/hiccup-html';
import { $refresh } from '@thi.ng/rdom';
import { File, fetchFile } from '../../state';

export const photo = (attribs: Partial<ImageAttribs>, file: File, whileLoading?: any) => {
  const src = fromPromise(fetchFile(file));

  return $refresh(
    src,
    async src => img({ ...attribs, src, loading: 'lazy' }),
    async () => whileLoading || '',
    async () => whileLoading || img({ ...attribs }),
  );
};
