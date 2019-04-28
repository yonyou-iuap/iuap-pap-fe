import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";

import { processData } from 'utils';

export default {
    // 确定 Store 中的数据模型作用域
    name: "RefExample",
    // 设置当前 Model 所需的初始化 state
    initialState: {

    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) { //更新state
            return {
                ...state,
                ...data
            };
        }
    },
    effects: {
        getMsg: () => {
            actions.helloworld.updateState({
                helloMsg: 'helloworld3'
            })
        }
    }
};
