import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
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
        dataStore.getUserInfo()
    }

    inputNHICode(e){
        dataStore.loadSysstd(e.target.value)
        dataStore.loadpPreData(e.target.value)
    }

    onChangeInput(key, value){

        let data = Object.assign( {}, toJS(dataStore.data) )
        data[key] = value
        
        dataStore.setObs([ ['data', data] ])
    }
    
    deleteImg = (e, idx) => {
        let data = Object.assign( {}, toJS(dataStore.data) )
        data.IMGS[idx] = 'delete'
        document.querySelector(`#file${ parseInt(idx+1) }`).value = ''
        dataStore.setObs([ ['data', data] ])
    }
    
    pickFiles = (e, idx) => {
        let files = e.target.files
        const firstFileLength = files.length

        files = _.filter( files, (x)=>{
            return !( x.type !== 'image/jpeg' && x.type !== 'image/png' )
        } )

        let data = Object.assign( {}, toJS(dataStore.data) )
        
        if (files.length!==firstFileLength){
            alert( '只能上傳 jpeg, png' )
            data.IMGS[idx] = null
            e.target.value = ''

        }else{
            data.IMGS[idx] = files[0]
        }

        dataStore.setObs([ ['data', data] ])
    }

    render() {
        
        return (
            <div ref={(div)=>{this.backgroundDiv=div}} id = 'home'>
                <p>自費特財輸入</p>
                <div className='row selfInput' >
                    <div className='labelCol'>
                        { dataStore.dataDic[ 'CODE_NO' ] }
                    </div>
                    <div className='valueCol'>
                        <input type='textarea' 
                            onBlur={ this.inputNHICode } 
                            value = {dataStore.data.CODE_NO}
                            onChange = { (e)=>{ this.onChangeInput( 'CODE_NO', e.target.value ) } }
                        />
                    </div>
                </div>
                <AutoInputList data = {dataStore.data} />
                <SelfInputList data = {dataStore.data} onChange={ this.onChangeInput } />
                <div className='IMGS'>
                    { dataStore.dataDic['IMGS'] }
                </div>
                <div className = 'flexColumn'>
                    <input 
                        type="file" id="file1" name="file1"
                        className = 'imageInput' 
                        onChange = { (e)=>{this.pickFiles(e, 0) } } 
                        accept   = "image/png,image/jpeg"
                    />
                    <input 
                        type="file" id="file2" name="file2" 
                        className = 'imageInput' 
                        onChange = { (e)=>{this.pickFiles(e, 1) } } 
                        accept   = "image/png,image/jpeg"
                    />
                    <input 
                        type="file" id="file3" name="file3" 
                        className = 'imageInput' 
                        onChange = { (e)=>{this.pickFiles(e, 2) } } 
                        accept   = "image/png,image/jpeg"
                    />
                </div>
                <div>
                    {
                        _.map( dataStore.data.IMGS, (x, idx)=>{
                            if( x && x != 'delete' ){
                                const url = typeof x === 'string'? x:URL.createObjectURL(x)
                                return (
                                    <div key={idx} style={{position:'relative'}}>
                                        <img src={url} width={300}  />
                                        <div onClick = { (e)=>{this.deleteImg(e, idx) } } className='deleteImg'>
                                            一
                                        </div>
                                    </div>
                                )
                            }
                        } )
                    }
                </div>
                <div className='footer'>
                    <button onClick={ ()=>{ dataStore.saveData() } } >存檔</button>
                </div>
            </div>
        )
    }

}

const AutoInputList = (props) =>{

    const autoList = [
        'NHI_CODE',
        'CODE_NAME',
        'class',
        'STD_PRICE',
    ]

    return autoList.map((data, idx)=>(
        <div className='row autoInput' key={idx} >
            <div className='labelCol'>
                { dataStore.dataDic[data] }
            </div>
            <div className='valueCol'>
                { props.data[ data ] || '' }
            </div>
        </div>
    ))

}

const SelfInputList = (props) =>{
    
    const selfList = [
        'NHI_IDNO',
        'NHI_STATUS',
        'MAJOR_DEPT',
        'SPEC',
        'NHI_DIFF',
        'SUPPLIER',
        // 'OTHERS',
        'SIDE_EFFECT',
        'NOTICES',
        'REMARK'
    ]

    return selfList.map(( data, idx )=>(
        <div className='row selfInput' key={idx} >
            <div className='labelCol'>
                { dataStore.dataDic[ data ] }
            </div>
            <div className='valueCol'>
                <textarea 
                    row = {1}
                    onChange={ (e)=>props.onChange( data, e.target.value ) } 
                    value = { props.data[ data ] } 
                />
            </div>
        </div>
    ))

}


export default observer(Home)