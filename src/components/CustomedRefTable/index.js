import React, { Component } from 'react';
import RefMultipleTableBase from './RefMultipleTableBase';
import RefWithInput from 'ref-core/lib/refs/RefCoreWithInput.js';
import { createRefModal, createRefInput } from 'ref-core/lib/utils/createApi.js';
import RefCoreGlobal from 'ref-core/lib/refs/RefCoreGlobal';

import './index.less';

function RefMultipleTable(props){
    return (
        <RefCoreGlobal {...props}>
            <RefMultipleTableBase strictMode={true} />
        </RefCoreGlobal>
    )
}
function createRefMultipleTable(selector, props, callback){
    return createRefInput(selector, <RefMultipleTableWithInput />, props , (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
}
function createRefMultipleTableModal(props, callback){
    return createRefModal({
        component: <RefMultipleTable />, 
        ...props 
    }, (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
}

class RefMultipleTableWithInput extends Component {
    render(){
        return (
            <RefWithInput {...this.props}>
                <RefMultipleTableBase />
            </RefWithInput>
        )
    }
}

export default RefMultipleTableWithInput;
export {
    RefMultipleTable, 
    createRefMultipleTable,  
    createRefMultipleTableModal,
    RefWithInput
};