/**
 * 业务组件工厂函数
 */


//React所需导入
import React, { Component } from 'react';
//多语
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
//文本输入组件
import TextField from 'components/RowField/TextField';
//下拉选择组件
import SelectField from 'components/RowField/SelectField';
//数值选择组件
import NumberField from 'components/RowField/NumberField';
//年份选择组件
import YearField from 'components/RowField/YearField';
//参照部门
import RefDept from 'components/RowField/RefDept';
//参照职级
import RefLevel from 'components/RowField/RefLevel';
//日期组件
import DateField from 'components/RowField/DateField';
class FactoryComp extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * 渲染组件函数
     *
     * @returns JSX
     */
    renderComp = () => {
        let { type, value, record } = this.props;
        switch (type) {
            case 'name'://姓名
                return (<div>
                    {record._edit ?//编辑态
                        <TextField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                        /> : <div>{value}</div>}
                </div>);
            case 'sex'://性别
                const sexData = [{
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.sex.0001", defaultMessage: '请选择' }),
                    value: '',
                    disabled: true
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.sex.0002", defaultMessage: '男' }),
                    value: 1
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.sex.0003", defaultMessage: '女' }),
                    value: 0
                }];
                return (<div>
                    {record._edit ?
                        <SelectField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            data={sexData}
                        /> : <div>{record.sexEnumValue}</div>}
                </div>);
            case 'serviceYears'://工龄
                return (<div>
                    {record._edit ?
                        <NumberField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            iconStyle="one"
                            max={99}
                            min={0}
                            step={1}
                        /> : <div>{value}</div>}
                </div>);
            case 'serviceYearsCompany'://司龄
                return (<div>
                    {record._edit ?
                        <NumberField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            iconStyle="one"
                            max={99}
                            min={0}
                            step={1}
                        /> : <div>{value}</div>}
                </div>);
            case 'month'://月份
                const monthData = [{
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0001", defaultMessage: '请选择' }),
                    value: "",
                    disabled: true
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0002", defaultMessage: '一月' }),
                    value: 1
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0003", defaultMessage: "二月" }),
                    value: 2
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0004", defaultMessage: "三月" }),
                    value: 3
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0005", defaultMessage: "四月" }),
                    value: 4
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0006", defaultMessage: "五月" }),
                    value: 5
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0007", defaultMessage: "六月" }),
                    value: 6
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0008", defaultMessage: "七月" }),
                    value: 7
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0009", defaultMessage: "八月" }),
                    value: 8
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0010", defaultMessage: "九月" }),
                    value: 9
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0011", defaultMessage: "十月" }),
                    value: 10
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0012", defaultMessage: "十一月" }),
                    value: 11
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.month.0013", defaultMessage: "十二月" }),
                    value: 12
                }];
                return (<div>
                    {record._edit ?
                        <SelectField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            data={monthData}//自定义数据传入json
                        /> : <div>{record.monthEnumValue}</div>}
                </div>);
            case 'allowanceType'://补助类别
                const allowanceTypeData = [{
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.allowance.0001", defaultMessage: "请选择" }),
                    value: "",
                    disabled: true
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.allowance.0002", defaultMessage: "电脑补助" }),
                    value: 1
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.allowance.0003", defaultMessage: "住宿补助" }),
                    value: 2
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.allowance.0004", defaultMessage: "交通补助" }),
                    value: 3
                }];
                return (<div>
                    {record._edit ?
                        <SelectField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            data={allowanceTypeData}//自定义数据传入json
                        /> : <div>{record.allowanceTypeEnumValue}</div>}
                </div>);
            case 'allowanceStandard'://补贴标准
                return (<div>
                    {record._edit ?
                        <NumberField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            iconStyle="one"
                            max={999999}
                            min={0}
                            step={1}
                            precision={2}
                        /> : <div>{(typeof value) === 'number' ? value.toFixed(2) : ""}</div>}
                </div>);
            case 'allowanceActual'://实际补贴
                return (<div>
                    {record._edit ?
                        <NumberField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            iconStyle="one"
                            max={999999}
                            min={0}
                            step={1}
                            precision={2}
                        /> : <div>{(typeof value) === 'number' ? value.toFixed(2) : ""}</div>}
                </div>);
            case 'exdeeds'://是否超标
                const exdeedsData = [{
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.exdeeds.0001", defaultMessage: "请选择" }),
                    value: "",
                    disabled: true
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.exdeeds.0002", defaultMessage: "未超标" }),
                    value: 0
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.exdeeds.0003", defaultMessage: "超标" }),
                    value: 1
                }];
                return (<div>
                    {record._edit ?
                        <SelectField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            data={exdeedsData}
                        /> : <div>{record.exdeedsEnumValue}</div>}
                </div>);
            case 'pickType'://领取类别
                const pickTypeData = [{
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.pick.0001", defaultMessage: "请选择" }),
                    value: "",
                    disabled: true
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.pick.0002", defaultMessage: "转账" }),
                    value: 1
                }, {
                    key: this.props.intl.formatMessage({ id: "js.inline.factory.pick.0003", defaultMessage: "现金" }),
                    value: 2
                }];
                return (<div>
                    {record._edit ?
                        <SelectField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                            data={pickTypeData}//数据
                        /> : <div>{record.pickTypeEnumValue}</div>}
                </div>);
            case 'remark'://备注
                return (<div>
                    {record._edit ?
                        <TextField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                        /> : <div>{value}</div>}
                </div>);
            case 'year'://年份
                return (<div>
                    {record._edit ?
                        <YearField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                        /> : <div>{value}</div>}
                </div>);
            case 'date'://年份
                return (<div>
                    {record._edit ?
                        <DateField {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                        /> : <div>{value}</div>}
                </div>);
            case 'dept'://部门
                return (<div>
                    {record._edit ?
                        <RefDept {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                        /> : <div>{record.deptName}</div>}
                </div>);
            case 'level'://职级
                return (<div>
                    {record._edit ?
                        <RefLevel {...this.props}
                            status={record['_status']}//是否修改过标记
                            validate={record['_validate']}//启用验证
                        /> : <div>{record.levelName}</div>}
                </div>);
        }
    }
    render() {
        return (<div>
            {this.renderComp()}
        </div>);
    }
}

export default injectIntl(FactoryComp);