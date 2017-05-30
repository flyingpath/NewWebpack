import React, { Component } from 'react'
import { observer } from 'mobx-react'
import mobx from 'mobx'
import _ from 'lodash'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.clickSend = this.clickSend.bind(this)
    }
    clickSend(){
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

export default observer(Home)