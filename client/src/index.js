import React from 'react';
import ReactDOM from 'react-dom';
import Index from './pages/Index';
import Tournament from './pages/Tournament';
import rootReducer from './reducers/reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
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
