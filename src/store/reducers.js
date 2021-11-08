import * as types from './types';
import { combineReducers } from 'redux';

const initialState = {
  status: 'TRAINING', // TRAINING | TEST
  isTesting: false,
  testWords: [],
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_STATUS:
      return {
        ...state,
        status: action.payload,
        isTesting: action.payload === 'TRAINING' ? false : state.isTesting,
        testWords: action.payload === 'TRAINING' ? [] : state.testWords,
      };
    case types.SET_TEST_WORDS:
      return {
        ...state,
        isTesting: !!action.payload.length,
        testWords: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
});
