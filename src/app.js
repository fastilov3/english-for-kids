'use strict';

import store from './store';
import { setTestWords } from './store/actions';

import Home from './pages/Home';
import Category from './pages/Category';
import DifficultWords from './pages/DifficultWords';
import Statistics from './pages/Statistics';
import Error404 from './pages/Error404';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Utils from './services/Utils';
import { fadeOut } from './helpers';

// import 'materialize-css/sass/materialize.scss';
import './sass/app.scss';

// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
  '/': Home,
  '/category/:id': Category,
  '/difficult-words': DifficultWords,
  '/statistics': Statistics,
};

(async () => {
  const header = null || document.getElementById('header_container');
  const footer = null || document.getElementById('footer_container');

  // Render the Header and footer of the page
  header.innerHTML = await Navbar.render();
  await Navbar.after_render();
  footer.innerHTML = await Footer.render();
  await Footer.after_render();
})();

let unsubscribe;

// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {
  document.querySelector('.switch--train').classList.remove('hide');
  unsubscribe && unsubscribe();
  store.dispatch(setTestWords([]));

  // Lazy load view element:
  const content = null || document.getElementById('page_container');

  // Get the parsed URl from the addressbar
  let request = Utils.parseRequestURL();

  // Parse the URL and if it has an id part, change it with the string ":id"
  let parsedURL =
    (request.resource ? '/' + request.resource : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? '/' + request.verb : '');

  // Get the page from our hash of supported routes.
  // If the parsed URL is not in our list of supported routes, select the 404 page instead
  let page = routes[parsedURL] ? routes[parsedURL] : Error404;
  content.innerHTML = await page.render();
  await page.after_render();

  unsubscribe = store.subscribe(async () => {
    content.innerHTML = await page.render();
    await page.after_render();
  });

  /* Set active class */
  const hash = new URL(location).hash;
  const links = document.querySelectorAll('.sidenav > li > a');
  for (let link of links) {
    link.parentElement.classList.remove('active');
    if (new URL(link.href).hash === hash) link.parentElement.classList.add('active');
  }

  /* Hide switch */
  if (hash === '#/statistics') {
    document.querySelector('.switch--train').classList.add('hide');
  }
};

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', async () => {
  await router();

  fadeOut(document.querySelector('.preloader'));
});
