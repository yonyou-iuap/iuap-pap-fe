import React, { Component } from "react";
import { actions } from "mirrorx";
import { Button, Row, Col, Icon, FormControl, Label } from "tinper-bee";

import RefWithInput from "ref-core/lib/refs/RefCoreWithInput.js";
import { RefMultipleTable } from "components/CustomedRefTable/index.js";
import { RefTree } from "components/CustomedRefTree/index.js";

import RefComboBox, {ComboStore
} from "components/CustomedRefCombobox/index.js";

import RefMultipleTableWithData from './RefMultipleTableWithData.js';

// import { RefWalsinComboLevel, RefWalsinLevel } from "components/RefViews";
// import "components/CustomedRefTable/index.less";
import "components/CustomedRefTree/index.less";

import "./index.less";

class RefExample extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

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
                            filterUrl="/iuap-pap-training-be/common-ref/filterRefJSON"
                            valueField="refpk"
                            displayField="{refcode}"
                            fliterColumn={[]}
                            onSave={record => {
                                console.log("onSave", record);
                            }}
                        >
                            <RefMultipleTable />
                        </RefWithInput>
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
                            filterUrl="/iuap-pap-training-be/common-ref/filterRefJSON"
                            valueField="refpk"
                            displayField="{refcode}"
                            fliterColumn={[]}
                            // fliterColumn={[
                            //     {
                            //         dataIndex: "code",
                            //         filterDropdown: "show",
                            //         filterDropdownType: "string",
                            //         filterType: "text",
                            //         filterDropdownIncludeKeys: ["LIKE", "ULIKE", "EQ"]
                            //     },
                            //     {
                            //         dataIndex: "type",
                            //         filterDropdown: "show",
                            //         filterDropdownType: "string",
                            //         filterType: "text",
                            //         filterDropdownIncludeKeys: ["LIKE", "ULIKE", "EQ"]
                            //     },
                            //     {
                            //         dataIndex: "post_level",
                            //         filterDropdown: "show",
                            //         filterDropdownType: "string",
                            //         filterType: "dropdown",
                            //         filterDropdownIncludeKeys: ["LIKE", "ULIKE", "EQ"]
                            //     }
                            // ]}
                        >
                            <RefMultipleTable />
                        </RefWithInput>
                    </Col>
                    <RefMultipleTableWithData/>
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
                        >
                            <ComboStore
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
                    </Col>
                </Row>
            </div>
        );
    }
}

export default RefExample;
