import React, { Component } from 'react'
import { observer } from 'mobx-react'
import mobx from 'mobx'
import _ from 'lodash'

import dataStore from '../stores/data'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.clickSend = this.clickSend.bind(this)
    }
    clickSend(){
    }

    componentDidMount(){
        let body = document.querySelector('#body')
        let text = body.innerHTML
        const replaceText = 'sword'
        text = text.replace(replaceText, `<span style="color:red">${replaceText}<span>`)
        body.innerHTML = text
    }
    render() {
        return (
            <div>
             Hello
             <div id='body'>
                 you have my sword
             </div>
            </div>
        )
    }
}

export default observer(Home)