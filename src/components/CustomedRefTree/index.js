import React from 'react';
import ReactDOM from 'react-dom';
import RefTreeBase from './RefTreeBase';
import RefWithInput from 'ref-core/lib/refs/RefCoreWithInput.js';
import {createRefModal, createRefInput} from 'ref-core/lib/utils/createApi.js';
import RefCoreGlobal from 'ref-core/lib/refs/RefCoreGlobal';
import 'ref-core/css/refcore.css';
import './index.less'
const RefTree = (props) =>{
    return (
        <RefCoreGlobal {...props} className="ref-walsin-modal">
            <RefTreeBase />
        </RefCoreGlobal>
    )
};

function createRefTree(props, callback){
   return createRefModal({
        component: <RefTree />, 
        ...props 
    }, (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
}
function createRefTreeWithInput(selector,props, callback){
    return createRefInput(selector, <RefTreeWithInput />, props , (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
 }

function RefTreeWithInput (props){
    return (
        <RefWithInput {...props} >
            <RefTree />
        </RefWithInput>
    )
}

export default RefTreeWithInput;
export {
    RefTree,  
    createRefTree,
    createRefTreeWithInput
};
