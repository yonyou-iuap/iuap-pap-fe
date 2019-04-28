import React, { Component } from "react";
import PropTypes from "prop-types";
import { refValParse } from "./utils/utils";
import request from "./utils/request";
import "./utils/polyfill";
import RefComboBoxBaseUI, { ComboStore, ComboItem } from "ref-combobox";
import "ref-combobox/lib/index.css";

let searchTimer = null;

const propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    displayField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    valueField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    sliderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClickItem: PropTypes.func,
    matchUrl: PropTypes.string,
    filterUrl: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    canClickGoOn: PropTypes.func,
    canInputGoOn: PropTypes.func,
    onSave: PropTypes.func
};

const defaultProps = {
    className: "",
    value: "",
    displayField: "{refname}",
    valueField: "refcode",
    style: {},
    canClickGoOn: () => {
        return true;
    },
    canInputGoOn: () => {
        return true;
    },
    onSave: () => {}
};

class RefComboBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currPageIndex: 0,
            pageCount: -1, //总页数
            totalElements: 0, //一共多少条
            comboboxStoreData: [], //下拉的数据
            loading: false,
            storeData:[]
        };
        //用于控制预加载的标记
        this.loadCount = 0;
    }
    componentDidMount() {
        let { value } = this.props;
        if (value) {
            let refValue = refValParse(value);
            this.inputVal = refValue.refname;
            this.loadData(this.inputVal);
        }
    }

    /**
     * 数据选择
     */
    onClickItemInner = record => {
        let { valueField } = this.props;
        let value;
        if (typeof record === "object") {
            if (typeof valueField === "string") {
                value = record[valueField] || "";
            } else {
                value = valueField(record) || "";
            }
            this.inputVal = value;
        }
        if (this.props.onClickItem) {
            this.props.onClickItem(record);
        }
    };

    //新增搜索
    onChangeFormControl = value => {
        clearTimeout(searchTimer);
        this.inputVal = value;
        searchTimer = setTimeout(() => {
            this.loadData(value);
        }, 500);
    };
    onSelect = currPageIndex => {
        this.setState({ currPageIndex: currPageIndex - 1 }, () => {
            this.loadData(this.inputVal);
        });
    };
    fixDataToMap = data => {
        if (!data || !data.length) return {};
        let { valueField = "refpk" } = this.props;
        let dataMap = {};
        data.forEach(item => {
            dataMap[item[valueField]] = item;
        });
        return dataMap;
    };
    onPopupVisibleChange = (visible,sliderSearchVal) => {
        console.log("onPopupVisibleChange")
        if (!visible) {
            this.inputVal = sliderSearchVal;
            this.loadData(sliderSearchVal);
        }
    };

    loadData = async sliderSearchVal => {
      console.log('loadData....');
        this.setState({
            loading: true
        });
        let { afterLoad } = this.props;
        let value = this.inputVal;
        let { ajax, displayField, valueField } = this.props.children.props;
        let { currPageIndex } = this.state;
        if (!ajax.params) ajax.params = {};
        ajax.params.page = currPageIndex;
        ajax.params["refClientPageInfo.currPageIndex"] = currPageIndex;
        ajax.params["refClientPageInfo.pageSize"] = 10;
        ajax.params["content"] = sliderSearchVal;
        let results = await request(ajax);
        let comboboxStoreData = [];
        let storeData = [];
        if (!results) {
            comboboxStoreData = [
                <div className="ref-combobox-data-empty">暂无匹配数据</div>
            ];
            this.setState({
                comboboxStoreData,
                loading: false,
                pageCount:-1,
                totalElements:0,
            });
            return false;
        }
        if (results.data && results.data.length) {
            storeData = results.data;
            comboboxStoreData = results.data.map((item, index) => {
                let text = "";
                if (typeof displayField === "string") {
                    text = displayField.format(item);
                } else if (typeof displayField === "function") {
                    text = displayField(item);
                } else {
                    text = item.refname;
                }
                return (
                    <ComboItem
                        active={
                            item[valueField] === value || item.refname === value
                        }
                        key={`${item[valueField]}-index`}
                        text={text}
                        value={item[valueField]}
                    />
                );
            });
        }
        let page = results.page;
        this.setState(
            {
                comboboxStoreData,
                storeData,
                ...page,
                loading: false
            },
            () => {
                if (afterLoad) {
                    afterLoad(this.fixDataToMap(results.data));
                }
            }
        );
        if (currPageIndex == 0) {
            //当请求第一页时则设置请求次数为 1 ，则第二次打开时就无需再次请求数据。
            this.loadCount = 1;
        } else {
            this.loadCount++;
        }
        return true;
    };

    render() {
        let {
            className,
            displayField,
            valueField,
            sliderWidth,
            style,
            value,
            theme = "ref-red"
        } = this.props;
        let {
            pageCount,
            currPageIndex,
            comboboxStoreData,
            storeData,
            loading,
            totalElements
        } = this.state;
        let op = {
            ...this.props,
            className,
            displayField,
            valueField,
            sliderWidth,
            style,
            theme,
            value,
            onClickItemInner: this.onClickItemInner,
            onChangeFormControl: this.onChangeFormControl,
            onPopupVisibleChange: this.onPopupVisibleChange,
            onSelect: this.onSelect,
            comboboxStoreData,
            storeData,
            pageCount,
            currPageIndex,
            loading,
            totalElements,
        };
        return <RefComboBoxBaseUI {...op} />;
    }
}
RefComboBox.propTypes = propTypes;
RefComboBox.defaultProps = defaultProps;
export default RefComboBox;
export { ComboStore, ComboItem };
