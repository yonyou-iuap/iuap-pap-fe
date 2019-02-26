import React, {Component} from 'react'
import {actions} from "mirrorx";
//导入组件
import {Col, Row, FormControl, Label} from "tinper-bee";
import Form from 'bee-form';
import Select from 'bee-select';
import { FormattedMessage} from 'react-intl';
import DatePicker from "bee-datepicker";
import SearchPanel from 'components/SearchPanel';
import SelectMonth from 'components/SelectMonth';
import zhCN from "rc-calendar/lib/locale/zh_CN";

//导入样式
import 'bee-datepicker/build/DatePicker.css';
import './index.less'

const {FormItem} = Form;
const {Option} = Select;
const format = "YYYY";
const {YearPicker} = DatePicker;


class SearchAreaForm extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error, values) => {
        if (values.year) {
            values.year = values.year.format('YYYY');
        }
        this.getQuery(values, 0);
    }

    // 重置 如果无法清空，请手动清空
    reset = () => {
        this.props.form.validateFields((err, values) => {
            this.getQuery(values, 1)
        });
    }

    // 获取数据  type值为0查询，1为清空
    getQuery = (values, type) => {
       const  queryParam = this.props.queryParam;
        let {pageParams, whereParams} =queryParam;
        pageParams.pageIndex = 0;
        // let {whereParamsList} = whereParams;
        for (let key in values) {
            for (const [index, elem] of whereParams.entries()) {
                if (key === elem.key) {
                    whereParams.splice(index, 1);
                    break;
                }
            }
            if (values[key] && type === 0) {
                whereParams.push({key, value: values[key], condition: "EQ"}); //前后端约定
            }
        }

        // whereParams.whereParamsList = whereParamsList;

        if (type === 0) { // 查询
            actions.templateModel.loadList(queryParam);
        }
    }

    render() {
        const {form,intl} = this.props;
        const {getFieldProps} = form;

        return (
            <SearchPanel
                className='template'
                form={form}
                intl={intl}
                reset={this.reset}
                search={this.search}>
                <Row>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label><FormattedMessage id="js.temp.search.0001" defaultMessage="员工编号" /></Label>
                            <FormControl 
                                placeholder={this.props.intl.formatMessage({id:"js.temp.search.0002", defaultMessage:'模糊查询'})}
                             {...getFieldProps('code', {initialValue: ''})}/>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label><FormattedMessage id="js.temp.search.0003" defaultMessage="员工姓名" /></Label>
                            <FormControl 
                                placeholder={this.props.intl.formatMessage({id:"js.temp.search.0004", defaultMessage:'模糊查询'})}
                            {...getFieldProps('name', {initialValue: ''})}/>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        {/*DatePicker`,`RangePicker`,`YearPicker`,`InputNumber` 组件，需要在 `FormItem` 上增加 `time` 类*/}
                        <FormItem >
                            <Label><FormattedMessage id="js.temp.search.0005" defaultMessage="年份" /></Label>
                            <YearPicker
                                {...getFieldProps('year', {initialValue: ''})}
                                format={format}
                                locale={zhCN}
                                placeholder={this.props.intl.formatMessage({id:"js.temp.search.0006", defaultMessage:'选择年'})}
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label><FormattedMessage id="js.temp.search.0007" defaultMessage="月份" /></Label>
                            <SelectMonth {...getFieldProps('month', {initialValue: ''})} />
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label><FormattedMessage id="js.temp.search.0008" defaultMessage="是否超标" /></Label>
                            <Select {...getFieldProps('exdeeds', {initialValue: ''})}>
                                <Option disabled value=""><FormattedMessage id="js.temp.search.0009" defaultMessage="请选择" /></Option>
                                <Option value="0"><FormattedMessage id="js.temp.search.0010" defaultMessage="未超标" /></Option>
                                <Option value="1"><FormattedMessage id="js.temp.search.0011" defaultMessage="超标" /></Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(SearchAreaForm)
