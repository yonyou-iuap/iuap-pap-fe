import React, { Component } from 'react';
import { actions } from 'mirrorx';
import moment from 'moment';
import { Row, Col, Label, FormControl } from 'tinper-bee';
import Select from 'bee-select';
import Pagination from 'bee-pagination';
import Form from 'bee-form';
import { FormattedMessage} from 'react-intl';
import Grid from 'components/Grid';
import Table from 'bee-table';
import DatePicker from 'bee-datepicker';
//日期样式引用
import 'bee-datepicker/build/DatePicker.css';
import zhCN from "rc-calendar/lib/locale/zh_CN";
import Header from "components/Header";
import SearchPanel from 'components/SearchPanel';
import SelectMonth from 'components/SelectMonth';
import Button from 'components/Button';

import 'bee-pagination/build/Pagination.css';
import './index.less';

const { YearPicker } = DatePicker;
const FormItem = Form.FormItem;
const { Option } = Select;


class SingleTableGrouping extends Component {
    constructor(props) {
        super(props);
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
                dataIndex: "levelEnumValue",
                key: "levelEnumValue",
                width: 140

            },
            {
                title: <FormattedMessage id="js.group.table1.0006" defaultMessage="工龄" />,
                dataIndex: "serviceYears",
                key: "serviceYears",
                width: 130
            },
            {
                title: <FormattedMessage id="js.group.table1.0007" defaultMessage="司龄" />,
                dataIndex: "serviceYearsCompany",
                key: "serviceYearsCompany",
                width: 130
            },
            {
                title: <FormattedMessage id="js.group.table1.0008" defaultMessage="年份" />,
                dataIndex: "year",
                key: "year",
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
                width: 120,
            },
            {
                title: <FormattedMessage id="js.group.table1.0012" defaultMessage="实际补贴" />,
                dataIndex: "allowanceActual",
                key: "allowanceActual",
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
                            let temp = record[`${item}EnumValue`];
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
                dataIndex: "levelEnumValue",
                key: "levelEnumValue",
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
        //加载主表数据
        actions.grouping.loadMasterTableList(this.props.queryParam);
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
        console.log('subTableAllPaging', subTableAllPaging);
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
        let { queryParam } = _this.props,
            groupArray = [],
            resultArray = [];

        for (let key in values) {
            if (key == "group") {
                groupArray = typeof values.group !== 'undefined' && values.group || [];
            } else if (values[key]) {
                resultArray.push({
                    key,
                    value: values[key],
                    condition: "EQ"
                })
            }
        }

        let resultObj = Object.assign({}, queryParam, {
            /* "whereParams": {
                "whereParamsList": resultArray
            },
            "groupParams": {
                "groupList": groupArray
            }, */
            "whereParams": resultArray,
            "groupParams": groupArray
        });
        if (groupArray.length) {
            actions.grouping.loadGroupTableList(resultObj);
        } else {
            delete resultObj.groupParams;
            actions.grouping.loadMasterTableList(resultObj);
        }
        //loadGroupTableList
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
        let { queryParam, queryParam: { pageParams } } = _this.props,
            searchObj = {};
        if (type == 0) {
            searchObj = Object.assign({}, pageParams, {
                pageIndex: value - 1
            });
        } else {
            searchObj = Object.assign({}, pageParams, {
                pageSize: value
            });
        }
        queryParam['pageParams'] = searchObj;
        actions.grouping.loadMasterTableList(queryParam);
    }
    render() {
        let { intl, masterTableList, masterTableLoading, form, pageIndex, pageSize, totalPages, total, queryParam: { groupParams } } = this.props;
        const { getFieldProps, getFieldError } = this.props.form;
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
                    search={this.onSearch}>
                    <Row className='form-panel'>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>{<FormattedMessage id="js.group.search.sel.0001" defaultMessage="分组条件" />}</Label>
                                <Select multiple {...getFieldProps('group')}>
                                    <Option disabled value="">{<FormattedMessage id="js.group.search.sel.0002" defaultMessage="请选择" />}</Option>
                                    <Option value="sex">{<FormattedMessage id="js.group.search.sel.0003" defaultMessage="性别" />}</Option>
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
                                    placeholder={this.props.intl.formatMessage({id:"js.group.search.0002", defaultMessage:'模糊查询'})}
                                    {...getFieldProps('code', { initialValue: '' })} 
                                />
                            </FormItem>
                        </Col>
                        <Col md={4} xs={6}>
                            <FormItem>
                                <Label>{<FormattedMessage id="js.group.search.0003" defaultMessage="员工姓名" />}</Label>
                                <FormControl
                                    placeholder={this.props.intl.formatMessage({id:"js.group.search.0004", defaultMessage:'模糊查询'})}
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
                                    placeholder={this.props.intl.formatMessage({id:"js.group.search.0007", defaultMessage:'选择年份'})}
                                    {...getFieldProps('year', { initialValue: '' })}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </SearchPanel>
                <div className='table-header'>
                    <Button iconType="uf-export" colors="primary" className="ml8" size='sm'>导出</Button>
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
                    dataNum={1}//默认显示下拉位置
                    onSelect={this.onSelectPaginationIndex}//点击分页按钮回调
                    onDataNumSelect={this.onSelectPaginationSize}//点击跳转页数回调
                />
                <Table
                    emptyText={() => <div>暂无数据</div>}//表格无数据的时候显示的组件
                    bordered//边框
                    loading={{ show: masterTableLoading, loadingType: "line" }}
                    //rowKey={(record, index) => record.key}//渲染需要的Key
                    {...tableAttr}
                />
            </div >
        )
    }
}

export default Form.createForm()(SingleTableGrouping);
