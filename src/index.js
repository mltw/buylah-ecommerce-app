import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { requestItems, validateUser } from './reducers'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import ThunkMiddleware from 'redux-thunk';
import { Auth0Provider } from "@auth0/auth0-react";

const rootReducer = combineReducers({requestItems, validateUser});

const store = createStore(rootReducer, applyMiddleware(ThunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
        <Auth0Provider
            domain="dev-19-f7ed9.us.auth0.com"
            clientId="Y9up96uqNux3AbuvMmixlyD43Srxa3an"
            redirectUri="http://localhost:3000/"
            audience="https://dev-19-f7ed9.us.auth0.com/api/v2/"
            scope="read:current_user update:current_user_metadata"
        >
            <App />
        </Auth0Provider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
