import React, {Component} from "react";
import {actions} from "mirrorx";
import {Col, Row,  FormControl, Label, Switch} from "tinper-bee";
import Form from 'bee-form';
import Select from 'bee-select';
import moment from "moment";
import DatePicker from "bee-datepicker";
import {RefIuapDept} from 'components/RefViews';
import PopDialog from 'components/Pop';
import FormControlPhone from 'components/FormControlPhone';
import FormError from 'components/FormError';

import 'bee-datepicker/build/DatePicker.css';
import 'ref-tree/dist/index.css';
import './index.less'
import {FormattedMessage} from "react-intl";

const {FormItem} = Form;
const {Option} = Select;
const format = "YYYY-MM-DD";


class AddEditPassenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
            btnFlag: 0,
            isVip: false

        }
    }

    titleArr = [
        this.props.intl.formatMessage({id:"js.tree.btn.0001", defaultMessage:"新增"}),
        this.props.intl.formatMessage({id:"js.tree.btn.0002", defaultMessage:"修改"}),
        this.props.intl.formatMessage({id:"js.tree.btn.0003", defaultMessage:"详情"}),
    ];


    async componentWillReceiveProps(nextProps) {
        const {btnFlag, currentIndex} = this.props;
        const {btnFlag: nextBtnFlag, currentIndex: nextCurrentIndex, passengerObj, checkTable, modalVisible} = nextProps;
        if (btnFlag !== nextBtnFlag || currentIndex !== nextCurrentIndex) { // 弹框默认值的条件
            // 防止网络阻塞造成btnFlag显示不正常
            this.setState({btnFlag: nextBtnFlag});
            let rowData = {};
            let isVip = false;
            try {
                // 判断是否重后端请求数据
                if (nextBtnFlag > 0 && checkTable === "passenger" && modalVisible) {
                    this.props.form.resetFields();
                    const {list} = passengerObj;
                    rowData = list[nextCurrentIndex] || {};
                    if (rowData.isVip) isVip = rowData.isVip;
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.setState({rowData, isVip});
            }
        }
    }


    /**
     * button关闭Modal 同时清空state
     * @param {Boolean} isSave 判断是否添加或者更新
     */
    onCloseEdit = (isSave) => {
        // 关闭当前 弹框清空当前的state的值，防止下次进入是上一次的数据
        this.setState({rowData: {}, btnFlag: 0});
        this.props.form.resetFields();
        this.props.onCloseModal(isSave);
    }

    /**
     *  提交信息
     */
    onSubmitEdit = () => {
        const _this = this;
        const {btnFlag}=_this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let {rowData} = _this.state;
                if (rowData && rowData.id) {
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                // 参照处理
                const {dept} = values;
                if (dept) {
                    const {refpk} = JSON.parse(dept);
                    values.dept = refpk;

                }
                // 是否会员，从state中取值
                const {isVip} = this.state; //不能使用form
                values.isVip = isVip;

                if(!isVip){ // 如果不是会员
                    values.grade = 0;
                    values.expirationDate = "";
                }

                try {
                    values.expirationDate = values.expirationDate.format(format);
                } catch (e) {
                }
                values.btnFlag=btnFlag;
                _this.onCloseEdit(true); // 关闭弹框 无论成功失败
                actions.masterDetailMany.savePassenger(values); //保存主表数据

            }
        });
    }

    /**
     *
     * @description 底部按钮是否显示处理函数
     * @param {number} btnFlag 为页面标识
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

        const {getFieldProps, getFieldError,} = form;
        const {rowData, btnFlag, isVip} = _this.state;

        const {code, phone, sex, grade, name, dept, deptName, expirationDate} = rowData;

        let btns = _this.onHandleBtns(btnFlag),
            isDisabled = btnFlag > 1 ? true : false;
        return (
            <PopDialog
                show={modalVisible}
                size='lg'
                close={this.onCloseEdit}
                title={this.titleArr[btnFlag]}
                btns={btns}
                className='passenger-modal'
            >
                <Form>
                    <Row className='detail-body form-panel'>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label>
                                    <FormattedMessage id="js.many.table.0001" defaultMessage="乘客编号" />
                                </Label>
                                <FormControl disabled
                                             {...getFieldProps('code', {
                                                 initialValue: code || '',
                                             })}
                                />
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0002" defaultMessage="乘客姓名" />
                                </Label>
                                <FormControl disabled={isDisabled}
                                             {...getFieldProps('name', {
                                                 validateTrigger: 'onBlur',
                                                 initialValue: name || '',
                                                 rules: [{
                                                     required: true, message: <FormattedMessage id="js.many.message.0005" defaultMessage="请输入乘客姓名" />
                                                 }],
                                             })}
                                />
                                <FormError errorMsg={getFieldError('name')}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0004" defaultMessage="部门" />
                                </Label>
                                <RefIuapDept
                                    disabled={btnFlag === 2}
                                    {...getFieldProps('dept', {
                                        validateTrigger: 'onChange',
                                        initialValue: JSON.stringify({
                                            refpk: dept || "",
                                            refname: deptName || "",
                                        }),
                                        rules: [{
                                            message: <FormattedMessage id="js.many.message.0006" defaultMessage="请选择部门" />,
                                            pattern: /[^({"refname":"","refpk":""}|{"refpk":"","refname":""})]/,
                                        }],
                                    })}
                                />
                                <FormError errorMsg={getFieldError('dept')}/>
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0003" defaultMessage="乘客性别" />
                                </Label>
                                <Select disabled={isDisabled}
                                        {...getFieldProps('sex', {
                                            initialValue: typeof sex != 'undefined' ? sex : 0,
                                            rules: [{
                                                required: true, message: <FormattedMessage id="js.many.message.0007" defaultMessage="请输入乘客性别" />,
                                            }],
                                        })}
                                >
                                    <Option value={0}>女</Option>
                                    <Option value={1}>男</Option>
                                </Select>
                                <FormError errorMsg={getFieldError('sex')}/>
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.many.table.0005" defaultMessage="手机号" />
                                </Label>
                                <FormControlPhone disabled={isDisabled}
                                             {...getFieldProps('phone', {
                                                 validateTrigger: 'onBlur',
                                                 initialValue: phone || '',
                                                 rules: [{
                                                     required: true,
                                                     pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                                                     message: <FormattedMessage id="js.many.message.0008" defaultMessage="请正确输入手机号" />,

                                                 }],
                                             })}
                                />
                                <FormError errorMsg={getFieldError('phone')}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label>
                                    <FormattedMessage id="js.many.table.0006" defaultMessage="是否会员" />
                                    </Label>
                                <Switch
                                    disabled={isDisabled}
                                    checked={isVip}
                                    checkedChildren={<FormattedMessage id="js.many.switch.0001" defaultMessage="是" />}
                                    unCheckedChildren={<FormattedMessage id="js.many.switch.0002" defaultMessage="否" />}
                                    onChange={(value) => {
                                        _this.setState({isVip: value});
                                    }}
                                />
                            </FormItem>

                        </Col>
                        {isVip && (
                            <Col md={6} xs={12} sm={10}>
                                <FormItem>
                                    <Label className="mast">

                                        <FormattedMessage id="js.many.table.0007" defaultMessage="会员等级" />
                                    </Label>
                                    <Select disabled={isDisabled}
                                            {...getFieldProps('grade', {
                                                initialValue: grade || 1,
                                                rules: [{
                                                    required: true, message: <FormattedMessage id="js.many.message.0005" defaultMessage="请选择会员等级" />,
                                                }],
                                            })}
                                    >
                                        <Option value={1}>
                                            <FormattedMessage id="js.many.option.0003" defaultMessage="初级会员" />
                                        </Option>
                                        <Option value={2}><FormattedMessage id="js.many.option.0004" defaultMessage="中级会员" /></Option>
                                        <Option value={3}><FormattedMessage id="js.many.option.0005" defaultMessage="高级会员" /></Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        )}
                        {isVip && (
                            <Col md={6} xs={12} sm={10}>
                                <FormItem className='time'>
                                    <Label className="mast">
                                        <FormattedMessage id="js.many.table.0008" defaultMessage="到期日期" />
                                    </Label>
                                    <DatePicker className='form-item' format={format} disabled={isDisabled}
                                                {...getFieldProps('expirationDate', {
                                                    initialValue: expirationDate ? moment(expirationDate) : moment(),
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        required: true, message: <FormattedMessage id="js.many.message.0010" defaultMessage="请选择会员到期日期" />
                                                    }],
                                                })}
                                    />
                                    <FormError errorMsg={getFieldError('expirationDate')}/>
                                </FormItem>
                            </Col>
                        )}
                    </Row>
                </Form>
            </PopDialog>
        )
    }
}

export default Form.createForm()(AddEditPassenger);
