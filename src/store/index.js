import { createStore, combineReducers, applyMiddleware } from 'redux';

import reporter from './middleware/reporter.js';
import thunk from './middleware/thunk.js';
import APIreducer from './reducers/app.js';

let reducers = combineReducers({
  app: APIreducer,
});

export default () => createStore(reducers, applyMiddleware(thunk, reporter));

// , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
