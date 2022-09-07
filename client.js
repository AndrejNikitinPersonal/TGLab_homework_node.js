import React from 'react'
import { hydrate } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import appReducer from './reducer.js'


const store = createStore(appReducer);
hydrate(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)