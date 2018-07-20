import React from 'react'
import { hot } from 'react-hot-loader'

import Home from './components/home'

class App extends React.Component {
  render() {
    return (
        <Home />
    )
  }
}

export default hot(module)(App)
