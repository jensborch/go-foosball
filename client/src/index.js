import React from 'react';
import ReactDOM from 'react-dom';
import Index from './pages/index';
import rootReducer from './reducers/reducers';
import {createStore} from 'redux';

const store = createStore(rootReducer);

ReactDOM.render(<Index />, document.querySelector('#root'));
