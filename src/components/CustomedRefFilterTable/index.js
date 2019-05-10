import React, { Component } from 'react';
import RefFilterTableBase from './RefFilterTableBase';
import RefWithInput from 'ref-core/lib/refs/RefCoreWithInput.js';
import { createRefModal, createRefInput } from 'ref-core/lib/utils/createApi.js';
import RefCoreGlobal from 'ref-core/lib/refs/RefCoreGlobal';

import './index.less';

function RefFilterTable(props){
    return (
        <RefCoreGlobal {...props}>
            <RefFilterTableBase />
        </RefCoreGlobal>
    )
}
function createRefFilterTable(selector, props, callback){
    return createRefInput(selector, <RefFilterTableWithInput />, props , (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
}
function createRefFilterTableModal(props, callback){
    return createRefModal({
        component: <RefFilterTable />, 
        ...props 
    }, (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
}

class RefFilterTableWithInput extends Component {
    render(){
        return (
            <RefWithInput {...this.props}>
                <RefFilterTableBase />
            </RefWithInput>
        )
    }
}

export default RefFilterTableWithInput;
export {
    RefFilterTable, 
    createRefFilterTable,  
    createRefFilterTableModal,
    RefWithInput
};