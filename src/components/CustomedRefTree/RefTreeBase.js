import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { is } from 'immutable';
import RefTreeBaseUI from 'ref-tree'
import 'ref-tree/lib/index.css';
import { refValParse } from './utils';
import request from './request';
const noop = () => {
};
let searchTimeCount ;
const getTreeList = (url,param, content="",  jsonp = false) => request(url, {
	method: 'get',
	params: Object.assign(param,{content}),
	jsonp: jsonp
});
// data:this.treeData,树的所有节点，curKey:正在操作的节点的key值，child：1.request请求得到的该key下的子节点，或者缓存中该key下的子节点
const clearChild = (data, curKey, child) => {
	data.map((item) => {
		if (curKey == item.id) {
			item.children = child;
		} else if (item.children){
			 clearChild( item.children,curKey,child);
		}else{
		}
	});
	return data;
};
const propTypes = {
	title: PropTypes.string,
	tabData: PropTypes.array, //  json数组须指定 title,id 参数   默认为空,且为空时不显示 tab 组件
	multiple: PropTypes.bool, //  默认单选
	checkable: PropTypes.bool,
	showLine: PropTypes.bool,
	bottomButton: PropTypes.bool,
	defaultExpandAll: PropTypes.bool,  // 数默认展开
	checkStrictly: PropTypes.bool,
	parentNodeDisableCheck: PropTypes.bool,
	checkedArray: PropTypes.array, //  指定已选择数据id
	param: PropTypes.object,
	lazyModal: PropTypes.bool,
	lazyParam:PropTypes.array, // 20190127懒加载需要多传参数，暂时不对外暴露
	emptyBut: PropTypes.bool, //清空按钮
	onCancel: PropTypes.func,
	onSave: PropTypes.func,
	value: PropTypes.string,
	lang: PropTypes.string,
	//重命名属性
	searchable: PropTypes.bool, //  是否应用搜索 默认 false,

};
const defaultProps = {
	title: '弹窗标题',
	searchable: false, //  是否应用搜索 默认 false,
	tabData: [], //  json数组须指定 title,id 参数   默认为空,且为空时不显示 tab 组件
	multiple: false, //  默认单选
	checkable: true,
	showLine: false, //  默认单选
	bottomButton: true,
	defaultExpandAll: true,  // 数默认展开
	checkStrictly: false,
	parentNodeDisableCheck: false,
	checkedArray: [], //  指定已选择数据id
	lazyModal: false,
	lazyParam:[],// 20190127懒加载需要多传参数，暂时不对外暴露
	emptyBut: false,
	param: {
		refCode: '',
	},
	onCancel: noop,
	onSave: noop,
	value: '',
	lang: 'zh_CN',
	showLine: false
}

