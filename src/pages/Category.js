import store from './../store';
import { setTestWords } from '../store/actions';

import Utils from './../services/Utils.js';
import Categories from '../cards';

import SadSmileImage from './../img/sad-smile.png';
import HappySmileImage from './../img/happy-smile.png';

import storage from './../helpers/storage';
import { testStart, nextWord } from './../helpers/test';

let getCardsById = async (id) => {
  return Categories.find((category) => category.id === id);
};

let Category = {
  render: async () => {
    const {
      app: { status, isTesting },
    } = store.getState();

    let request = Utils.parseRequestURL();
    let category = await getCardsById(request.id);

    let btn = null;
    if (status === 'TEST') {
      btn = `<dic class="test-controls-group">${
        !isTesting
          ? `<a id="start-test-btn" class="waves-effect waves-light btn">Start Test</a>`
          : `<a id="replay-audio" class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">refresh</i></a>`
      }</div>`;
    }

    return /*html*/ `
            <section id="category-section" class="section category-section">
                <div class="category-header">
                  <h1 class="category-title">${category.title}</h1>
                  ${isTesting ? '<div id="test-starts" class="test-starts"></div>' : ''}
                </div>
                <div class="row">
                    ${category.list
                      .map((card) => {
                        return `
                            <div class="col xl3 l4 m6 s12">
                              <div data-card data-word="${card.word}" data-audio="${
                          card.audioSrc
                        }" class="flip-card">
                                    <div class="flip-card-inner">
                                        <div class="flip-card-front">
                                            <div class="flip-card__image-wrapper">
                                                <img class="flip-card__image" src="img/cards/${
                                                  card.image
                                                }">
                                                ${
                                                  status === 'TRAINING'
                                                    ? `<a class="flip-card__refresh btn-floating halfway-fab waves-effect waves-light teal"><i class="material-icons" data-refresh>refresh</i></a>`
                                                    : ''
                                                }
                                            </div>
                                            ${
                                              status === 'TRAINING'
                                                ? `<div class="flip-card__content">
                                                      <span class="flip-card__title grey-text text-darken-4">${card.word}</span>
                                                  </div>`
                                                : ''
                                            }
                                        </div>
                                        ${
                                          status === 'TRAINING'
                                            ? `<div class="flip-card-back">
                                                  <div class="flip-card__image-wrapper">
                                                      <img class="flip-card__image" src="img/cards/${card.image}">
                                                  </div>
                                                  <div class="flip-card__content">
                                                      <span class="flip-card__title grey-text text-darken-4">${card.translation}</span>
                                                  </div>
                                              </div>`
                                            : ''
                                        }
                                    </div>
                                </div>
                            </div>
                      `;
                      })
                      .join('\n ')}
                </div>

                ${btn || ''}
            </section>
    `;
  },
  after_render: async () => {
    const audio = new Audio();

    const {
      app: { status, isTesting, testWords },
    } = store.getState();

    let testState = null;
    const goToNextWord = nextWord(testWords);
    if (isTesting) {
      testState = goToNextWord();
    }

    const cards = document.querySelectorAll('[data-card]');

    for (let card of cards) {
      card.addEventListener('click', (e) => {
        const { target } = e;

        if (target.dataset.refresh !== undefined) {
          card.classList.add('is-flipped');
          return;
        }

        const el = target.closest('[data-card]');
        if (status === 'TRAINING' && el && !el.classList.contains('is-flipped')) {
          storage.updateStorage({ word: el.dataset.word }, 'count');
          audio.src = card.dataset.audio;
          audio.play();
        }

        if (isTesting && el && !el.classList.contains('disabled')) {
          // eslint-disable-next-line no-unused-vars
          testState = goToNextWord(el.dataset.word);

          if (testState.status === 'success') {
            el.classList.add('disabled');
            document
              .getElementById('test-starts')
              .insertAdjacentHTML('beforeend', '<i class="material-icons">star</i>');
          }
          if (testState.status === 'error') {
            document
              .getElementById('test-starts')
              .insertAdjacentHTML('beforeend', '<i class="material-icons">star_border</i>');
          }

          if (testState.status === 'completed') {
            document
              .getElementById('category-section')
              .classList.add('category-section--test-completed');
            if (testState.errorsCount === 0) {
              document.getElementById('category-section').innerHTML = /*html*/ `
                <img src="${HappySmileImage}" alt="Happy Smile" />
              `;
            } else {
              document.getElementById('category-section').innerHTML = /*html*/ `
                <div class="test-error-count">${testState.errorsCount} errors</div>
                <img src="${SadSmileImage}" alt="Sad Smile" />
              `;
            }

            setTimeout(() => (location.href = '#/'), 2000);
          }
        }
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-flipped');
      });
    }

    const startTestBtn = document.getElementById('start-test-btn');
    if (startTestBtn) {
      startTestBtn.addEventListener('click', () => {
        let request = Utils.parseRequestURL();
        testStart(request.id)
          .then((words) => store.dispatch(setTestWords(words)))
          .catch((error) => console.error(error));
      });
    }

    const replayAudio = document.getElementById('replay-audio');
    if (replayAudio) {
      replayAudio.addEventListener('click', () => {
        audio.src = testState.currentWord.audioSrc;
        audio.play();
      });
    }
  },
};

export default Category;
