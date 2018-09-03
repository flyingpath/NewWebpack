import {observable, action} from 'mobx' 
import { toJS } from 'mobx' 
import _ from 'lodash' 

import moment from 'moment'

class DataStore {
    @observable dataList = []

    @action
    setObs(keyValues) {
        _.forIn(keyValues, ( value, key )=>{
            this[ key ] = value
        })
    }

}

const dataStore = new DataStore

export default dataStore