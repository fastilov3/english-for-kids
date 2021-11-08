import store from './../store';
import M from 'materialize-css';
import Categories from '../cards';

import { setStatus } from './../store/actions';

let getCategoriesList = async () => {
  return Categories;
};

let Navbar = {
  render: async () => {
    let categories = await getCategoriesList();

    return /*html*/ `
        <nav class="navigation">
            <div class="navigation__content container">
                <a href="javascript:void(0)" data-target="slide-out" class="sidenav-trigger show-on-large"><i class="material-icons">menu</i></a>
                <a href="#/" class="navigation__logo">
                  <h5 class="hide-on-small-only">English For Kids</h5>
                </a>
                <div class="switch switch--train">
                    <label>
                        Train
                        <input id="switch-train" type="checkbox">
                        <span class="lever"></span>
                        Play
                    </label
                </div>
        </nav>

        <ul id="slide-out" class="sidenav">
            <li class="sidenav__header">
              <h5 class="sidenav__logo">English For Kids</h5>
              <button id="sidenav-close" class="sidenav__close"><i class="material-icons">close</i></button>
            </li>
            <li><a class="waves-effect" href="#/">Home</a></li>
            ${categories
              .map(
                (category) =>
                  `<li><a class="waves-effect" href="#/category/${category.id}">${category.title}</a></li>`,
              )
              .join('\n ')}
            <li class="divider"></li>
            <li><a class="waves-effect" href="#/statistics">STATISTICS</a></li>
        </ul>
    `;
  },
  after_render: async () => {
    const hash = new URL(location).hash;

    const elem = document.getElementById('slide-out');
    // eslint-disable-next-line no-undef
    const instance = M.Sidenav.init(elem);

    const links = elem.querySelectorAll('li > a');
    for (let link of links) {
      if (new URL(link.href).hash === hash) link.parentElement.classList.add('active');

      link.addEventListener('click', () => {
        instance.close();
      });
    }

    document.getElementById('sidenav-close').addEventListener('click', () => {
      instance.close();
    });

    document.getElementById('switch-train').addEventListener('click', () => {
      const { app } = store.getState();
      store.dispatch(setStatus(app.status === 'TEST' ? 'TRAINING' : 'TEST'));
      document.body.classList.remove('app--training', 'app--test');
      document.body.classList.add(app.status === 'TEST' ? 'app--training' : 'app--test');
    });
  },
};

export default Navbar;
