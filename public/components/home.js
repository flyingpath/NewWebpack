import React, { Component } from 'react'
import { toJS } from 'mobx'
import _ from 'lodash'

import dataStore from '../stores/data'

import '../css/style.css'
import Ali from '../pictures/ali.jpg'
import 'semantic-ui-css/semantic.min.css'
import 'tachyons/css/tachyons.min.css'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <div >
                1234567
                <img src={Ali} />
                <i aria-hidden="true" className="heart icon" ></i>
            </div>
        )
    }

}

export default Home