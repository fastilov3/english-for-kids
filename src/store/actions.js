import * as types from './types';

export const setStatus = (status) => ({
  type: types.SET_STATUS,
  payload: status,
});

export const setTestWords = (words) => ({
  type: types.SET_TEST_WORDS,
  payload: words,
});
