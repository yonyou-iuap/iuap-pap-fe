import React, {Component} from 'react';
import {actions} from 'mirrorx';
import {Tooltip, Dropdown, Menu, Icon, Loading} from 'tinper-bee';
import queryString from "query-string";
import moment from 'moment'
import Grid from 'components/Grid';
import Header from 'components/Header';
import Button from 'components/Button';
import PopDialog from 'components/Pop';
import SearchArea from '../SearchArea'

import { FormattedMessage } from 'react-intl';
import {deepClone, getHeight, getSortMap} from "utils";

import 'bee-complex-grid/build/Grid.css';
import 'bee-pagination/build/Pagination.css'
import 'bee-table/build/Table.css';
import 'bee-input-number/build/InputNumber.css';
import './index.less';

import {getCookie} from "utils";

const {Item} = Menu;
const format = "YYYY-MM-DD HH:mm:ss";
const beginFormat = "YYYY-MM-DD 00:00:00";
const endFormat = "YYYY-MM-DD 23:59:59";

let locale_serial = "";

class Query extends Component {
    constructor(props) {
        super(props);
        locale_serial = getCookie("locale_serial");
        if(locale_serial == 1) {
            locale_serial = "";
        }
        this.state = {
            tableHeight: 0,
            filterable: false,
            showModal: false,
            record: {}, // 存储关联数据信息
            exportData: []
        }
    }

    componentWillMount() {
        //计算表格滚动条高度
        this.resetTableHeight(true);
    }
    componentDidMount() {
        actions.query.loadList(this.props.queryParam); // 查询默认条件
    }

    /**
     *
     * 关联数据钻取
     * @param {object} record 关联数据行数据
     * @param {string} key menu菜单key值
     */
    onRelevance = (record, key) => {
        const {name} = record;
        if (key === "name") { // 跳转百度
            window.open('https://baike.baidu.com/item/' + name, "_blank");
        }
        if (key === "code") {  // 弹出模态框
            this.setState({record, showModal: true});
        }
        if (key === "year") {  // 跳转新页面
            const {code, name, sexEnumValue, levelName} = record;
            actions.routing.push({
                pathname: '/employee',
                search: queryString.stringify({code, name, sexEnumValue, levelName})
            })
        }
    }

    /**
     *
     *排序属性设置
     * @param {Array} sortParam 排序参数对象数组
     */
    sortFun = (sortParam) => {
        let {queryParam} = this.props;
        queryParam.sortMap = getSortMap(sortParam);
        actions.query.loadList(queryParam);
    }

    /**
     *
     *触发过滤输入操作以及下拉条件的回调
     * @param {string} key 过滤字段名称
     * @param {*} value 过滤字段值
     * @param {string} condition 过滤字段条件
     */
    onFilterChange = (key, value, condition) => {
        let isAdd = true; //是否添加标识
        let queryParam = deepClone(this.props.queryParam);
        let {whereParams, pageParams} = queryParam;
        pageParams.pageIndex = 0; // 默认跳转第一页
        for (const [index, element] of whereParams.entries()) {
            if (element.key === key) { // 判断action 中是否有 过滤对象
                whereParams[index] = this.handleFilterData(key, value, condition);
                isAdd = false;
            }
        }
        if (isAdd) {
            const filterData = this.handleFilterData(key, value, condition);
            whereParams.push(filterData);
        }
        actions.query.loadList(queryParam);
    }


    /**
     *
     * 拼接过滤条件对象
     * @param {string} key 过滤字段名称
     * @param {*} value 过滤字段值
     * @param {string} condition 过滤字段条件
     */

    handleFilterData = (key, value, condition) => {
        const filterObj = {key, value, condition};
        if (Array.isArray(value)) { // 判断是否日期
            filterObj.value = this.handleDateFormat(value); // moment 格式转换
            filterObj.condition="RANGE";
        }
        return filterObj;
    }


    /**
     * 清除过滤条件的回调函数，回调参数为清空的字段
     * @param {string} key 清除过滤字段
     */
    onFilterClear = (key) => {
        let queryParam = deepClone(this.props.queryParam);
        let {whereParams, pageParams} = queryParam;
        for (const [index, element] of whereParams.entries()) {
            if (element.key === key) {
                whereParams.splice(index, 1);
                pageParams.pageIndex = 0; // 默认跳转第一页
                break;
            }
        }
        actions.query.loadList(queryParam);
    }


