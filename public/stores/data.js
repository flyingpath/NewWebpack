import {observable, action} from 'mobx' 
import mobx from 'mobx' 
import _ from 'lodash' 

class DataStore {
    @observable data = []
    @action
    load = ()=> {
        this.loaddata()
    }
    
    loaddata = ()=>{
    }

}

const dataStore = new DataStore

export default dataStore