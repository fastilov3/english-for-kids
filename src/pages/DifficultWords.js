import store from './../store';
import { setTestWords } from '../store/actions';

import storage from './../helpers/storage';
import { nextWord } from './../helpers/test';

import Categories from '../cards';
import { shuffle } from '../helpers';

const getDifficultWords = async () => {
  const historyWords = storage.get('historyWords', {});

  const difficultWordsEntries = Object.entries(historyWords)
    .filter((word) => !!word[1]['errorsCount'])
    .concat()
    .sort((a, b) => b[1].errorsCount - a[1].errorsCount)
    .slice(0, 8);

  const difficultWords = Object.fromEntries(difficultWordsEntries);

  const allWords = Categories.map((category) => category.list).flat();
  return allWords.filter(({ word }) => !!difficultWords[word]);
};

let DifficultWords = {
  render: async () => {
    const {
      app: { status, isTesting },
    } = store.getState();

    let difficultWords = await getDifficultWords();

    let btn = null;
    if (status === 'TEST') {
      btn = `<dic class="test-controls-group">${
        !isTesting
          ? `<a id="start-test-btn" class="waves-effect waves-light btn">Start Test</a>`
          : `<a id="replay-audio" class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">refresh</i></a>`
      }</div>`;
    }

    return /*html*/ `
            <section id="difficult-words-section" class="section difficult-words-section">
                <div class="difficult-words-header">
                  <h1 class="difficult-words-title">Difficult Words</h1>
                  ${isTesting ? '<div id="test-starts" class="test-starts"></div>' : ''}
                </div>
                <div class="row">
                    ${difficultWords
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
              .getElementById('difficult-words-section')
              .classList.add('difficult-words-section--test-completed');
            if (testState.errorsCount === 0) {
              document.getElementById('difficult-words-section').innerHTML = /*html*/ `
                <img src="img/happy-smile.png" alt="Happy Smile" />
              `;
            } else {
              document.getElementById('difficult-words-section').innerHTML = /*html*/ `
                <div class="test-error-count">${testState.errorsCount} errors</div>
                <img src="img/sad-smile.png" alt="Sad Smile" />
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
      startTestBtn.addEventListener('click', async () => {
        let difficultWords = await getDifficultWords();
        store.dispatch(setTestWords(shuffle(difficultWords)));
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

export default DifficultWords;
