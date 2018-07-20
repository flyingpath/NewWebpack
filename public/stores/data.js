import {observable, action} from 'mobx' 
import { toJS } from 'mobx' 
import _ from 'lodash' 

import moment from 'moment'

class DataStore {
    @observable dataList = []

    @action
    setObs( array ) {
        _.forEach( array, (x)=>{
            this[ x[0] ] = x[1]
        } )
    }

}

const dataStore = new DataStore

export default dataStore