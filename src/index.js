import React from 'react';
import ReactDOM from 'react-dom';
import promise from "redux-promise";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

import App from './components/App';

import reducers from "./reducers";

require('./index.css');

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider 
    store={createStoreWithMiddleware(
      reducers, 
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      )}>
      <App />
  </Provider>, 
  document.getElementById('root')
);
