import React, {Component} from "react";
import {actions} from "mirrorx";
import {Col, Row, FormControl, Label} from "tinper-bee";
import Form from 'bee-form';
import Select from 'bee-select';
import moment from "moment";
import InputNumber from "bee-input-number";
import DatePicker from "bee-datepicker";
import SelectMonth from 'components/SelectMonth';
import PopDialog from 'components/Pop';
import FormError from 'components/FormError';
import {RefWalsinLevel, RefIuapDept, RefWalsinComboLevel} from 'components/RefViews'

import zhCN from "rc-calendar/lib/locale/zh_CN";
import 'bee-datepicker/build/DatePicker.css';
import './index.less'
import {FormattedMessage} from "react-intl";

const {Option} = Select;
const {YearPicker} = DatePicker;
const {FormItem} = Form;
const format = "YYYY-MM-DD HH:mm:ss";
const formatYYYY = "YYYY";


class PopupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
            btnFlag: 0,
            cancelFlag: false
        }
    }

    titleArr = [
        this.props.intl.formatMessage({id:"js.tree.btn.0001", defaultMessage:"新增"}),
        this.props.intl.formatMessage({id:"js.tree.btn.0002", defaultMessage:"修改"}),
        this.props.intl.formatMessage({id:"js.tree.btn.0003", defaultMessage:"详情"}),
    ];

    async componentWillReceiveProps(nextProps) {
        let _this = this;
        const {btnFlag, currentIndex} = this.props;
        const {btnFlag: nextBtnFlag, currentIndex: nextCurrentIndex, editModelVisible} = nextProps;
        // 判断是否 btnFlag新弹框状态  currentIndex当前选中行
        if (btnFlag !== nextBtnFlag || currentIndex !== nextCurrentIndex) {
            _this.props.form.resetFields();
            // 防止网络阻塞造成btnFlag显示不正常
            this.setState({btnFlag: nextBtnFlag});
            let rowData = {};
            try {
                if (nextBtnFlag !== 0 && editModelVisible) {
                    const {list} = this.props;
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
     * 关闭Modal
     */
    onCloseEdit = () => {
        this.setState({rowData: {}, btnFlag: 0});
        this.props.onCloseEdit();
    }

    /**
     * 提交表单信息
     */
    onSubmitEdit = () => {
        let _this = this;
        const {btnFlag}=_this.state;
        _this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await actions.popupEdit.updateState({
                    showLoading: true
                })
                try {
                    values = _this.onHandleSaveData(values);
                    this.onCloseEdit();
                    values.btnFlag=btnFlag; // 弹框状态标识
                    await actions.popupEdit.saveOrder(values);
                } catch (e) {
                    console.log('错误信息', e);
                } finally {
                    await actions.popupEdit.updateState({
                        showLoading: false
                    })
                }

            }
        });
    }

    /**
     *
     * @description 处理保存数据
     * @param {Object} values 待处理数据
     */
    onHandleSaveData = (values) => {
        let _this = this,
            {rowData} = this.state,
            resObj = {};

        if (rowData) {
            resObj = Object.assign({}, rowData, values);
        }
        resObj.year = resObj.year.format(formatYYYY);
        //修改状态日期格式化
        if(resObj.applyTime){
            resObj.applyTime=resObj.applyTime.format(format);
        }
        _this.onHandleRef(resObj);
        return resObj;
    }

    onHandleRef = (values) => {
        let arr = ['dept', 'postLevel'];
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = JSON.parse(values[arr[i]]);
            values[arr[i]] = item['refpk'];
        }
    }

    /**
     *
     * @description 底部按钮是否显示处理函数
     * @param {Number} btnFlag 为页面标识
     * @returns footer中的底部按钮
     */
    onHandleBtns = (btnFlag) => {
        let _this = this;
        let btns = [
            {
                label: <FormattedMessage id="js.popup.btn.0006" defaultMessage="确定"/>,
                fun: _this.onSubmitEdit,
                icon: 'uf-correct'
            },

            {
                label: <FormattedMessage id="js.popup.btn.0007" defaultMessage="取消"/>,
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
        const {form, editModelVisible} = _this.props;
        const {rowData, btnFlag} = _this.state;
        const {getFieldProps, getFieldError} = form;
        const {
            code, serviceYearsCompany, pickTime,
            postLevel, levelName, year, sex, allowanceStandard, remark,
            deptName, dept, exdeeds, allowanceActual,
            allowanceType, month, pickType, name,
            serviceYears, applyTime
        } = rowData;

        let btns = _this.onHandleBtns(btnFlag);


        return (

            <PopDialog show={editModelVisible}
                       title={this.titleArr[btnFlag]}
                       size='lg'
                       btns={btns}
                       autoFocus={false}
                       enforceFocus={false}
                       close={this.onCloseEdit}>
                <Form>
                    <Row className='detail-body form-panel'>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label>
                                    <FormattedMessage id="js.popup.table.0001" defaultMessage="员工编号" />
                                </Label>
                                <FormControl disabled={true}
                                             {...getFieldProps('code', {
                                                 initialValue: code || '',
                                             })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0002" defaultMessage="员工姓名" />
                                </Label>
                                <FormControl disabled={btnFlag === 2}
                                             {...getFieldProps('name', {
                                                 validateTrigger: 'onBlur',
                                                 initialValue: name || '',
                                                 rules: [{
                                                     type: 'string',
                                                     required: true,
                                                     pattern: /\S+/ig,
                                                     message: <FormattedMessage id="js.popup.message.0001" defaultMessage="请输入员工姓名" />,
                                                 }],
                                             })}
                                />
                                <FormError errorMsg={getFieldError('name')}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0003" defaultMessage="员工性别" />
                                </Label>
                                <Select disabled={btnFlag === 2}
                                        {...getFieldProps('sex', {
                                            initialValue: typeof sex !== 'undefined' ? sex : 0,
                                            rules: [{
                                                required: true,
                                                message: <FormattedMessage id="js.popup.message.0002" defaultMessage="请选择员工性别" />,
                                            }],
                                        })}
                                >
                                    <Option value={0}>
                                        <FormattedMessage id="js.popup.option.0004" defaultMessage="女" />
                                    </Option>
                                    <Option value={1}>
                                        <FormattedMessage id="js.popup.option.0005" defaultMessage="男" />
                                    </Option>
                                </Select>
                                <FormError errorMsg={getFieldError('sex')}/>
                            </FormItem>
                        </Col>


                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0004" defaultMessage="部门" />
                                </Label>
                                <RefIuapDept
                                    disabled={btnFlag === 2}
                                       {...getFieldProps('dept', {
                                        initialValue: JSON.stringify({
                                            refname: deptName || '',
                                            refpk: dept || ''
                                        }),
                                        rules: [{
                                            message:<FormattedMessage id="js.popup.message.0003" defaultMessage="请选择部门" /> ,
                                            pattern: /[^({"refname":"","refpk":""}|{"refpk":"","refname":""})]/
                                        }],
                                    })}
                                    backdrop={false}
                                />
                                <FormError errorMsg={getFieldError('dept')}/>
                            </FormItem>

                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0005" defaultMessage="职级" />
                                </Label>
                                <RefWalsinLevel
                                    disabled={btnFlag === 2}
                                    {...getFieldProps('postLevel', {
                                        initialValue: JSON.stringify({
                                            refpk: postLevel ? postLevel.toString() : "",
                                            refname: levelName ? levelName.toString() : ""
                                        }),
                                        rules: [{
                                            message: <FormattedMessage id="js.popup.message.0004" defaultMessage="请选择职级" />,
                                            pattern: /[^({"refname":"","refpk":""}|{"refpk":"","refname":""})]/
                                        }]
                                    })}
                                />
                                <FormError errorMsg={getFieldError('postLevel')}/>
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10}>
                            <FormItem className="time">
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0006" defaultMessage="工龄" />
                                </Label>
                                <InputNumber iconStyle="one" min={0} step={1} disabled={btnFlag === 2} max={99}
                                             {...getFieldProps('serviceYears', {
                                                 initialValue: (typeof serviceYears) === "number" ? serviceYears : 1,
                                                 rules: [{pattern: /^[0-9]+$/, required: true}],
                                             })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem className="time">
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0007" defaultMessage="司龄" />
                                </Label>
                                <InputNumber iconStyle="one" min={0} step={1} disabled={btnFlag === 2} max={99}
                                             {...getFieldProps('serviceYearsCompany', {
                                                 initialValue: (typeof serviceYearsCompany) === "number" ? serviceYearsCompany : 1,
                                                 rules: [{pattern: /^[0-9]+$/, required: true}],
                                             })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem className="time">
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0008" defaultMessage="年份" />
                                </Label>
                                <YearPicker disabled={btnFlag == 2}
                                            {...getFieldProps('year', {
                                                initialValue: year ? moment(year) : moment(),
                                                validateTrigger: 'onBlur',
                                                rules: [{required: true,
                                                    message: <FormattedMessage id="js.popup.message.0005" defaultMessage="请选择申请时间" />
                                                }],
                                            })}
                                            format={formatYYYY}
                                            locale={zhCN}
                                />
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0009" defaultMessage="月份" />
                                </Label>
                                <SelectMonth disabled={btnFlag === 2}
                                             {...getFieldProps('month', {
                                                 initialValue: month ? month : 1,
                                                 rules: [{
                                                     required: true,
                                                     message: <FormattedMessage id="js.popup.message.0006" defaultMessage="请选择月份" />,
                                                 }],
                                             })} />
                                <FormError errorMsg={getFieldError('month')}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0010" defaultMessage="补贴类别" />
                                </Label>
                                <Select disabled={btnFlag === 2}
                                        {...getFieldProps('allowanceType', {
                                            initialValue: allowanceType ? allowanceType.toString() : '1',
                                            rules: [{
                                                required: true,
                                                message: <FormattedMessage id="js.popup.message.0007" defaultMessage="请选择补贴类别" />,
                                            }],
                                        })}
                                >
                                    <Option value="1">
                                        <FormattedMessage id="js.popup.option.0006" defaultMessage="电脑补助" />
                                    </Option>
                                    <Option value="2">
                                        <FormattedMessage id="js.popup.option.0007" defaultMessage="住宿补助" />
                                    </Option>
                                    <Option value="3">
                                        <FormattedMessage id="js.popup.option.0008" defaultMessage="交通补助" />
                                    </Option>
                                </Select>
                                <FormError errorMsg={getFieldError('allowanceType')}/>
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10} className="inputNumItem">
                            <FormItem className="time">
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0011" defaultMessage="补贴标准" />
                                </Label>
                                <InputNumber iconStyle="one" precision={2} min={0} max={9999} disabled={btnFlag === 2}
                                             {...getFieldProps('allowanceStandard', {
                                                 initialValue: allowanceStandard ? Number(allowanceStandard) : 100,
                                             })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10} className="inputNumItem">
                            <FormItem className="time">
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0012" defaultMessage="实际补贴" />
                                </Label>
                                <InputNumber iconStyle="one" precision={2} min={0} max={9999} disabled={btnFlag === 2}
                                             {...getFieldProps('allowanceActual', {
                                                 initialValue: allowanceActual ? Number(allowanceActual) : 100,
                                             })}
                                />
                            </FormItem>
                        </Col>
                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0013" defaultMessage="是否超标" />
                                </Label>
                                <Select disabled={btnFlag === 2}
                                        {...getFieldProps('exdeeds', {
                                            initialValue: exdeeds ? exdeeds.toString() : '0',
                                            rules: [{required: true,
                                                message: <FormattedMessage id="js.popup.message.0008" defaultMessage="请选择是否超标" />}],
                                        })}
                                >
                                    <Option value="0">
                                        <FormattedMessage id="js.popup.option.0002" defaultMessage="未超标" />
                                    </Option>
                                    <Option value="1">
                                        <FormattedMessage id="js.popup.option.0003" defaultMessage="超标" />
                                    </Option>
                                </Select>
                                <FormError errorMsg={getFieldError('exdeeds')}/>
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10} className={`${btnFlag < 2 && 'hide' || ''}`}>
                            <FormItem className="time">
                                <Label className="datepicker">
                                    <FormattedMessage id="js.popup.table.0014" defaultMessage="申请时间" />
                                </Label>
                                <DatePicker className='form-item' format={format} disabled={btnFlag === 2}
                                            {...getFieldProps('applyTime', {
                                                initialValue: applyTime ? moment(applyTime) : moment(),
                                                validateTrigger: 'onBlur',
                                                rules: [{required: true,
                                                    message: <FormattedMessage id="js.popup.message.0009" defaultMessage="请选择申请时间" />
                                                }],
                                            })}
                                />
                            </FormItem>
                        </Col>


                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label className="mast">
                                    <FormattedMessage id="js.popup.table.0015" defaultMessage="领取方式" />
                                </Label>
                                <Select disabled={btnFlag === 2}
                                        {...getFieldProps('pickType', {
                                            initialValue: pickType ? pickType.toString() : '1',
                                            rules: [{required: true,
                                                message: <FormattedMessage id="js.popup.message.0010" defaultMessage="请选择领取方式" />
                                            }],
                                        })}
                                >
                                    <Option value="1"><FormattedMessage id="js.popup.option.0009" defaultMessage="转账" /></Option>
                                    <Option value="2"><FormattedMessage id="js.popup.option.0010" defaultMessage="现金" /></Option>
                                </Select>
                                <FormError errorMsg={getFieldError('pickType')}/>
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10} className={`${btnFlag < 2 && 'hide' || ''}`}>
                            <FormItem className="time">
                                <Label className="datepicker">
                                    <FormattedMessage id="js.popup.table.0016" defaultMessage="领取时间" />
                                </Label>
                                <DatePicker className='form-item' format={format} disabled={btnFlag === 2}
                                            {...getFieldProps('pickTime', {
                                                initialValue: pickTime && moment(pickTime) || '',
                                                validateTrigger: 'onBlur',
                                                rules: [{required: false,
                                                    message: <FormattedMessage id="js.popup.message.0011" defaultMessage="请选择领取时间" />,
                                                }],
                                            })}
                                />
                            </FormItem>
                        </Col>

                        <Col md={6} xs={12} sm={10}>
                            <FormItem>
                                <Label>
                                    <FormattedMessage id="js.popup.table.0017" defaultMessage="备注" />
                                </Label>
                                <FormControl disabled={btnFlag === 2}
                                             {...getFieldProps('remark', {
                                                     initialValue: remark || ''
                                                 }
                                             )}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </PopDialog>
        )
    }
}

export default Form.createForm()(PopupModal);
