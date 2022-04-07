import React from "react";
import {NavigationStack, LaunchScreenNav }from "./navigation/NavigationContainer";
import {init} from "./helpers/db"

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from "redux-thunk"
import CartsReducer from "./store/reducers/CartsReducer"


init().then(() => {
  console.log("Initialized database");
}).catch(err => {
  console.log("Initializing database failed. = ", err)
})


export default function App() {

  const rootReducer = combineReducers({
    carts: CartsReducer
  })
  
  const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

  return (
    <Provider store={store}>
      <LaunchScreenNav />
    </Provider>
  );
}

