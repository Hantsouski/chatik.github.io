import { circle } from '..';
import { abbreviatedName } from '../../common';

export const avatarCircle = (title: string) => circle({ body: abbreviatedName(title), width: '54px', height: '54px', color: 'orange' });
