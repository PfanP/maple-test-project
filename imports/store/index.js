import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import createReducer from '../reducers';

const store = createStore(
    createReducer(),
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;