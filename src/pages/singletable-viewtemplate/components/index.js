import React, { Component } from "react";
import { actions } from "mirrorx";
import classNames from "classnames";
//UI组件
import { FormControl, Label, Loading, Tooltip, Icon} from "tinper-bee";
import { FormattedMessage} from 'react-intl';
import Select from 'bee-select';
import Form from "bee-form";
import Grid from 'components/Grid';
import Header from "components/Header";
import Button from "components/Button";
import Alert from "components/Alert";
import PopDialog from "components/Pop";
import SearchArea from "./SearchArea";

//工具类

import {deepClone,getSortMap,getPageParam} from "utils";

//样式文件
import "bee-complex-grid/build/Grid.css";
import "bee-pagination/build/Pagination.css";
import 'bee-table/build/Table.css'
import "./index.less";

const Option = Select.Option;
const dataNumObj = {
  '5': 0,
  '10': 1,
  '15': 2,
  '20': 3,
  '25': 4,
  '50': 5,
  'all': 6,
}


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectValue: 0,
      modelName: "",
      showDeleteModal: false,
      columns: this.defaultColumns.slice()
    };
  }

  componentDidMount() {
    //请求模板数据
    actions.templateModel.loadTemplateList().then(res => {
      const { queryParam } = this.props;
      let queryParamAndColumns={
        queryParam
      };
      //根据模板数据获取表格的columns、分页
      if (res.content.length > 0) {
        let modelContent = '';
       try {
          modelContent = JSON.parse(res.content[0].modelContent);
        }catch(e){
          console.log(e);
        }
        if(modelContent){
          queryParamAndColumns = this.getQueryParamAndColumns(modelContent);
          this.setState({
            selectValue: 1,
            columns: queryParamAndColumns.columns
          });
        }
       
      }

      actions.templateModel.loadList(queryParamAndColumns.queryParam);
    });
  }

  /**
   * 默认的columns
   */
  defaultColumns = [
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0001", defaultMessage:"序号"}),
      dataIndex: "index",
      key: "index",
      width: 100,
      exportHidden: true,
      render(record, text, index) {
        return index + 1;
      }
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0002", defaultMessage:"员工编号"}),
      dataIndex: "code",
      key: "code",
      width: 120
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0003", defaultMessage:"员工姓名"}),
      dataIndex: "name",
      key: "name",
      width: 120,
      filterType: "text",
      filterDropdown: "show",
      render: (text, record, index) => {
        return (
          <Tooltip inverse overlay={text}>
            <span tootip={text} className="popTip">
              {text}
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0004", defaultMessage:"员工性别"}),
      dataIndex: "sexEnumValue",
      key: "sexEnumValue",
      width: 120
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0005", defaultMessage:"所属部门"}),
      dataIndex: "deptName",
      key: "deptName",
      width: 120
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0006", defaultMessage:"职级"}),
      dataIndex: "levelName",
      key: "levelName",
      width: 140
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0007", defaultMessage:"工龄"}),
      dataIndex: "serviceYears",
      key: "serviceYears",
      width: 130,
      sorter: (a, b) => a.serviceYears - b.serviceYears //添加sorter属性代表当前列可以排序
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0008", defaultMessage:"司龄"}),
      dataIndex: "serviceYearsCompany",
      key: "serviceYearsCompany",
      width: 130,
      sorter: (a, b) => a.serviceYearsCompany - b.serviceYearsCompany //添加sorter属性代表当前列可以排序
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0009", defaultMessage:"年份"}),
      dataIndex: "year",
      key: "year",
      width: 100
    },
    {
      title: this.props.intl.formatMessage({id:"js.temp.table.0010", defaultMessage:"月份"}),
      dataIndex: "monthEnumValue",
      key: "monthEnumValue",
      width: 100,
      sorter: (a, b) => a.month - b.month ////添加sorter属性代表当前列可以排序
    }
  ];

  /**
   *
   * 获取查询参数和选中columns
   *  @param {*} template 模板对象
   */
  getQueryParamAndColumns = template => {
    let trueColumns = this.defaultColumns.map(item => {
      return Object.assign({}, item);
    });
    const { queryParam } = this.props;
    const { paginationObj = { activePage: 1, items: 25 } } = template.tablePros;
    const selectColumns = template.columns;
    let sortMap = [];
    queryParam["pageParams"] = {
      pageIndex: paginationObj.activePage - 1,
      pageSize: template['pageParam']['pageSize']
    };
    //保存的columns不可以保存key为function的内容，因此和原始的columns合并下
    trueColumns = selectColumns.map((item, index) => {
      //排序参数查询
      if (item.orderNum > 0) {
        const direction = (item.order === "ascend" ? "ASC" : "DESC");
        let property = item.dataIndex;
        if (property.includes("EnumValue")) {
            property = property.replace("EnumValue", ''); //去掉枚举尾标记，前后端约定
        }
        let tempObj = {};
        tempObj[property] = direction
        sortMap.push(tempObj);
        
      }

      //合并选中columns，生成最终的columns
      let colItem = item;
      //根据dataIndex查找column元素，不可以根据index查找，因为模板的column经过交换列的操作，index并不对应
      trueColumns.some(originItem => {
        if (originItem.dataIndex == item.dataIndex) {
          colItem = { ...originItem, ...item };
          return true;
        }
      });
      return colItem;
    });
    queryParam.sortMap = sortMap;
    return {
      queryParam,
      columns:trueColumns
    }
  };
  /**
   *返回当前选中的数据数组
   *
   * @param {*} data
   */
  getSelectedDataFunc = data => {
    console.log("data", data);
  };

  /**
   *
   * 设置某一行数据是否被选中，使用类似于rowClassName
   */
  selectedRow = (record, index) => {};

  /**
   *后端排序
   *
   * @param {*} sortParam 排序参数
   * @param {*} paramColumns 当前表的column
   */
  sortFun = (sortParam, paramColumns) => {
    const { queryParam = {} } = this.props;
    queryParam.sortMap = getSortMap(sortParam);
    actions.templateModel.loadList(queryParam);
    this.setState({
      columns: paramColumns.slice() //避免修改原始columns
    });
  };

  // 分页  跳转指定页数
  freshData = pageIndex => {
    this.onPageSelect(pageIndex, 0);
  };

  // 分页  跳转指定页数和设置一页数据条数
  onDataNumSelect = (index, value) => {
    this.onPageSelect(value, 1);
  };

  // type为0标识为pageIndex,为1标识pageSize
  onPageSelect = (value, type) => {

    let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从action里
    const {pageIndex, pageSize} = getPageParam(value, type,queryParam.pageParams);
    queryParam['pageParams'] = {pageIndex, pageSize};
    actions.templateModel.loadList(queryParam);

  };

  /**
   * 选择模板
   *
   * @param {*} value
   */
  handleSelectChange = value => {
    //grid中的column是否完全使用传入的column
    this.noReplaceColumns = true;
    const { selectOptionDataSource } = this.props;
    let queryParamAndColumns={
      queryParam:{
        pageParams : {
          pageIndex : 0,
          pageSize : 25
        },
        whereParams :[],
        sortMap: []
      }
    };


    //保存的columns不可以保存key为function的内容，因此和原始的columns合并下
    if (value) {
      const selectTemplate = selectOptionDataSource.find(item=>item.value == value);
      queryParamAndColumns = this.getQueryParamAndColumns(selectTemplate.trueValue);
    }else{
      queryParamAndColumns.columns = this.defaultColumns.slice()
    }
    this.setState({ selectValue: value, columns: queryParamAndColumns.columns }, () => {
      actions.templateModel.loadList(queryParamAndColumns.queryParam);
    });
    setTimeout(() => {
      this.noReplaceColumns = false;
    }, 1000);
  };


  /**
   *
   * @description 获取column和table属性，生成模板
   * @memberof Index
   */
  createTemTable = () => {
    let colsAndTablePros = this.grid.getColumnsAndTablePros();
    let modelContentColumns = [],modelContentTable;
    colsAndTablePros.columns.forEach(item => {
      modelContentColumns.push({
        dataIndex: item.dataIndex,
        ifshow: item.ifshow,
        order: item.order,
        sorter: item.sorter,
        width: item.width,
        orderNum: item.orderNum,
        fixed: item.fixed
      });
    });
    modelContentTable = Object.assign({}, colsAndTablePros.tablePros);
    modelContentTable.columns = [];
    let {pageParams:{
      pageSize
    }} = this.props.queryParam;
    console.log('pageSize', pageSize)
    this.props.form.validateFields((err, values) => {
      values.modelContent = JSON.stringify({
        columns: modelContentColumns,
        tablePros: modelContentTable,
        pageParam:{
          pageSize: parseInt(pageSize)
        } 
      });
      actions.templateModel.saveTemplate(values);
    });
    this.setState({
      selectValue: 1,
      showModal: false
    });
  };


  /**
   *
   * @description 删除模板前调用的方法，防止select其他事件、用于打开删除模态框
   * @memberof Index
   */
  beforeDelTemplate = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    this.delId = item.id;
    this.setState({
      showDeleteModal: true
    });
  };


  /**
   * @description 删除模板
   * @memberof Index
   */
  delTemplate = () => {
    actions.templateModel.removeTemplate(this.delId);
    this.ifShowDeleteModal(false);
    // 重置当前选项
    this.handleSelectChange(0);
  };
  /**
   * @description 打开和关闭创建模板模态框
   * @memberof Index
   */
  ifShowModal = showModal => {
    this.setState({
      showModal
    });
  };

  /**
   * @description 打开和关闭删除模板模态框
   * @memberof Index
   */
  ifShowDeleteModal = showDeleteModal => {
    this.setState({
      showDeleteModal
    });
  };



  /**
   *
   * @description 导出
   * @memberof Index
   */
  export = () => {
    this.grid.exportExcel();
  };

  render() {
    let {
      list,
      showLoading,
      pageIndex,
      totalPages,
      queryParam,
      selectOptionDataSource,
      total,
      form,
      intl
    } = this.props;
    const { getFieldProps } = form;

    let { modelName, showModal, showDeleteModal, selectValue } = this.state;

    let {pageParams:{pageSize}} = queryParam;

    const paginationObj = {
      // 分页
      activePage: pageIndex, //当前页
      total: total, //总条数
      items: totalPages,
      freshData: this.freshData,
      dataNum: dataNumObj[pageSize],
      onDataNumSelect: this.onDataNumSelect
    };

    const sortObj = {
      //后端排序
      mode: "multiple",
      backSource: true,
      sortFun: this.sortFun
    };

    let templateOptsDom = selectOptionDataSource.map((item, index) => {
      return (
        <Option value={item.value} key={item.value}>
          <span>
            {item.key}
            <Icon
              type="uf-del"
              className={classNames("del-templ-icon", { disabled: index == 0 })}
              onClick={e => this.beforeDelTemplate(e, item)}
            />
          </span>
        </Option>
      );
    });
    let btns = [
      {
        label: this.props.intl.formatMessage({id:"js.temp.alert.btn.0001", defaultMessage:'确定'}),
        fun: this.createTemTable,
        icon: "uf-correct"
      },
      {
        label: this.props.intl.formatMessage({id:"js.temp.alert.btn.0002", defaultMessage:'取消'}),
        fun: () => this.ifShowModal(false),
        icon: "uf-close"
      }
    ];
    return (
      <div className="view-template">
        <Header title={this.props.intl.formatMessage({id:"ht.temp.head.0001", defaultMessage:'C2单表Grid模板示例'})} />
        <SearchArea intl={intl}  queryParam={queryParam} />
        <div className="table-header">
          <div className="btn-group">
            <Select
              className="select-templ"
              style={{ width: 200 }}
              placeholder={this.props.intl.formatMessage({id:"js.temp.sel1.0001", defaultMessage:'选择模板'})}
              onChange={this.handleSelectChange}
              value={selectValue}
            >
              {templateOptsDom}
            </Select>

            <Button
              iconType="uf-save"
              className="save-btn"
              onClick={() => {
                this.ifShowModal(true);
              }}
            >
              <FormattedMessage id="js.temp.sel1.0002" defaultMessage="保存模板" />
            </Button>

            <PopDialog
              className="template-con"
              show={showModal} //默认是否显示
              title={this.props.intl.formatMessage({id:"js.temp.alert.btn.0003", defaultMessage:'保存模板'})}
              close={() => this.ifShowModal(false)}
              btns={btns}
              size={"sm"}
            >
              <Label><FormattedMessage id="js.temp.alert.btn.0004" defaultMessage="模板名称：" /></Label>
              <FormControl
                {...getFieldProps("modelName", {
                  validateTrigger: "onBlur",
                  initialValue: modelName || "",
                  rules: [
                    {
                      type: "string",
                      required: true,
                      pattern: /\S+/gi,
                      message: this.props.intl.formatMessage({id:"js.temp.alert.btn.0005", defaultMessage:'请输入模板名称'})
                    }
                  ]
                })}
              />
            </PopDialog>
            <Button
              iconType="uf-export"
              className="save-btn"
              onClick={this.export}
            >
              <FormattedMessage id="js.temp.alert.btn.0006" defaultMessage="导出" />
            </Button>
          </div>
        </div>
        <div className="girdParent">
          <Grid
            data={list}
            rowKey={(r, i) => i}
            columns={this.state.columns.slice()}
            paginationObj={paginationObj}
            selectedRow={this.selectedRow}
            draggable={true}
            dragborder={true}
            multiSelect={{ type: "checkbox" }}
            getSelectedDataFunc={this.getSelectedDataFunc}
            scroll={{ y: "300px" }}
            showHeaderMenu={true}
            noReplaceColumns={this.noReplaceColumns}
            ref={(el) => this.grid = el}
            sort={sortObj} //后端排序
            sheetName="demo"
            sheetIsRowFilter={true}
            headerHeight={36}
            sheetHeader={{ height: 30, ifshow: false }}

          />
          <Loading show={showLoading} loadingType="line" />
        </div>

        <Alert
          show={showDeleteModal} //默认是否显示
          cancelFn={() => this.ifShowDeleteModal(false)}
          confirmFn={this.delTemplate}
          context={this.props.intl.formatMessage({id:"js.temp.alert.btn.0007", defaultMessage:'是否删除该模板 ?'})}
        />
      </div>
    );
  }
}
export default Form.createForm()(Index);
