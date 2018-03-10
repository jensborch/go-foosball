import React from 'react';
import ReactDOM from 'react-dom';
import Index from './pages/index';
import rootReducer from './reducers/reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
  )
);
ReactDOM.render(
  <Provider store={store}>
    <Index />
  </Provider>,
  document.querySelector('#root')
);
