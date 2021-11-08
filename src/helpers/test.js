import { shuffle } from './../helpers';
import storage from './../helpers/storage';

import Categories from '../cards';

import SuccessAudio from './../audio/success.mp3';
import ErrorAudio from './../audio/error.mp3';
import FailureAudio from './../audio/failure.mp3';
import WinAudio from './../audio/win.mp3';

let getWordsByCategoryId = async (id) => {
  return Categories.find((category) => category.id === id);
};

export const testStart = (categoryId) => {
  return new Promise((resolve, reject) => {
    if (!categoryId) reject(new Error('categoryId in not defined'));

    getWordsByCategoryId(categoryId)
      .then(({ list }) => resolve(shuffle(list)))
      .catch(reject);
  });
};

export const nextWord = (testWords) => {
  const audio = new Audio();
  let currentWordIndex = 0;
  let errorsCount = 0;
  let previewWord = null;
  let currentWord = testWords[currentWordIndex];

  const playAudio = (src, ms = 700) => {
    setTimeout(() => {
      audio.src = src;
      audio.play();
    }, ms);
  };

  return (word = null) => {
    // Success
    if (word && word === currentWord.word) {
      if (currentWordIndex + 1 === testWords.length) {
        storage.updateStorage(currentWord, 'successCount');

        audio.src = errorsCount === 0 ? WinAudio : FailureAudio;
        audio.play();

        return { status: 'completed', currentWord, errorsCount };
      }

      previewWord = currentWord;
      currentWordIndex += 1;
      currentWord = testWords[currentWordIndex];

      playAudio(SuccessAudio, 0);
      playAudio(currentWord.audioSrc);

      storage.updateStorage(previewWord, 'successCount');

      return { status: 'success', previewWord, currentWord, currentWordIndex, errorsCount };
    }
    // Error
    if (word && word !== currentWord.word) {
      playAudio(ErrorAudio, 0);

      storage.updateStorage(currentWord, 'errorsCount');

      errorsCount += 1;

      return { status: 'error', previewWord, currentWord, currentWordIndex, errorsCount };
    }

    playAudio(currentWord.audioSrc);

    return { status: 'pending', previewWord, currentWord, currentWordIndex, errorsCount };
  };
};
