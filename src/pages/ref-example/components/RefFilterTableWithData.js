import React, { Component } from "react";
import { actions } from "mirrorx"; 
import { Button, Row, Col, Icon, FormControl, Label } from "tinper-bee";
import RefFilterTableWithInput from "../../../components/CustomedRefFilterTable/index.js";
class RefFilterTableWithData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post_level: '',
      type: '',
      withDataVal: null,
    };
  }
  
  render() {
    return (
      <Col md={4} sm={6}>
        <h1>提取参照数据(行内过滤)</h1>
        <div>
          <Label>职级参照：</Label>
          <RefFilterTableWithInput
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
            svalueField="refpk"
            displayField="{refcode}"
            filterColumn={[
              {
                dataIndex: "code",
                filterDropdown: "show",
                filterDropdownType: "string",
                filterType: "text",
                filterDropdownIncludeKeys: ['LIKE', 'ULIKE', 'EQ']
              },
              {
                dataIndex: "type",
                filterDropdown: "show",
                filterDropdownType: "string",
                filterType: "text",
                filterDropdownIncludeKeys: ['LIKE', 'ULIKE', 'EQ']
             } ,
              {
                dataIndex: "post_level",
                filterDropdown: "show",
                filterDropdownType: "string",
                filterType: "text",
                filterDropdownIncludeKeys: ['LIKE', 'ULIKE', 'EQ']
             }
            ]}
            onSave={record => {
              console.log("onSave", record);
              if (record[0]) {
                this.setState({
                  post_level: record[0].post_level,
                  type: record[0].type
                });
              } else {
                this.setState({
                  post_level: '',
                  type: ''
                });
              }

            }}
            value={this.state.withDataVal}
            theme="indigo"
            emptyBut={true}	
          />
        </div>
        <div style={{ 'padding': '5px 0' }}>
          <Label>职级类型：</Label>
          <FormControl style={{ 'width': 'auto' }} value={this.state.type} />
        </div>
        <div style={{ 'padding': '5px 0' }}>
          <Label>职级级别：</Label>
          <FormControl style={{ 'width': 'auto' }} value={this.state.post_level} />
        </div>
        <Button onClick={() => { this.setState({ withDataVal: `{refname:'',refpk:${Math.random()}}`, post_level: '', type: '' }) }}>清空</Button>

      </Col>
    );
  }
}

export default RefFilterTableWithData;
