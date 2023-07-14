import { fromView, metaStream, syncRAF } from '@thi.ng/rstream';
import { distinct, filter } from '@thi.ng/transducers';
import { DB, User, isAuthorized, isUserUpdates } from '.';
import telegram from '../data-access/telegram/telegram';

const telegramUsers = telegram.users();

telegram.updates().on('any', update => {
  if (isUserUpdates(update['@type'])) {
    updateUser(update.user as unknown as User);
  }
});


export const updateUser = (user: User) => {
  DB.resetIn(['users', user.id], user);
}

export const getUser = (id: number) => {
  const xs = users.deref()!;

  return xs[id];
}

export const users = syncRAF(
  fromView(DB, { path: ['users' ]}), { id: 'users' }
);

export const me = syncRAF(
  fromView(DB, { path: ['me' ]}), { id: 'me' }
);

const setMe = (me: User) => DB.resetIn(['me'], me);

export const isMe = (id: number) => {
  return me.deref()!.id === id;
}

isAuthorized
  .transform(filter(Boolean))
  .subscribe(metaStream(() => me))
  .transform(
    filter(x => !x),
    distinct(),
  ).subscribe(({ next: async () => {
    setMe(await telegramUsers.getMe())
  }}));
