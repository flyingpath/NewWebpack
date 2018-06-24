import React, { Component } from 'react'
import { observer } from 'mobx-react'
import mobx from 'mobx'
import _ from 'lodash'

import dataStore from '../stores/data'

import '../css/style.css'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    clickSend = ()=> {
    }

    componentDidMount(){
    }
    
    render() {
        return (
            <div ref={(div)=>{this.backgroundDiv=div}}>
                <div className="item" ref={(div)=>{this.body=div}}>
                    哈囉你好嗎
                </div>
            </div>
        )
    }
}

export default observer(Home)