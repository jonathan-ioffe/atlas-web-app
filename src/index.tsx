import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { CookiesProvider } from 'react-cookie'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
