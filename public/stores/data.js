import {observable, action} from 'mobx' 
import { toJS } from 'mobx' 
import _ from 'lodash' 

import moment from 'moment'

class DataStore {
    @observable dataList = []
    @observable data = {
        CODE_NO   : '',
        NHI_STATUS: '',
        NHI_IDNO  : '', 
        MAJOR_DEPT: '',
        SPEC      : '',
        SIDE_EFFECT: '',
        NOTICES   : '',
        NHI_DIFF  : '',
        SUPPLIER  : '',
        // OTHERS    : '',
        REMARK    : '',
        IMGS      : [ null, null, null ],

        NHI_CODE  : '',
        class     : '',
        NHI_CODE  : '',
        CODE_NAME : '',
        STD_PRICE : '',
    }

    userInfo = { }

    dataDic  = {
        CODE_NO   : '特材代碼',
        NHI_STATUS: '健保審議狀態',
        NHI_IDNO  : '許可證號', 
        MAJOR_DEPT: '主要使用單位',
        SPEC      : '產品用途與特性',
        SIDE_EFFECT: '副作用',
        NOTICES   : '使用注意事項',
        NHI_DIFF  : '相較健保產品差異',
        SUPPLIER  : '供應廠商',
        // OTHERS    : '其它',
        REMARK    : '備註',
        IMGS      : '影像/檔案上傳',

        NHI_CODE  : '健保代碼',
        CODE_NAME : '健保自費碼',
        class     : '特材類別',
        STD_PRICE : '自費價',
    }

    typeDic = {
        B : '容器類',
        C : '管套類',
        F : '許可證號', 
        N : '主要使用單位',
        S : '產品用途與特性',
        T : '副作用',
        W : '使用注意事項',
        Y : '相較健保產品差異'
    }

    @action
    setObs( array ) {
        _.forEach( array, (x)=>{
            this[ x[0] ] = x[1]
        } )
    }

    getUserInfo = () => {
        fetch('https://emr.kfsyscc.org/userinfo', {credentials: 'include'})
        .then((x) => x.json())
        .then((backdata) => {
            try {
                this.setObs( [ [ 'userInfo', backdata.user ] ] )
            }
            catch (error) {
                window.location = `https://emr.kfsyscc.org/signin/index.html?next=/utils/LabReference/`
            }
        })
    }


    loadpPreData = (code) => {
        const urlstr = "https://ehis.kfsyscc.org/service"

        const data = {
            "api": "restfulApi",
            "database":"test",
            "method": "GET",
            "tableName": "SYSSTDSPMT",
            "queryItem": { 
                "CODE_NO": code 
            }
        }

        fetch( urlstr, { 
            credentials : 'include', 
            body        : JSON.stringify(data),
            method      : 'POST'
        } )
        .then( (x)=>x.json() )
        .then( ( backdata ) => {
            
            if ( !backdata.status || backdata.data.length == 0 ){
                return false
            }
            
            const data = backdata.data[0]

            data.IMGS = []
            data.IMGS[0] = data.IMG1? data.IMG1.replace( '172.16.254.11', 'http://172.21.42.23:8555/files/nas1' ): ''
            data.IMGS[1] = data.IMG2? data.IMG2.replace( '172.16.254.11', 'http://172.21.42.23:8555/files/nas1' ): ''
            data.IMGS[2] = data.IMG3? data.IMG3.replace( '172.16.254.11', 'http://172.21.42.23:8555/files/nas1' ): ''
            
            delete data.UPDATE_DATE
            delete data.UPDATE_TIME
            delete data.USER_ID
            delete data.IMG1
            delete data.IMG2
            delete data.IMG3

            const newData = Object.assign( toJS(this.data), data )
            this.setObs( [ [ 'data', newData ] ] )

        })
    }

    loadSysstd = (code) => {

        const urlstr = "https://ehis.kfsyscc.org/service";

        const data = {
            "api": "restfulApi",
            "database":"production",
            "method": "GET",
            "tableName": "SYSSTD",
            "queryItem": { 
                "CODE_NO": code 
            }
        }

        fetch( urlstr, { 
            credentials : 'include', 
            body        : JSON.stringify(data),
            method      : 'POST'
        } )
        .then( (x)=>x.json() )
        .then( ( backdata ) => {
            const nowData = backdata.data.filter( (x)=>{
                let dateB = parseInt(x.DATE_B)
                let dateE = parseInt(x.DATE_E)

                let nowDate = parseInt( moment().format( 'YYYYMMDD' ) )
                
                return ( nowDate > dateB && nowDate < dateE )
            } )

            if (nowData.length>0){
                const oldData = nowData[0]

                let data = Object.assign( {}, this.data )
                data.CODE_NAME = oldData.CODE_NAME
                data.STD_PRICE = oldData.STD_PRICE
                data.NHI_CODE  = oldData.NHI_CODE
                data.class     = '人工機能代用類'

                if ( oldData.NHI_CODE ){
                    let firstWord = oldData.NHI_CODE.substring(0, 1)
                    if ( this.typeDic[ firstWord ] ){
                        data.class = this.typeDic[ firstWord ] 
                    }
                }
                dataStore.setObs([ ['data', data] ])
                
            }else{
                alert('無此醫令代碼')
            }
        } )
    }

    saveData = () => {
        console.log(  toJS(this.data) )
        let formData = new FormData()

        _.forEach( this.data, ( value, key )=>{
            if ( key === 'IMGS' ){
                _.forEach( value, ( data, index ) => {
                    formData.append( `IMG${ parseInt(index+1) }`, data )
                })
            } else {
                formData.append( key, value )
            }
        } )

        formData.append( 'api', 'SelfPayConsumables' )
        formData.append( 'USER_ID', this.userInfo.USER_ID )
        
        const urlstr = "http://172.21.42.23:8555/service";

        fetch( urlstr, { 
            credentials : 'include', 
            body        :  formData    ,
            method      : 'POST'
        } )
        .then( (x)=>x.json() )
        .then( ( data ) => {
            this.loadSysstd( this.data.CODE_NO )
        } )

    }
}

const dataStore = new DataStore

export default dataStore