    /**
     *
     *行过滤，日期数组拼接
     * @param {Array} value 日期数组
     * @returns
     */
    handleDateFormat = (value) => {
        let dateArray = value.map((item, index) => {
            let str = '';
            if (index === 0) {
                str = item.format(beginFormat);
            } else {
                str = item.format(endFormat);
            }
            return str;
        });
        return dateArray;
    }

    /**
     *
     * @param {Number} pageIndex 跳转指定页数
     */
    freshData = (pageIndex) => {
        this.onPageSelect(pageIndex, 0);
    }

    /**
     *
     * @param {Number} index 跳转指定页数
     * @param {Number} value 设置一页数据条数
     */
    onDataNumSelect = (index, value) => {
        this.onPageSelect(value, 1);
    }

    /**
     *
     * @param {Number} value  pageIndex 或者 pageIndex
     * @param {Number} type 为0标识为 pageIndex,为1标识 pageSize
     */
    onPageSelect = (value, type) => {
        let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从 action 里
        let {pageIndex, pageSize} = queryParam.pageParams;
        if (type === 0) {
            pageIndex = value - 1;
        } else {
            pageSize = value;
            pageIndex = 0;
        }
        if (value && value.toString().toLowerCase() === "all") { // 对分页 pageSize 为 all 进行处理，前后端约定
            pageSize = 1;
        }
        queryParam['pageParams'] = {pageIndex, pageSize};
        actions.query.loadList(queryParam);
    }

    /**
     *
     * @param {Boolean} status 控制栏位的显示/隐藏
     */
    afterRowFilter = (status) => {
        if (!status) { // 清空行过滤数据
            let {queryParam, cacheFilter} = deepClone(this.props);
            queryParam.whereParams = cacheFilter;
            actions.query.updateState({queryParam}); //缓存查询条件
            actions.query.loadList(queryParam); // 查询默认条件
        }
        this.setState({filterable: status});

    }


    clearRowFilter = () => {
        this.setState({filterable: false});
    }

    /**
     * 关闭模态框
     */
    close = () => {
        this.setState({showModal: false});
    }

    /**
     * 导出excel
     */
    export = () => {
        let exportData = this.props.queryObj.list;
        this.setState({
            exportData
        }, function(){
            this.grid.exportExcel();
        })
        console.log("导出当前页", exportData);
        
    }
    /**
     * 重置表格高度计算回调
     *
     * @param {Boolean} isopen 是否展开
     */
    resetTableHeight = (isopen) => {
        let tableHeight = 0;
        if (isopen) {
            //展开的时候并且适配对应页面数值px
            tableHeight = getHeight() - 470
        } else {
            //收起的时候并且适配对应页面数值px
            tableHeight = getHeight() - 270
        }
        this.setState({ tableHeight });
    }

    /**
     * @description 导出全部数据
     * 
     */
    exportAll = async () => {
        let exportData = await actions.query.exportAll({
            pageSize: 1,
            pageIndex: 0
        });
        this.setState({
            exportData: exportData.content
        },function(){
            this.grid.exportExcel();
        })
        console.log("exportData", exportData);
        
    }

