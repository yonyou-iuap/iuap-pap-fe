import React, {Component} from "react";
import {Col, Row, FormControl, Label, InputNumber} from "tinper-bee";
import {actions} from "mirrorx";
import Form from 'bee-form';
import Select from 'bee-select';
import PopDialog from 'components/Pop';
import FormError from 'components/FormError';
import { FormattedMessage } from 'react-intl';

import 'bee-datepicker/build/DatePicker.css';
import './index.less'

const {FormItem} = Form;


class AddEditBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
            btnFlag: 0,
        }
    }

    titleArr = [
        this.props.intl.formatMessage({id:"js.tree.btn.0001", defaultMessage:"新增"}),
        this.props.intl.formatMessage({id:"js.tree.btn.0002", defaultMessage:"修改"}),
        this.props.intl.formatMessage({id:"js.tree.btn.0003", defaultMessage:"详情"}),
    ];


    async componentWillReceiveProps(nextProps) {
        const {btnFlag, currentIndex} = this.props;
        const {btnFlag: nextBtnFlag, currentIndex: nextCurrentIndex, checkTable, modalVisible} = nextProps;
        if (btnFlag !== nextBtnFlag || currentIndex !== nextCurrentIndex) {
            // 防止网络阻塞造成btnFlag显示不正常
            this.setState({btnFlag: nextBtnFlag});
            let rowData = {};
            try {
                if (nextBtnFlag !== 0 && checkTable === "traveling" && modalVisible) {
                    this.props.form.resetFields();
                    const {list} = this.props.travelingObj;
                    rowData = list[nextCurrentIndex] || {};
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.setState({rowData});
            }
        }
    }

    /**
     * button关闭Modal 同时清空state
     * @param {Boolean} isSave 判断是否添加或者更新
     */
    onCloseEdit = (isSave) => {
        this.setState({rowData: {}, btnFlag: 0});
        this.props.form.resetFields();
        this.props.onCloseModal(isSave);
    }


    /**
     * 提交表单信息
     */
    onSubmitEdit = () => {
        const _this = this;
        const {btnFlag}=_this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {passengerIndex, passengerObj} = this.props;
                const {list} = passengerObj;
                const {id: passengerId} = list[passengerIndex]; //获取父亲节点的id
                let {rowData} = _this.state;
                if (rowData && rowData.id) { // 如果是编辑，带上节点 id
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                values.passengerId = passengerId;
                values.btnFlag=btnFlag;
                _this.onCloseEdit(true); // 关闭弹框 无论成功失败
                this.props.resetIndex('travelingIndex'); //重置state， 默认选中第一条
                actions.masterDetailMany.saveTraveling(values); //保存主表数据
            }
        });
    }


    /**
     *
     * @description 底部按钮是否显示处理函数
     * @param {*} btnFlag 为页面标识
     * @returns footer中的底部按钮
     */
    onHandleBtns = (btnFlag) => {

        let _this = this;
        let btns = [
            {
                label: <FormattedMessage id="js.many.btn.0007" defaultMessage="确定"/>,
                fun: _this.onSubmitEdit,
                icon: 'uf-correct'
            },

            {
                label: <FormattedMessage id="js.many.btn.0008" defaultMessage="取消"/>,
                fun: this.onCloseEdit,
                icon: 'uf-back'
            }
        ];

        if (btnFlag == 2) {
            btns = [];
        }

        return btns;
    }


    render() {

        let _this = this;
        const {form, modalVisible} = _this.props;
        const {getFieldProps, getFieldError} = form;
        const {rowData, btnFlag} = _this.state;
        const {line, stationBegin, stationEnd, cost, remark, payStatus = ""} = rowData;
        let btns = _this.onHandleBtns(btnFlag);

        return (
            <PopDialog
                show={modalVisible}
                size='lg'
                close={this.onCloseEdit}
                title={this.titleArr[btnFlag]}
                btns={btns}
                className='book-modal'
            >
                <Form>
                    <Row className='detail-body form-panel'>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0013" defaultMessage="乘车路线" />
                                </Label>
                                <FormControl disabled={btnFlag === 2}
                                             {...getFieldProps('line', {
                                                 validateTrigger: 'onBlur',
                                                 initialValue: line || '',
                                                 rules: [{
                                                     type: 'string',
                                                     required: true,
                                                     pattern: /\S+/ig,
                                                     message: <FormattedMessage id="js.many.message.0001" defaultMessage="请输入乘车路线" />,
                                                 }],
                                             })}
                                />
                                <FormError errorMsg={getFieldError('line')}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0014" defaultMessage="上车站点" />
                                    </Label>
                                <FormControl disabled={btnFlag === 2}
                                             {...getFieldProps('stationBegin', {
                                                 validateTrigger: 'onBlur',
                                                 initialValue: stationBegin || '',
                                                 rules: [{
                                                     type: 'string',
                                                     required: true,
                                                     pattern: /\S+/ig,
                                                     message: <FormattedMessage id="js.many.message.0002" defaultMessage="请输入上车站点" />,
                                                 }],
                                             })}
                                />
                                <FormError errorMsg={getFieldError('stationBegin')}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0015" defaultMessage="下车站点" />
                                </Label>
                                <FormControl disabled={btnFlag === 2}
                                             {...getFieldProps('stationEnd', {
                                                 validateTrigger: 'onBlur',
                                                 initialValue: stationEnd || '',
                                                 rules: [{
                                                     type: 'string',
                                                     required: true,
                                                     pattern: /\S+/ig,
                                                     message: <FormattedMessage id="js.many.message.0003" defaultMessage="请输入下车站点" />,
                                                 }],
                                             })}
                                />
                                <FormError errorMsg={getFieldError('stationEnd')}/>
                            </FormItem>
                        </Col>


                        <Col md={6} xs={12} sm={10} className="inputIntItem">
                            <FormItem className='time'>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0016" defaultMessage="费用" />
                                </Label>
                                <InputNumber iconStyle="one" min={0} step={1} disabled={btnFlag === 2} max={999999}
                                             {...getFieldProps('cost', {
                                                 initialValue: cost !== undefined ? cost : 1,
                                                 rules: [{pattern: /^[0-9]+$/, required: true}],
                                             })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">

                                    <FormattedMessage id="js.many.table.0017" defaultMessage="支付状态" />

                                </Label>
                                <Select disabled={btnFlag === 2}
                                        {...getFieldProps('payStatus', {
                                            initialValue: payStatus || 1,
                                            rules: [{
                                                required: true,
                                                message:<FormattedMessage id="js.many.message.0004" defaultMessage="请选择支付状态" />,
                                            }],
                                        })}
                                >
                                    <Option value={1}>
                                        <FormattedMessage id="js.many.option.0001" defaultMessage="未支付" />
                                    </Option>
                                    <Option value={2}>
                                        <FormattedMessage id="js.many.option.0002" defaultMessage="已支付" />
                                    </Option>
                                </Select>
                                <FormError errorMsg={getFieldError('payStatus')}/>
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label>
                                    <FormattedMessage id="js.many.table.0012" defaultMessage="备注" />
                                </Label>
                                <FormControl disabled={btnFlag === 2}
                                             {...getFieldProps('remark', {
                                                 initialValue: remark || '',
                                             })}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </PopDialog>
        )
    }
}

export default Form.createForm()(AddEditBook);
