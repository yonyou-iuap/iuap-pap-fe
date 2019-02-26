/**
 * 分组聚合
 */

import React, { Component } from 'react';
import { actions } from 'mirrorx';
import moment from 'moment';
import { Row, Col, Label, FormControl } from 'tinper-bee';
import { getHeight } from "utils";
import Select from 'bee-select';
import Pagination from 'bee-pagination';
import Form from 'bee-form';
import { FormattedMessage } from 'react-intl';
import Table from 'bee-table';
import DatePicker from 'bee-datepicker';
import zhCN from "rc-calendar/lib/locale/zh_CN";
import Header from "components/Header";
import SearchPanel from 'components/SearchPanel';
import SelectMonth from 'components/SelectMonth';

import 'bee-datepicker/build/DatePicker.css';
import 'bee-pagination/build/Pagination.css';
import './index.less';

const { YearPicker } = DatePicker;
const FormItem = Form.FormItem;
const { Option } = Select;


class SingleTableGrouping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHeight: 0
        }
        this.masterNornalColumn = [
            {
                title: <FormattedMessage id="js.group.table1.0001" defaultMessage="员工编号" />,
                dataIndex: "code",
                key: "code",
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0002" defaultMessage="员工姓名" />,
                dataIndex: "name",
                key: "name",
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0003" defaultMessage="员工性别" />,
                dataIndex: "sexEnumValue",
                key: "sexEnumValue",
                width: 120
            },
            {
                title: <FormattedMessage id="js.group.table1.0004" defaultMessage="所属部门" />,
                dataIndex: "deptName",
                key: "deptName",
                width: 120
            },
            {
                title: <FormattedMessage id="js.group.table1.0005" defaultMessage="职级" />,
                dataIndex: "levelName",
                key: "levelName",
                width: 140

            },
            {
                title: <FormattedMessage id="js.group.table1.0006" defaultMessage="工龄" />,
                dataIndex: "serviceYears",
                key: "serviceYears",
                className: 'column-number-right ', // 靠右对齐
                width: 130
            },
            {
                title: <FormattedMessage id="js.group.table1.0007" defaultMessage="司龄" />,
                dataIndex: "serviceYearsCompany",
                key: "serviceYearsCompany",
                className: 'column-number-right ', // 靠右对齐
                width: 130
            },
            {
                title: <FormattedMessage id="js.group.table1.0008" defaultMessage="年份" />,
                dataIndex: "year",
                key: "year",
                className: 'column-number-right ', // 靠右对齐
                width: 100,
                render(text, record, index) {
                    return <div>{moment(text).format('YYYY')}</div>
                }
            },
            {
                title: <FormattedMessage id="js.group.table1.0009" defaultMessage="月份" />,
                dataIndex: "monthEnumValue",
                key: "monthEnumValue",
                width: 100
            },
            {
                title: <FormattedMessage id="js.group.table1.0010" defaultMessage="补贴类别" />,
                dataIndex: "allowanceTypeEnumValue",
                key: "allowanceTypeEnumValue",
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0011" defaultMessage="补贴标准" />,
                dataIndex: "allowanceStandard",
                key: "allowanceStandard",
                className: 'column-number-right ', // 靠右对齐
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0012" defaultMessage="实际补贴" />,
                dataIndex: "allowanceActual",
                key: "allowanceActual",
                className: 'column-number-right ', // 靠右对齐
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0013" defaultMessage="是否超标" />,
                dataIndex: "exdeedsEnumValue",
                key: "exdeedsEnumValue",
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0014" defaultMessage="申请时间" />,
                dataIndex: "applyTime",
                key: "applyTime",
                width: 150,
            },
            {
                title: <FormattedMessage id="js.group.table1.0015" defaultMessage="领取方式" />,
                dataIndex: "pickTypeEnumValue",
                key: "pickTypeEnumValue",
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0016" defaultMessage="领取时间" />,
                dataIndex: "pickTime",
                key: "pickTime",
                width: 150,
            },
            {
                title: <FormattedMessage id="js.group.table1.0017" defaultMessage="备注" />,
                dataIndex: "remark",
                key: "remark",
                width: 100,
            }
        ]
        //分组主表的表头
        this.masterColumn = [
            {
                title: <FormattedMessage id="js.group.table1.0001" defaultMessage="员工编号" />,
                dataIndex: "code",
                key: "code",
                width: 120,
                render: (value, record, index) => {
                    let { queryParam: { groupParams } } = this.props;
                    let str = ""
                    if (Array.isArray(groupParams) && groupParams.length) {
                        for (let item of groupParams) {
                            let temp;
                            if (item == 'allowanceType') {
                                temp = record[`${item}EnumValue`];
                            }
                            if (item == 'dept') {
                                temp = record[`${item}Name`];
                            }

                            str += `【${temp}】 `;
                        }
                    }
                    let obj = {
                        children: `${str} \t 总记录条数：${record.idCount}人 \t 金额：${record.allowanceActualSum}`,
                        props: {
                            colSpan: 17
                        }
                    };
                    return obj;
                }
            },
            {
                title: <FormattedMessage id="js.group.table1.0002" defaultMessage="员工姓名" />,
                dataIndex: "name",
                key: "name",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0003" defaultMessage="员工性别" />,
                dataIndex: "sexEnumValue",
                key: "sexEnumValue",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0004" defaultMessage="所属部门" />,
                dataIndex: "deptName",
                key: "deptName",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0005" defaultMessage="职级" />,
                dataIndex: "levelName",
                key: "levelName",
                width: 140,
                render: () => <div></div>

            },
            {
                title: <FormattedMessage id="js.group.table1.0006" defaultMessage="工龄" />,
                dataIndex: "serviceYears",
                key: "serviceYears",
                width: 130,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0007" defaultMessage="司龄" />,
                dataIndex: "serviceYearsCompany",
                key: "serviceYearsCompany",
                width: 130,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0008" defaultMessage="年份" />,
                dataIndex: "year",
                key: "year",
                width: 100,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0009" defaultMessage="月份" />,
                dataIndex: "monthEnumValue",
                key: "monthEnumValue",
                width: 100,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0010" defaultMessage="补贴类别" />,
                dataIndex: "allowanceTypeEnumValue",
                key: "allowanceTypeEnumValue",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0011" defaultMessage="补贴标准" />,
                dataIndex: "allowanceStandard",
                key: "allowanceStandard",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0012" defaultMessage="实际补贴" />,
                dataIndex: "allowanceActual",
                key: "allowanceActual",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0013" defaultMessage="是否超标" />,
                dataIndex: "exdeedsEnumValue",
                key: "exdeedsEnumValue",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0014" defaultMessage="申请时间" />,
                dataIndex: "applyTime",
                key: "applyTime",
                width: 150,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0015" defaultMessage="领取方式" />,
                dataIndex: "pickTypeEnumValue",
                key: "pickTypeEnumValue",
                width: 120,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0016" defaultMessage="领取时间" />,
                dataIndex: "pickTime",
                key: "pickTime",
                width: 150,
                render: () => <div></div>
            },
            {
                title: <FormattedMessage id="js.group.table1.0017" defaultMessage="备注" />,
                dataIndex: "remark",
                key: "remark",
                width: 100,
                render: () => <div></div>
            }
        ];
        //子表的表头
        this.subColumn = [
            {
                title: <FormattedMessage id="js.group.table2.0001" defaultMessage="员工编号" />,
                dataIndex: "code",
                key: "code",
                width: 120
            },
            {
                title: <FormattedMessage id="js.group.table2.0002" defaultMessage="员工姓名" />,
                dataIndex: "name",
                key: "name",
                width: 120
            },
            {
                title: <FormattedMessage id="js.group.table2.0003" defaultMessage="员工性别" />,
                dataIndex: "sexEnumValue",
                key: "sexEnumValue",
                width: 120
            },
            {
                title: <FormattedMessage id="js.group.table2.0004" defaultMessage="所属部门" />,
                dataIndex: "deptName",
                key: "deptName",
                width: 120
            },
            {
                title: <FormattedMessage id="js.group.table2.0005" defaultMessage="职级" />,
                dataIndex: "levelEnumValue",
                key: "levelEnumValue",
                width: 140
            },
            {
                title: <FormattedMessage id="js.group.table2.0006" defaultMessage="工龄" />,
                dataIndex: "serviceYears",
                key: "serviceYears",
                width: 130
            }
        ];
    }

    componentDidMount() {
        //计算表格滚动条高度
        this.resetTableHeight(true);
        //加载主表数据
        actions.grouping.loadMasterTableList(this.props.masterQueryParam);
    }
    /**
     * 重置表格高度计算回调
     *
     * @param {bool} isopen 是否展开
     */
    resetTableHeight = (isopen) => {
        let tableHeight = 0;
        if (isopen) {
            //展开的时候并且适配对应页面数值px
            tableHeight = getHeight() - 420
        } else {
            //收起的时候并且适配对应页面数值px
            tableHeight = getHeight() - 220
        }
        this.setState({ tableHeight });
    }
    /**
     * 子表格下拉分页
     */
    onSelectSubPaging = (record, page) => {
        actions.grouping.loadSubTableList({ record, page: page - 1 });
    }

    /**
     * 子表格页面跳转分页
     */
    onSelectSubPagingSize = (record, index, size) => {
        actions.grouping.loadSubTableList({ record, size });
    }

    /**
     * 展开数据回调
     */
    expandedRowRender = (record, index, indent) => {
        let { subTableAllData, subTableAllPaging, subTableAllLoading } = this.props;
        let { pageParams: { pageIndex, total, totalPages } } = subTableAllPaging[record.key];
        return (<div>
            <Table
                className="grouping-sub-table"
                emptyText={() => <div>暂无数据</div>}
                showHeader={false}
                loading={{ show: subTableAllLoading[record.key], loadingType: "line" }}
                columns={this.masterNornalColumn}
                rowKey={(record, index) => record.key}//渲染需要的Key
                data={subTableAllData[record.key]}
            />
            <Pagination
                first
                last
                prev
                next
                maxButtons={5}
                boundaryLinks
                activePage={pageIndex}
                showJump={true}
                total={total}
                items={totalPages}
                dataNum={1}
                dataNumSelect={['5', '10', '15', '20', '25', '50', 'ALL']}
                onSelect={this.onSelectSubPaging.bind(this, record)}//点击页数回调
                onDataNumSelect={this.onSelectSubPagingSize.bind(this, record)}//点击跳转页数回调
            />
        </div>);
    }
    /**
     * 点击+的时候请求数据
     */
    getData = (expanded, record) => {
        if (expanded) {
            actions.grouping.clearSubTable(record);
            actions.grouping.loadSubTableList({ queryParam: this.props.queryParam, record });
        }
    }
    /**
     * 搜索
     */
    onSearch = (error, values) => {
        let _this = this;
        if (values.year) {
            values.year = values.year.format('YYYY');
        }
        // 取出现有的参数
        let { masterQueryParam } = _this.props,
            groupArray = [],
            resultArray = [];
        // 筛选出所有查询字段
        for (let key in values) {
            // 找出分组字段单独存放
            // 否则当作正常字段存放
            if (key == "group") {
                groupArray = typeof values.group !== 'undefined' && values.group || [];
            } else if (values[key]) {
                resultArray.push({
                    key,
                    value: values[key],
                    condition: "LIKE"
                })
            }
        }
        // 每次查询的时候避免分页显示不准，故设置第一页
        masterQueryParam.pageParams.pageIndex = 0;
        // 参数需要合并-查询字段+分组
        let resultObj = Object.assign({}, masterQueryParam, {
            whereParams: resultArray,
            groupParams: groupArray
        });
        // 如果查询分组，那么需要单独请求分组接口
        // 没有使用分组，需要删除该字段不然报错后端
        if (groupArray.length) {
            actions.grouping.loadGroupTableList(resultObj);
        } else {
            delete resultObj.groupParams;
            actions.grouping.loadMasterTableList(resultObj);
        }
        actions.grouping.updateState({
            masterQueryParam: resultObj
        });
    }
    /**
     * 点击分页按钮回调
     */
    onSelectPaginationIndex = (page) => {
        this.onSelectPagination(page, 0);
    }
    /**
     * 点击跳转页数回调
     */
    onSelectPaginationSize = (index, size) => {
        this.onSelectPagination(size, 1);
    }
    /**
     * 底层兼容分页方法
     */
    onSelectPagination = (value, type) => {
        let _this = this;
        let { masterQueryParam, masterQueryParam: { pageParams } } = _this.props,
            searchObj = {};
        // 如0表示分页-1，1表示正常
        if (type == 0) {
            searchObj = Object.assign({}, pageParams, {
                pageIndex: 1
            });
            searchObj = Object.assign({}, pageParams, {
                pageIndex: value - 1
            });

        } else {
            // 支持下拉选择全部ALL
            if (value == 'ALL') {
                searchObj = Object.assign({}, pageParams, {
                    pageSize: 1
                });
            } else {
                searchObj = Object.assign({}, pageParams, {
                    pageSize: value
                });
            }

        }
        // 插入get条件
        masterQueryParam['pageParams'] = searchObj;
        // 判断是普通表格还是分组的表格
        if (Array.isArray(masterQueryParam.groupParams)) {
            // 使用了分组查询
            actions.grouping.loadGroupTableList(masterQueryParam);
        } else {
            // 没有使用分组
            actions.grouping.loadMasterTableList(masterQueryParam);
        }

    }
    render() {
        let { intl, masterTableList, masterTableLoading, form, pageIndex, pageSize, totalPages, total, queryParam: { groupParams } } = this.props;
        let { tableHeight } = this.state;
        const { getFieldProps } = this.props.form;
        let tableAttr = {}
        tableAttr['columns'] = this.masterNornalColumn;
        tableAttr['data'] = masterTableList;
        if (groupParams && groupParams.length) {
            tableAttr['columns'] = this.masterColumn;
            tableAttr['expandedRowRender'] = this.expandedRowRender;
            tableAttr['onExpand'] = this.getData;
        }
        return (
            <div className='grouping u-grid'>
                <Header title={this.props.intl.formatMessage({ id: "ht.group.title.0001", defaultMessage: "C1单表分组聚合示例" })} />
                <SearchPanel
                    className='grouping-form'
                    searchOpen={true}
                    form={form}
                    reset={() => this.props.form.resetFields()}
                    intl={intl}
                    onCallback={this.resetTableHeight}
                    search={this.onSearch}>
                    <Row className='form-panel'>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>{<FormattedMessage id="js.group.search.sel.0001" defaultMessage="分组条件" />}</Label>
                                <Select placeholder={<FormattedMessage id="js.group.search.sel.0005" defaultMessage="选择分组" />} multiple {...getFieldProps('group')}>
                                    <Option disabled value="">{<FormattedMessage id="js.group.search.sel.0002" defaultMessage="请选择" />}</Option>
                                    <Option value="dept">{<FormattedMessage id="js.group.search.sel.0003" defaultMessage="部门" />}</Option>
                                    <Option value="allowanceType">{<FormattedMessage id="js.group.search.sel.0004" defaultMessage="补贴类别" />}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className='form-panel'>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>{<FormattedMessage id="js.group.search.0001" defaultMessage="员工编号" />}</Label>
                                <FormControl
                                    placeholder={this.props.intl.formatMessage({ id: "js.group.search.0002", defaultMessage: '模糊查询' })}
                                    {...getFieldProps('code', { initialValue: '' })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>{<FormattedMessage id="js.group.search.0003" defaultMessage="员工姓名" />}</Label>
                                <FormControl
                                    placeholder={this.props.intl.formatMessage({ id: "js.group.search.0004", defaultMessage: '模糊查询' })}
                                    {...getFieldProps('name', { initialValue: "" })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>{<FormattedMessage id="js.group.search.sel1.0001" defaultMessage="是否超标" />}</Label>
                                <Select {...getFieldProps('exdeeds', { initialValue: "" })}>
                                    <Option disabled value="">{<FormattedMessage id="js.group.search.sel1.0002" defaultMessage="请选择" />}</Option>
                                    <Option value="0">{<FormattedMessage id="js.group.search.sel1.0003" defaultMessage="未超标" />}</Option>
                                    <Option value="1">{<FormattedMessage id="js.group.search.sel1.0004" defaultMessage="超标" />}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className='form-panel'>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>{<FormattedMessage id="js.group.search.0005" defaultMessage="月份" />}</Label>
                                <SelectMonth  {...getFieldProps('month', { initialValue: "" })}></SelectMonth>
                            </FormItem>
                        </Col>
                        <Col md={4} xs={6}>
                            <FormItem className='time'>
                                <Label>{<FormattedMessage id="js.group.search.0006" defaultMessage="年份" />}</Label>
                                <YearPicker
                                    format={'YYYY'}
                                    locale={zhCN}
                                    placeholder={this.props.intl.formatMessage({ id: "js.group.search.0007", defaultMessage: '选择年份' })}
                                    {...getFieldProps('year', { initialValue: '' })}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </SearchPanel>
                <div className='table-header'>

                </div>
                <Pagination
                    first
                    last
                    prev
                    next
                    maxButtons={5}
                    boundaryLinks
                    activePage={pageIndex}
                    showJump={true}
                    total={total}
                    items={totalPages}//总记录
                    dataNumSelect={['5', '10', '15', '20', '25', '50', 'ALL']}
                    dataNum={2}//默认显示下拉位置
                    onSelect={this.onSelectPaginationIndex}//点击分页按钮回调
                    onDataNumSelect={this.onSelectPaginationSize}//点击跳转页数回调
                />
                <Table
                    bordered//边框
                    headerScroll={true}
                    loading={{ show: masterTableLoading, loadingType: "line" }}
                    //scroll={{ y: tableHeight }}
                    //rowKey={(record, index) => record.key}//渲染需要的Key
                    {...tableAttr}
                />
            </div >
        )
    }
}

export default Form.createForm()(SingleTableGrouping);