    render() {
        const _this = this;
        const {queryObj, showLoading, queryParam, intl} = _this.props;
        const {pageIndex, total, totalPages} = queryObj;
        const {filterable, record, tableHeight, exportData} = _this.state;

        const paginationObj = {   // 分页
            activePage: pageIndex,//当前页
            total,//总条数
            items: totalPages,
            freshData: _this.freshData,
            onDataNumSelect: _this.onDataNumSelect,
        }

        const sortObj = {  //排序属性设置
            mode: 'multiple',
            backSource: true,
            sortFun: _this.sortFun
        }

        const column = [
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0001", defaultMessage:"数据"}),
                exportTitle:"数据",
                width: 80,
                dataIndex: "k",
                key: "k",
                fixed: "left",
                className: 'data-cls ',
                // exportHidden: true, //是否在导出中隐藏此列
                render: (text, record, index) => {

                    //列注释的右键菜单
                    const menu = (
                        <Menu
                            onClick={e => this.onRelevance(record, e.key)}>
                            <Item key='code'><FormattedMessage id="js.table.query.0001" defaultMessage="模态弹出" /></Item>
                            <Item key='year'><FormattedMessage id="js.table.query.0002" defaultMessage="链接跳转" /></Item>
                            <Item key='name'><FormattedMessage id="js.table.query.0003" defaultMessage="打开新页" /></Item>
                        </Menu>
                    );
                    return (
                        <div>
                            <Dropdown
                                trigger={['click']}
                                overlay={menu}
                                animation="slide-up"
                            >
                                <Icon type="uf-link" style={{"color": "#004898"}}/>
                            </Dropdown>
                        </div>
                    )
                }
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0002", defaultMessage:"员工编号"}),
                exportTitle:"员工编号",
                dataIndex: "code",
                key: "code",
                width: 160,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0003", defaultMessage:"员工姓名"}),
                exportTitle:"员工姓名",
                dataIndex: `name${locale_serial}`,
                key: "name",
                width: 120,
                filterType: "text",
                filterDropdownType: "string",
                filterDropdown: "show",
                sorter: (a, b) => a.name - b.name,
                render: (text, record, index) => {
                    return (
                        <Tooltip inverse overlay={text}>
                            <span>{text}</span>
                        </Tooltip>
                    );
                }
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0004", defaultMessage:"员工性别"}),
                dataIndex: "sex",
                key: "sex",
                exportKey: 'sexEnumValue',
                width: 120,
                filterType: "dropdown",
                filterDropdown: "hide", //条件的下拉是否显示（string，number）
                filterDropdownAuto: "manual", //是否自动和手动设置 filterDropdownData 属性
                filterDropdownData: [{key: "男", value: "1"}, {key: "女", value: "0"}],
                render: (text, record, index) => {
                    return (<span>{record.sexEnumValue}</span>)
                }

            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0005", defaultMessage:"部门"}),
                dataIndex: "dept",
                key: "dept",
                exportKey: "deptName",
                width: 150,
                filterType: "dropdown",
                filterDropdown: "hide",
                filterDropdownAuto: "manual",
                filterDropdownData: this.props.colFilterSelectdept,
                filterDropdownFocus: () => { //组件焦点的回调函数
                    let param = {
                        distinctParams: ['dept']
                    }
                    const {colFilterSelectdept}=this.props;
                    if(!(colFilterSelectdept && colFilterSelectdept.length)) {
                        actions.query.getListByCol(param); //获取所有部门
                    }
                },
                render: (text, record, index) => {
                    return (<span>{record.deptName}</span>)
                }
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0006", defaultMessage:"职级"}),
                dataIndex: "levelName",
                key: "levelName",
                width: 120,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0007", defaultMessage:"工龄"}),
                dataIndex: "serviceYears",
                key: "serviceYears",
                width: 180,
                // filterDropdown: "hide", //条件的下拉是否显示（string，number）
                filterType: "number",//输入框类型
                filterDropdownType: "number",//数值类条件
                className: 'column-number-right ', // 靠右对齐
                filterInputNumberOptions: {
                    max: 100,
                    min: 0,
                    step: 1,
                    precision: 0
                },
                sorter: (a, b) => a.serviceYears - b.serviceYears,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0008", defaultMessage:"司龄"}),
                dataIndex: "serviceYearsCompany",
                key: "serviceYearsCompany",
                width: 130,
                className: 'column-number-right ', // 靠右对齐
                sorter: (a, b) => a.serviceYearsCompany - b.serviceYearsCompany,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0009", defaultMessage:"年份"}),
                dataIndex: "year",
                key: "year",
                width: 100,
                className: 'column-number-right ', // 靠右对齐
                render: (text, record, index) => {
                    return <div>{text ? moment(text).format("YYYY") : ""}</div>
                }
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0010", defaultMessage:"月份"}),
                dataIndex: "monthEnumValue",
                key: "monthEnumValue",
                width: 100,
                className: 'column-number-right ', // 靠右对齐
                sorter: (a, b) => a.month - b.month,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0011", defaultMessage:"补贴类别"}),
                dataIndex: "allowanceTypeEnumValue",
                key: "allowanceTypeEnumValue",
                width: 120,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0012", defaultMessage:"补贴标准"}),
                dataIndex: "allowanceStandard",
                key: "allowanceStandard",
                width: 120,
                className: 'column-number-right ', // 靠右对齐
                render: (text, record, index) => {
                    return (<span>{(typeof text)==='number'? text.toFixed(2):""}</span>)
                }

            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0013", defaultMessage:"实际补贴"}),
                dataIndex: "allowanceActual",
                key: "allowanceActual",
                width: 120,
                className: 'column-number-right ', // 靠右对齐
                render: (text, record, index) => {
                    return (<span>{(typeof text)==='number'? text.toFixed(2):""}</span>)
                }

            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0014", defaultMessage:"是否超标"}),
                dataIndex: "exdeedsEnumValue",
                key: "exdeedsEnumValue",
                width: 120,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0015", defaultMessage:"申请时间"}),
                dataIndex: "applyTime",
                key: "applyTime",
                width: 300,
                filterDropdown: "hide", //条件的下拉是否显示（string，number）
                filterType: "daterange",//输入框类型
                filterDropdownType: "daterange",//数值类条件
                render: (text, record, index) => {
                    return <div>{text ? moment(text).format(format) : ""}</div>

                }
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0016", defaultMessage:"领取方式"}),
                dataIndex: "pickTypeEnumValue",
                key: "pickTypeEnumValue",
                width: 120,
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0017", defaultMessage:"领取时间"}),
                dataIndex: "pickTime",
                key: "pickTime",
                width: 150,
                render: (text, record, index) => {
                    return <div>{text ? moment(text).format(format) : ""}</div>
                }
            },
            {
                title: this.props.intl.formatMessage({id:"js.table.query.0018", defaultMessage:"备注"}),
                dataIndex: "remark",
                key: "remark",
                width: 100,
            }
        ];
        return (
            <div className='single-table-query'>
                <Loading showBackDrop={true} loadingType="line" show={showLoading} fullScreen={true}/>
                <Header title={this.props.intl.formatMessage({id:"ht.table.query.0001", defaultMessage:"A1单表查询示例"})}/>
                <SearchArea
                    queryParam={queryParam}
                    clearRowFilter={this.clearRowFilter}
                    onCallback={this.resetTableHeight}
                    intl = {intl}
                />
                <div className='table-header'>
                    <Button iconType="uf-export" className="ml8" onClick={_this.export}>
                        <FormattedMessage id="js.query.btn.0001" defaultMessage="导出" />
                    </Button>
                    <Button iconType="uf-export" className="ml8" onClick={_this.exportAll}>
                        <FormattedMessage id="js.query.btn.0002" defaultMessage="全部导出" />
                    </Button>
                </div>
                <div className="gird-parent">
                    <Grid
                        ref={(el) => this.grid = el} //存模版
                        columns={column}
                        data={queryObj.list}
                        rowKey={(r, i) => i} //生成行的key
                        paginationObj={paginationObj} //分页
                        multiSelect={false}  //false 单选，默认多选
                        showFilterMenu={true} //是否显示行过滤菜单
                        filterable={filterable}//是否开启过滤数据功能
                        onFilterChange={_this.onFilterChange}  // 触发过滤输入操作以及下拉条件的回调
                        onFilterClear={_this.onFilterClear} //清除过滤条件的回调函数，回调参数为清空的字段
                        afterRowFilter={_this.afterRowFilter} //控制栏位的显示/隐藏
                        sort={sortObj} //排序属性设置
                        scroll={{y: tableHeight}}
                        exportData = {exportData}
                        sheetHeader={{height: 30, ifshow: false}} //设置excel导出的表头的样式、支持height、ifshow
                    />
                </div>

                <PopDialog
                    show={this.state.showModal}
                    title={this.props.intl.formatMessage({id:"js.query.menu.0001", defaultMessage:"模态弹出"})}
                    close={this.close}
                    btns={[]}
                >
                    <div>
                        <span><FormattedMessage id="js.query.pop.0001" defaultMessage="员工编号：" /></span>
                        <span>{record.code}</span>
                    </div>
                    <div>
                        <span><FormattedMessage id="js.query.pop.0002" defaultMessage="员工姓名：" /></span>
                        <span>{record.name}</span>
                    </div>
                    <div>
                        <span><FormattedMessage id="js.query.pop.0003" defaultMessage="员工性别：" /></span>
                        <span>{record.sexEnumValue}</span>
                    </div>
                    <div>
                        <span><FormattedMessage id="js.query.pop.0004" defaultMessage="职级：" /></span>
                        <span>{record.levelName}</span>
                    </div>
                </PopDialog>
            </div>
        )
    }
}

export default Query;
