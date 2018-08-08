import React from 'react';
import ReactDOM from 'react-dom';
import Index from './pages/Index';
import Tournament from './pages/Tournament';
import rootReducer from './reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logger from 'redux-logger';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    logger
  )
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/tournament/:id" component={Tournament} />
      </Switch>
    </Router>
  </Provider>,
  document.querySelector('#root')
);

registerServiceWorker();
