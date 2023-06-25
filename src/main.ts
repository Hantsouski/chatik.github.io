import './style.css';

import { $compile } from '@thi.ng/rdom';

const app = [
  'h1', {}, 'Hello'
]

$compile(app).mount(document.getElementById('app')!);

