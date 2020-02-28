import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import community from './community'
import history from '../utils/history';


export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    community,
    router: connectRouter(history),
    ...injectedReducers,
  });
  return rootReducer;
}