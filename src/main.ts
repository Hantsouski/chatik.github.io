import { authPage, chatikPage } from './pages';
import { isAuthorized } from './state';

import './global-css/index.css';

import { $compile, $replace } from '@thi.ng/rdom';

const app = isAuthorized.map(authorized => (
  authorized
    ? chatikPage()
    : authPage
));

$compile($replace(app)).mount(document.getElementById('app')!);

