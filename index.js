// ⚡️ Import Styles
import feather from 'feather-icons';
import './style.scss';
import App from './classes/App.js';
import { capitalStr } from './modules/capitalStr.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div id='root' class='editor'></div>
  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>`;

// ⚡️ Class instance
new App(document.querySelector('#root'));

