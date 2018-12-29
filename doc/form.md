## form 表单开发

> 以 `/fe/src/pages/masterdetail-many/components/PassengerModal/index.js` 文件为例

### 步骤

1. 在表单最外层新增 `form-panel` 类名。 例：95 行
2. 将 `label` 和表单元素用 `FormItem` 包装 （ `FormItem` 从 `Form` 中引入）。 例：97 - 112 行
3. 必填项在 `label` 上新增 `mast` 类名。 例：98 行
4. 如使用 `DatePicker`,`RangePicker`,`YearPicker`,`InputNumber` 组件，需要在 `FormItem` 上增加 `time` 类。 例：220行
5. `label` 默认定义了最小宽度 `90px` 可满足 4 个汉字，如 `label` 内容多于 4 个汉字，需要自定义宽度。例：`/fe/src/pages/masterdetail-many/components/PassengerModal/index.less` 内容


### 注

必须同时满足 步骤 1、2 才可用


### dom结构示例

```
<Row className='form-panel'> // form-panel 必须
     <Col md={4} xs={6}>
        <FormItem> // FormItem 必须
            <Label className="mast">员工编号</Label> //mast待办必填 * 号
            <FormControl 
                        {...getFieldProps('code', {
                            validateTrigger: 'onBlur',
                            initialValue: code || '',
                            rules: [{
                                type: 'string',
                                required: true,
                                pattern: /\S+/ig,
                                message: '请输入员工编号',
                            }],
                        })}
            />
            <span className='error'>{getFieldError('code')}</span>
        </FormItem>
    </Col>
    <Col md={4} xs={6}>
        <FormItem>
            <Label className="mast">是否会员</Label>
            <Select 
                    {...getFieldProps('isVip', {
                        initialValue: isVip || "",
                        rules: [{
                            required: true, message: '请选择是否会员',
                        }],
                    })}
            >
                <Option value="">请选择</Option>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
            </Select>
            <span className='error'>{getFieldError('isVip')}</span>
        </FormItem>
    </Col>
    <Col md={4} xs={6}>
        <FormItem className='time'> // DatePicker 需要加 time 类
            <Label className="mast">会员到期日期</Label>
            <DatePicker format={format} 
                        {...getFieldProps('expirationDate', {
                            initialValue: expirationDate ? moment(expirationDate) : moment(),
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true, message: '请选择会员到期日期'
                            }],
                        })}
            />
        </FormItem>
    </Col>
<Row>

```
