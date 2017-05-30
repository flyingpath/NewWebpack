import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import RenderForcer from './app'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('app')
  )
}

render(RenderForcer)

if (module.hot) {
  module.hot.accept('./app', () => {
    render(RenderForcer)
  })
}