class RefTreeBase extends Component {
	constructor(props) {
		super(props);
		const { checkedArray, multiple, checkStrictly, parentNodeDisableCheck, defaultExpandAll, tabData, valueField } = props;
		this.state = {
			selectedArray: checkedArray || [], //  记录保存的选择项
			tabActiveKey: null, //  记录当前激活tab
			originKey: null, //  保留tab点击已选择的前一tab的key
			tabData: tabData,
			//  tree state
			defaultExpandAll,
			multiple,
			checkStrictly,
			parentNodeDisableCheck,
			checkedKeys: checkedArray.map(item=>{
				return item[valueField];
			}),
			showError: false,
			expandedKeys: [],
			onSaveCheckItems: [],
			isAfterAjax: false,
			showLoading: false
		};
		
		this.treeData = [];
		this.treeDataCache = {};
		this.searchValue;//搜索的内容
	}
	shouldComponentUpdate(nextProps, nextState){
		return !is(nextState, this.state) || nextProps.showModal !== this.props.showModal;
	}
	componentWillReceiveProps(nextProps) {
		let { strictMode,checkedArray,valueField } = nextProps;
		//严格模式下每次打开必须重置数据
		if( nextProps.showModal && !this.props.showModal ){ //正在打开弹窗
			if( strictMode || !this.treeData.length ) {
				//开启严格模式 
				this.setState({
					showLoading: true
				},() => {
					this.initComponent();
				});
			}
			//20190124因為不再走constructor，导致checkedKeys和selectedArray不一致
			if(checkedArray.length>0){
				this.setState({
					selectedArray: checkedArray || [], //  记录保存的选择项
					checkedKeys: checkedArray.map(item=>{
						return item[valueField];
					}),
				})
			}
		}
		// this.setState({
		//   checkedArray:this.props.option.checkedArray
		// })
	}
	initComponent = () => {

		let { matchUrl, param, value, jsonp, headers, valueField, checkedArray, onMatchInitValue } = this.props;
		
		this.getRefTreeData();
		//当有已选值，不做校验，即二次打开弹出层不做校验
		let valueMap = refValParse(value)
		if(checkedArray.length != 0 || !valueMap.refpk) return;
		if(matchUrl){
			request(matchUrl, { 
				method: 'post',
				data: {
					...param,
					refCode: param.refCode,
					pk_val: valueMap.refpk.split(',') || ''
				},
				jsonp: jsonp,
				headers
				
			}).then(response=>{
				let { data = [] } = response || {};
				if(Object.prototype.toString.call(onMatchInitValue) === '[object Function]'){
					onMatchInitValue(data);
				}
				this.setState({
					checkedArray: data,
					selectedArray: data,
					showLoading: false,
					checkedKeys: data.map(item=>{
						return item.refpk;
					})
				});
			}).catch(()=>{
				this.setState({
					checkedArray: [],
					selectedArray: [],
					showLoading: false,
					checkedKeys: []
				});
			});
		}else{
			//当时不使用 matchUrl 做校验时，直接使用默认数护具标记选项，但数据完整性会变弱。
			this.setState({
				checkedArray: [valueMap],
				selectedArray: [valueMap],
				showLoading: false,
				checkedKeys: valueMap.refpk.split(',')
			});
		}
		
	}

	onSave = (selectedArray) =>{
		let {valueField} = this.props;
		this.setState({
			selectedArray: selectedArray || [], //  记录保存的选择项
			checkedKeys: selectedArray.map(item=>{
				return item[valueField];
			}),
		},()=>{
		  this.searchValue  = '';//参照打开在关闭这里搜索条件清空
			this.props.onSave(selectedArray);
		})
		
	}
	onCancel = () =>{
		this.setState({
			selectedArray: [],
			checkedKeys: [],
			onSaveCheckItems: [],//20190124不保存那么选中的数据清空
		}, () => {
			this.searchValue  = '';//参照打开在关闭这里搜索条件清空
			this.props.onCancel();
		});
	}

	onSearchClick = (value) => {
		this.searchValue = value;
		clearTimeout(searchTimeCount);
		searchTimeCount = setTimeout(() => {
		  this.getRefTreeData(value);
		}, 300);
	};
	onSearchChange = (value) => {
		this.searchValue = value;
		clearTimeout(searchTimeCount);
		searchTimeCount = setTimeout(() => {
		  this.getRefTreeData(value);
		}, 300);
	};

	//   获取树组件数据
	getRefTreeData(value) {
		let { param, checkedArray, refModelUrl, lazyModal, onAfterAjax, jsonp } = this.props;
		const URL = refModelUrl.treeUrl;
		param = Object.assign(param, {
			treeNode: "",
			treeloadData: lazyModal
		});
		getTreeList(URL, param, value, jsonp).then((res) => {
			if (onAfterAjax && !this.state.isAfterAjax) {
				onAfterAjax(res)
				this.setState({ isAfterAjax: true })
			}
			let { data, page } = res;
			if (data && data.length > 0) {
				if (lazyModal) {
					data = data.map((item) => {
						delete item.children;
						return item;
					})
				}
				this.treeData = data;
				
				this.setState({
					showLoading: false
				});
				if (data[0].id) {
					this.setState({
						expandedKeys: [data[0].id],
					});
				}
			} else {
				this.treeData = [];
				this.setState({
					showLoading: false,
				});
			}
		}).catch(()=>{
			this.treeData = [];
			this.setState({
				showLoading: false
			});
		});
	}

