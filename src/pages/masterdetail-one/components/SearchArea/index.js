import React, {Component} from 'react'
import {actions} from "mirrorx";
import {Col, Row, FormControl, Label} from "tinper-bee";
import Form from 'bee-form';
import Select from 'bee-select';
import SearchPanel from 'components/SearchPanel';

import './index.less'
import {FormattedMessage} from "react-intl";

const {FormItem} = Form;
const {Option} = Select;

class SearchArea extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    /** 查询数据
     * @param {*} error 校验是否成功
     * @param {Object} values 表单数据
     */
    search = () => {
        this.props.form.validateFields(async (err, values) => {
            // 获取默认请求的 分页信息
            if(!err){
                const {pageSize} = this.props.orderObj;
                values.pageIndex = 0;
                values.pageSize = pageSize;
                actions.masterDetailOne.updateState({searchParam:values}); // 保存查询条件
                await actions.masterDetailOne.loadList(values);
            }
        });
    }

    render() {
        const {form,intl} = this.props;
        const {getFieldProps} = form;
        return (
            <SearchPanel
                intl = {intl}
                className='Passenger-form'
                form={form}
                reset={this.reset}
                search={this.search}>
                <Row>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.one.search.0001" defaultMessage="编号"/>
                            </Label>
                            <FormControl placeholder={this.props.intl.formatMessage({id:"js.one.search.prompt.0002", defaultMessage:'模糊查询'})}
                                         {...getFieldProps('search_orderCode', {initialValue: '',})}/>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.one.search.0002" defaultMessage="名称"/>
                            </Label>
                            <FormControl
                                placeholder={this.props.intl.formatMessage({id:"js.one.search.prompt.0002", defaultMessage:'模糊查询'})}
                                {...getFieldProps('search_orderName', {initialValue: '',})}/>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.one.search.0003" defaultMessage="类型"/>
                                </Label>
                            <Select {...getFieldProps('search_orderType', {initialValue: ''})}>
                                <Option value="">
                                    <FormattedMessage id="js.one.option.0001" defaultMessage="请选择"/>
                                </Option>
                                <Option value="1">
                                    <FormattedMessage id="js.one.option.0002" defaultMessage="普通采购"/>
                                    </Option>
                                <Option value="2">
                                    <FormattedMessage id="js.one.option.0003" defaultMessage="委托代销"/>
                                    </Option>
                                <Option value="3">
                                    <FormattedMessage id="js.one.option.0004" defaultMessage="直运采购"/>
                                    </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={4} xs={6}>
                        <FormItem>
                            <Label>
                                <FormattedMessage id="js.one.search.0004" defaultMessage="流程状态"/>
                                </Label>
                            <Select {...getFieldProps('search_bpmState', {initialValue: ''})}>
                                <Option value="">
                                    <FormattedMessage id="js.one.option.0005" defaultMessage="全部"/>
                                    </Option>
                                <Option value={0}>
                                    <FormattedMessage id="js.one.option.0006" defaultMessage="待确认"/>
                                    </Option>
                                <Option value={1}>
                                    <FormattedMessage id="js.one.option.0007" defaultMessage="执行中"/>
                                    </Option>
                                <Option value={2}>
                                    <FormattedMessage id="js.one.option.0008" defaultMessage="已办结"/>
                                    </Option>
                                <Option value={3}>
                                    <FormattedMessage id="js.one.option.0009" defaultMessage="终止"/>
                                    </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </SearchPanel>
        )
    }
}

export default Form.createForm()(SearchArea)
