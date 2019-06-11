
import request from "utils/request";
import { deepClone } from 'utils';

//定义接口地址
const URL = {
    "GET_LIST": `${GROBAL_HTTP_CTX}/group_allowances/list`,
    "GET_LIST_NEW": `${GROBAL_HTTP_CTX}/group_allowances/listByGroup`,
    "GET_GROUP_EXCEL_DATA": `${GROBAL_HTTP_CTX}/group_allowances/dataForGroupExcel`
}

/**
 * 获取聚合主列表
 */
export const loadMasterTableList = (data = {}) => {
    return request(URL.GET_LIST, {
        method: "post",
        data,
        param: data.pageParams
    });
}

/**
 * 获取聚合子列表
 */
export const loadSubTableList = (data = {}) => {
    return request(URL.GET_LIST, {
        method: "post",
        data,
        param: data.pageParams
    });
}

/**
 * 获得分组数据
 */
export const loadGroupTableList = (data = {}) => {
    //let result = deepClone(data);
    //let pageParams = deepClone(result.pageParams);
    //delete result.pageParams;
    return request(URL.GET_LIST_NEW, {
        method: "post",
        data: data,
        param: data.pageParams
    });
}

//获取分组条件下导出的所有数据
export const getDataForGroupExcel = (data = {}) => {
    return request(URL.GET_GROUP_EXCEL_DATA, {
        method: "post",
        data: data,
        param: data.pageParams
    });
}