	removeOne(c) {
		const { selectedArray } = this.state;
		const arr = selectedArray.filter((item) => {
			return item.refpk !== c.refpk;
		});
		const selectedKeys = arr.map((item) => {
			return item.refpk;
		});
		this.setState({
			selectedArray: arr,
			checkedKeys: selectedKeys,
		});
	}
	clearAll() {
		this.setState({
			selectedArray: [],
			checkedKeys: [],
		});
	}

	onLoadData = (treeNode) => {
		return new Promise((resolve) => {
			this.getRefTreeloadData(treeNode.props.eventKey,treeNode.props.attr)
			resolve();
		});
	}
	/**
	 * 懒加载
	 * @param {选择的节点} treeNode 
	 */
	getRefTreeloadData(treeNode,treeNodeAttr) {
		let { param, refModelUrl, lazyModal, tabData, jsonp ,lazyParam} = this.props;
		const URL = refModelUrl.treeUrl;
		// if(this.treeDataCache[treeNode]){
		// 	this.treeData = clearChild(this.treeData, treeNode, this.treeDataCache[treeNode]);
		// 	this.setState({
		// 		showLoading: false
		// 	});
		// 	return ;
		// }
		//lazyModal 懒加载模式,懒加载的参数传递与其他的不一样
		// 两种情况，单树只需要一个参数，组合树需要多个参数
		if(!lazyParam.length){
			param = Object.assign(param, {
				treeNode: treeNode,
				treeloadData: lazyModal
			});
		}else{
			let treeNodeVal = {};
			treeNodeVal['refpk'] = treeNode;
			lazyParam.forEach(key=>{
				treeNodeVal[key] = treeNodeAttr[key]
			});
			param = Object.assign(param, {
				treeNode: JSON.stringify(treeNodeVal),
				treeloadData: lazyModal
			});
		}
		
		this.setState({
			showLoading: true
		});
		getTreeList(URL, param, this.searchValue, jsonp).then((res) => {
			if (res) {
				let { data = [] } = res;
				this.treeDataCache[treeNode] = data;
				if(data.length !== 0){
					this.treeData = clearChild(this.treeData, treeNode, data);
				}
			}
			this.setState({
				showLoading: false
			});
			
		}).catch(()=>{
			this.setState({
				showLoading: false
			});
		});
	}
	removeByValue(arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == val) {
				arr.splice(i, 1);
				break;
			}
		}
		return arr
	}
	render() {
		let { 
			title,
			backdrop,
			className,
			searchable,
			valueField,
			value,
			checkedArray,
			showLine,
			lazyModal,
			showModal,
			lang,
			defaultExpandAll,
			nodeDisplay = "{refname}",
			buttons,
			emptyBut,
			theme = 'indigo',
		} = this.props;
		const { selectedArray, checkedKeys, multiple, expandedKeys, 
			checkStrictly, parentNodeDisableCheck, showLoading } = this.state;
		let op = {
			title,
			backdrop,
			className,
			showLoading,
			searchable,
			valueField,
			value,
			checkStrictly,
			showLine,
			lazyModal,
			showModal,
			lang,
			defaultExpandAll,
			nodeDisplay,
			buttons,
			emptyBut,
			multiple,
			treeData : this.treeData,
			theme,
			getRefTreeData:this.getRefTreeData,
			onLoadData:this.onLoadData,
			onSave:this.onSave,
			onCancel:this.onCancel,
			getRefTreeData:this.onSearchClick,
			onLoadData:this.onLoadData,
			matchData:checkedArray,
		}
		return (
				<RefTreeBaseUI {...op} />
		);
	}
}
RefTreeBase.propTypes = propTypes;
RefTreeBase.defaultProps = defaultProps;
export default RefTreeBase;
