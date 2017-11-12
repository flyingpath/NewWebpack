import React from 'react'
import ReactDOM from 'react-dom'

import register from './worker/register'
import Home from './components/home'


class RenderForcer extends React.Component {
    componentDidMount() {
        register()
    }

    render() {
        return (
            <Home />
        )
    }
}

export default RenderForcer
