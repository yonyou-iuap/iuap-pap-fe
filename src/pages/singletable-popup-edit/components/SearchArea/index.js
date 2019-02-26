import React, {Component} from 'react'
import {actions} from "mirrorx";
import {Col, Row, FormControl, Label} from "tinper-bee";
import Form from 'bee-form';
import Select from 'bee-select';
import DatePicker from "bee-datepicker";
import SearchPanel from 'components/SearchPanel';
import SelectMonth from 'components/SelectMonth';
import { RefIuapDept } from 'components/RefViews';

import {deepClone} from "utils";
import zhCN from "rc-calendar/lib/locale/zh_CN";

import 'bee-datepicker/build/DatePicker.css';
import './index.less'
import {FormattedMessage} from "react-intl";

const {FormItem} = Form;
const {Option} = Select;
const format = "YYYY";
const {YearPicker} = DatePicker;

class SearchAreaForm extends Component {

    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {*} values 表单数据
     */
    search = (error, values) => {

        if (values.year) {
            values.year = values.year.format('YYYY');
        }
        const {dept} = values;
        if (dept) {
            const {refpk} = JSON.parse(dept);
            values.dept = refpk;
        }

        this.getQuery(values, 0);
    }

    /**
     * 重置 如果无法清空，请手动清空
     */
    reset = () => {
        this.props.form.validateFields((err, values) => {
            this.getQuery(values, 1)
        });
    }


    /** 查询数据
     * @param {Object} values 表单对象
     * @param {Number} type 1位清空操作，0位查询操作
     */
    getQuery = (values, type) => {
        const queryParam = deepClone(this.props.queryParam);
        let {pageParams, whereParams} = queryParam;
        whereParams = deepClone(whereParams);
        pageParams.pageIndex = 0;
        for (let key in values) {
            for (const [index, elem] of whereParams.entries()) {
                if (key === elem.key) {
                    whereParams.splice(index, 1);
                    break;
                }
            }

            if ((values[key] || values[key] === 0) && type === 0) {
                let condition = "LIKE";
                // 这里通过根据项目自己优化
                const equalArray = ["code", "month"];
                if (equalArray.includes(key)) { // 等于
                    condition = "EQ";
                }
                whereParams.push({key, value: values[key], condition}); //前后端约定
            }
        }
        queryParam.whereParams = whereParams;
        actions.popupEdit.updateState(queryParam);
        if (type === 0) {
            actions.popupEdit.loadList(queryParam);
        }
        this.props.onCloseEdit();

    }



    render() {
        const {form,onCallback,intl} = this.props;
        const {getFieldProps} = form;

        return (
            <SearchPanel
                intl = {intl}
                className='search-area-form'
                form={form}
                reset={this.reset}
                onCallback={onCallback}
                search={this.search}>
                <Row>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.popup.table.0001" defaultMessage="员工编号"/>
                                </Label>
                            <FormControl  placeholder={this.props.intl.formatMessage({id:"js.popup.search.prompt.0001", defaultMessage:'精确查询'})}
                                         {...getFieldProps('code', {initialValue: ''})}/>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.popup.table.0002" defaultMessage="员工姓名"/>
                            </Label>
                            <FormControl  placeholder={this.props.intl.formatMessage({id:"js.popup.search.prompt.0002", defaultMessage:'模糊查询'})}
                                         {...getFieldProps('name', {initialValue: ''})}/>
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.popup.table.0004" defaultMessage="部门"/>
                            </Label>
                            <RefIuapDept
                                {...getFieldProps('dept', {initialValue: ''})}
                            />
                        </FormItem>
                    </Col>

                    <Col md={4} xs={6}>
                        <FormItem className="time">
                            <Label>
                                <FormattedMessage id="js.popup.table.0008" defaultMessage="年份"/></Label>
                            <YearPicker
                                {...getFieldProps('year', {initialValue: ''})}
                                format={format}
                                locale={zhCN}
                                placeholder={this.props.intl.formatMessage({id:"js.popup.search.prompt.0003", defaultMessage:'选择年'})}
                            />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.popup.table.0009" defaultMessage="月份"/></Label>
                            <SelectMonth  {...getFieldProps('month', {initialValue: ''})} />
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.popup.table.0013" defaultMessage="是否超标"/>
                            </Label>
                            <Select {...getFieldProps('exdeeds', {initialValue: ''})}>
                                <Option value="">
                                    <FormattedMessage id="js.popup.option.0001" defaultMessage="请选择"/>
                                </Option>
                                <Option value="0">
                                    <FormattedMessage id="js.popup.option.0002" defaultMessage="未超标"/>
                                </Option>
                                <Option value="1">
                                    <FormattedMessage id="js.popup.option.0003" defaultMessage="超标"/>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>

                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(SearchAreaForm)
