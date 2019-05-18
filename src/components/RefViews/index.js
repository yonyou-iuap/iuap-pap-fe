import React from "react";
import { Icon } from "tinper-bee";

// import {RefMultipleTable,RefWithInput } from 'ref-multiple-table';
import { RefMultipleTable, RefWithInput } from "../CustomedRefTable/index.js";
import { RefTree } from "../CustomedRefTree/index.js";

import "../CustomedRefTable/index.less"; //职级样式
import "../CustomedRefTree/index.less"; // 部门样式

import RefComboBox,{ComboStore} from "../CustomedRefCombobox/index.js";

function RefIuapDept(props) {
    return (
        <RefWithInput
            style={{}}
            title={"部门"}
            searchable={true}
            param={{ refCode: "newdept" }}
            multiple={false}
            checkStrictly={true}
            disabled={false}
            displayField="{refname}"
            valueField="refpk"
            refModelUrl={{
                treeUrl: "/newref/rest/iref_ctr/blobRefTree" //树请求
            }}
            matchUrl="/newref/rest/iref_ctr/matchPKRefJSON"
            filterUrl="/newref/rest/iref_ctr/filterRefJSON"
            {...props}
            theme="indigo"
        >
            <RefTree className={props.className} emptyBut={true} />
        </RefWithInput>
    );
}
function RefWalsinLevel(props) {
    return (
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
                refInfo: "/iuap-pap-training-be/common-ref/refInfo" //表头请求
            }}
            matchUrl="/iuap-pap-training-be/common-ref/matchPKRefJSON"
            filterUrl="/iuap-pap-training-be/common-ref/filterRefJSON"
            valueField="refpk"
            displayField="{refcode}"
            {...props}
        >
            <RefMultipleTable />
        </RefWithInput>
    );
}

function RefWalsinComboLevel(props) {
    return (
        <RefComboBox
            displayField={"{refname}-{refcode}"}
            valueField={"refpk"}
            onClickItem={record => {
                console.log(record);
            }}
            matchUrl="/iuap-pap-training-be/common-ref/matchPKRefJSON"
            filterUrl="/iuap-pap-training-be/common-ref/filterRefJSON"
            {...props}
        >
            <ComboStore
                ajax={{
                    url: "/iuap-pap-training-be/common-ref/blobRefTreeGrid",
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
                            {record.refname}-{record.refcode}-{record.type}
                        </div>
                    );
                }}
            />
        </RefComboBox>
    );
}

export { RefIuapDept, RefWalsinLevel, RefWalsinComboLevel };
