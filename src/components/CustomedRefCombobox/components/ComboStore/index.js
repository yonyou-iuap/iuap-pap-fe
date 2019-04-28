import React, { PureComponent, Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import shallowequal from 'shallowequal';
import { is, Map, fromJS } from 'immutable';

// import {Loading} from 'tinper-bee';
import Loading from 'bee-loading';
// import 'bee-loading/build/Loading.css';
import request from '../../utils/request';

import ComboItem from '../ComboItem';
import Pagination from '../Pagination';


const propTypes = {
    ajax: PropTypes.object,
    // displayField?: string | Function,
    // valueField?: string,
    afterLoad: PropTypes.func,
    reload: PropTypes.bool,
    strictMode: PropTypes.bool //严格模式
};
const defaultProps = {
    ajax: {},
    // displayField?: string | Function,
    // valueField?: string,
    afterLoad: ()=>{},
    reload: true,
    strictMode: false
};

class ComboStore extends Component  {

    constructor(props) {
        super(props);
        this.state = {
            currPageIndex: 0,
            pageCount: 0,
            children: [],
            loading: false,
        };        
        //用于控制预加载的标记
        this.loadCount = 0;

    }
    componentDidMount() {
        // let { strictMode } = this.props;
        // if(!strictMode || 1){
        //     //true 不启用严格模式，可实现预加载，即预先加载后台数据。
        //     this.loadData();
        // }
    }
    // shouldComponentUpdate(nextProps, nextState ){
    //     let { reload, strictMode } = this.props;

    //     //当不使用严格模式，且老数据是第一页数据则提前阻断后续代码
    //     //使用严格模式则每次下拉打开都必须加载数据
    //     if(!strictMode && this.loadCount == 1 ){
    //         //使用了严格模式第一次第一页的请求不会被重复加载
    //         return !is(this.state, nextState);
    //     }
    //     if(nextProps.reload && nextProps.reload !== reload || nextProps.sliderSearchVal !== this.props.sliderSearchVal ){
    //         //当展开下面板时重新加载数据
    //         this.rerender();
    //     }
    //     return !is(this.state, nextState);
    // }
    
    // rerender(){
    //     this.setState({
    //         currPageIndex: 0,
    //         pageCount: 0,
    //         children: [<div className="ref-combobox-data-empty">暂无匹配数据</div>],
    //         loading: true
    //     },() =>{
    //         this.loadData();
    //     });
    // }
    // fixDataToMap = (data) => {
    //     if(!data || !data.length) return {};
    //     let { valueField = 'refpk' } = this.props;
    //     let dataMap = {};
    //     data.forEach(item => {
    //         dataMap[item[valueField]] = item
    //     })
    //     return dataMap;
    // }
    
    render() {
        
        let { currPageIndex, pageCount, children, loading,totalElements } = this.state;
        let {lang='zh_CN',topPagination=false} = this.props;
       
        return (
        <div>
            <Loading container={this} loadingType="line" show={loading} />
            
            {!topPagination && children.map((item) => {
                return item;
            })}
            <Pagination
                show={pageCount <= 0 ? false : true}
                currPageIndex={++currPageIndex}
                pageCount={pageCount}
                totalElements={totalElements}
                lang={lang}
                onSelect={this.props.onSelect}
            />

            {topPagination && children.map((item) => {
                return item;
            })}
        </div>)
    }
}
ComboStore.propTypes = propTypes;
ComboStore.defaultProps = defaultProps;
export default ComboStore;