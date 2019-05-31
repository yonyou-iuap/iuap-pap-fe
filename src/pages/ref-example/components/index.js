import React, { Component } from "react";
import { actions } from "mirrorx";
import { Button, Row, Col, Icon, FormControl, Label } from "tinper-bee";

import RefWithInput from "ref-core/lib/refs/RefCoreWithInput.js";
import { RefMultipleTable } from "components/CustomedRefTable/index.js";
import { RefTree } from "components/CustomedRefTree/index.js";

import RefComboBox, {
    ComboStore
} from "components/CustomedRefCombobox/index.js";

import RefMultipleTableWithData from './RefMultipleTableWithData.js';
import RefFilterTableWithData from './RefFilterTableWithData.js';


// import { RefWalsinComboLevel, RefWalsinLevel } from "components/RefViews";
// import "components/CustomedRefTable/index.less";
import "components/CustomedRefTree/index.less";

import "./index.less";

class RefExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableSingleVal: null,
            tableMulVal: null,
            comboboxVal: null,
            matchData1: [],//表1的选中数据
            matchData2: [],//表1的选中数据

        };
    }

    componentDidMount() {

    }

    //给表格单选参照添加预设值
    setMatchData1 = () => {
        this.setState({
            tableSingleVal: `{"refname":"M1","refpk":"level2"}`,
            matchData1: [{
                refpk: "level2",refcode: "M1"
            }]
        })
    }
    
    //给表格多选参照添加预设值
    setMatchData2 = () => {
        this.setState({
            tableMulVal: `{"refname":"M5;M6","refpk":"level8;level9"}`,  
            matchData2: [{ refpk: "level8",refcode: "M5" }, 
            {refpk: "level9",refcode: "M6" }]
        })
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md={4} sm={6}>
                        <h1>表格参照（单选）</h1>
                        <RefWithInput
                            title="职级"
                            backdrop={false}
                            param={{
                                //url请求参数
                                refCode: "post_level" //test_common||test_grid||test_tree||test_treeTable
                            }}
                            refModelUrl={{
                                tableBodyUrl:
                                    "/iuap-pap-training-be/common-ref/blobRefTreeGrid", //表体请求
                                refInfo:
                                    "/iuap-pap-training-be/common-ref/refInfo" //表头请求
                            }}
                            matchUrl="/iuap-pap-training-be/common-ref/matchPKRefJSON"
                            matchData={this.state.matchData1}
                            filterUrl="/iuap-pap-training-be/common-ref/filterRefJSON"
                            valueField="refpk"
                            displayField="{refcode}"
                            fliterColumn={[]}
                            onSave={record => {
                                console.log("onSave", record);
                                this.setState({
                                    matchData1: record
                                })
                            }}
                            onCancel={record => {
                                console.log("onCancel", record);
                                this.setState({
                                    matchData1: record
                                })
                            }}
                            value={this.state.tableSingleVal}
                            theme="indigo"
                            emptyBut={true}
                        >
                            <RefMultipleTable />
                        </RefWithInput>
                        <Button onClick={() => { this.setState({ tableSingleVal: `{refname:'',refpk:${Math.random()}}` }) }}>清空</Button>
                        <Button onClick={this.setMatchData1}>预设</Button>

                    </Col>
                    <Col md={4} sm={6}>
                        <h1>表格参照（多选）</h1>
                        <RefWithInput
                            title="职级"
                            backdrop={false}
                            multiple={true}
                            param={{
                                //url请求参数
                                refCode: "post_level" //test_common||test_grid||test_tree||test_treeTable
                            }}
                            refModelUrl={{
                                tableBodyUrl:
                                    "/iuap-pap-training-be/common-ref/blobRefTreeGrid", //表体请求
                                refInfo:
                                    "/iuap-pap-training-be/common-ref/refInfo" //表头请求
                            }}
                            matchUrl="/iuap-pap-training-be/common-ref/matchPKRefJSON"
                            matchData={this.state.matchData2}
                            filterUrl="/iuap-pap-training-be/common-ref/filterRefJSON"
                            valueField="refpk"
                            displayField="{refcode}"
                            fliterColumn={[]}
                            onSave={record => {
                                console.log("onSave", record);
                                this.setState({
                                    matchData2: record
                                })
                            }}
                            onCancel={record => {
                                console.log("onCancel", record);
                                this.setState({
                                    matchData2: record
                                })
                            }}
                            theme="indigo"
                            emptyBut={true}
                            value={this.state.tableMulVal}

                        >
                            <RefMultipleTable />
                        </RefWithInput>
                        <Button onClick={() => { this.setState({ tableMulVal: `{refname:'',refpk:${Math.random()}}` }) }}>清空</Button>
                        <Button onClick={this.setMatchData2}>预设</Button>
                    </Col>
                    <RefMultipleTableWithData />
                    {/* <RefFilterTableWithData/> */}
                    <Col md={4} sm={6}>
                        <h1>下拉参照</h1>
                        <RefComboBox
                            displayField={"{refname}-{refcode}"}
                            valueField={"refpk"}
                            onClickItem={record => {
                                console.log(record);
                            }}
                            matchUrl="/iuap-pap-training-be/common-ref/matchPKRefJSON"
                            filterUrl="/iuap-pap-training-be/common-ref/filterRefJSON"
                            value={this.state.comboboxVal}
                        >
                            <ComboStore
                                topPagination={true}
                                ajax={{
                                    url:
                                        "/iuap-pap-training-be/common-ref/blobRefTreeGrid",
                                    params: {
                                        refCode: "post_level"
                                    }
                                }}
                                strictMode={true}
                                displayField={record => {
                                    return (
                                        <div>
                                            {" "}
                                            <Icon
                                                type="uf-personin-o"
                                                style={{ color: "red" }}
                                            />{" "}
                                            {record.refname}-{record.refcode}-
                                            {record.type}
                                        </div>
                                    );
                                }}
                            />
                        </RefComboBox>
                        <Button onClick={() => { this.setState({ comboboxVal: `{refname:'',refpk:${Math.random()}}` }) }}>清空</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default RefExample;
