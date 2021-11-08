export function set(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}

export function get(name, substitute = null) {
  return JSON.parse(window.localStorage.getItem(name)) || substitute;
}

export function updateStorage({ word }, fieldType) {
  // let wordIndex = -1;
  const historyWords = get('historyWords', {});

  //wordIndex = historyWords.findIndex((item) => item.word === word.word);

  if (historyWords[word] !== undefined) {
    historyWords[word] = {
      ...historyWords[word],
      [fieldType]: historyWords[word][fieldType] ? historyWords[word][fieldType] + 1 : 1,
    };
  } else {
    historyWords[word] = { [fieldType]: 1 };
  }

  set('historyWords', historyWords);
}

export default {
  set,
  get,
  updateStorage,
};
