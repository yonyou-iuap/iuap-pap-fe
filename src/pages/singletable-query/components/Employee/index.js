import React, {Component} from 'react'
import {actions} from 'mirrorx';
import queryString from "query-string";
import Header from 'components/Header';
import Button from 'components/Button';

import { FormattedMessage } from 'react-intl';

import './index.less';

export default class Employee extends Component {
 
    
    onBack = () => {
        // 通过routing 返回上一页
        actions.routing.replace({pathname: '/'});
    }

    render() {
        const _this = this;
        const searchObj = queryString.parse(_this.props.location.search);
        const {code, name, sexEnumValue, levelName} = searchObj;
        return (
            <div className="employee">
                <Header title={this.props.intl.formatMessage({id:"ht.table.query.0001", defaultMessage:"A1单表查询示例"})}>
                    <div className='head-btn'>
                        <Button iconType="uf-back" className="ml8" onClick={_this.onBack}>取消</Button>
                    </div>
                </Header>
                <div className="content">
                    <div className="item">
                        <span><FormattedMessage id="js.query.pop.0001" defaultMessage="员工编号：" /></span>
                        <span>{code}</span>
                    </div>
                    <div className="item">
                        <span><FormattedMessage id="js.query.pop.0002" defaultMessage="员工姓名：" /></span>
                        <span>{name}</span>
                    </div>
                    <div className="item">
                        <span><FormattedMessage id="js.query.pop.0003" defaultMessage="员工性别：" /></span>
                        <span>{sexEnumValue}</span>
                    </div>
                    <div className="item">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FormattedMessage id="js.query.pop.0004" defaultMessage="职级：" /></span>
                        <span>{levelName}</span>
                    </div>
                </div>
            </div>

        )

    }
}
