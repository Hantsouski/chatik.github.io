import { fromView, syncRAF } from '@thi.ng/rstream';
import { DB } from './root';
import { map } from '@thi.ng/transducers';
import { AuthorizationStates } from './api';

export const auth = syncRAF(
  fromView(DB, {
    path: ['auth'],
  }),
);

export const isAuthorized = auth.transform(
  map(state => state === AuthorizationStates.Ready),
);