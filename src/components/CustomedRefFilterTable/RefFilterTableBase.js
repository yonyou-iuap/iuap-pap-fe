
import React, { Component } from 'react';
import shallowequal from 'shallowequal';
import request from './request';
import { refValParse } from './utils';
import FormControl from 'bee-form-control';
import Radio from 'bee-radio';
import RefFilterTableBaseUI from 'ref-filter-table'
import  'ref-filter-table/lib/index.css';


let searchTimeCount;
// const MultiSelectTable = multiSelect(Table, Checkbox);
class RefFilterTableBase extends Component {
	columnsData = []//表头数据
	tableData = []//表格数据
	pageCount = 1//总页数
	pageSize = '10'//每页数据数
	currPageIndex = 1//激活页码
	fliterFormInputs = []
	filterInfo = {};
	constructor(props) {
		super(props);
		this.state = {
			showLoading: true,
			tableIsSelecting: true,
			selectedDataLength: 0,
			mustRender: 0
		};
		this.checkedArray = [];
		this.checkedMap = {};
		this.inited = false;
	}

	shouldComponentUpdate(nextProps, nextState){
		return !shallowequal(nextState, this.state) || nextProps.showModal !== this.props.showModal;
	}
	componentWillReceiveProps(nextProps) {
		let _this = this;
		let { strictMode } = nextProps;
		//严格模式下每次打开必须重置数据
		if( nextProps.showModal && !this.props.showModal ){ //正在打开弹窗
			if( strictMode || !_this.columnsData.length || this.currPageIndex !== 1 ) {
				//开启严格模式 或 表头信息没有获取到，即初始化失败是必须重置
				this.setState({
					showLoading: true
				},() => {
					this.initComponent();
				});
			}
			this.setState({
				tableIsSelecting: true
			})
			//内部缓存已选择值，不通过 state 缓存，表格缓存状态自动实现
			this.checkedArray = Object.assign([],  nextProps.checkedArray || []);
			//内部缓存已选择值，缓存成 Map 便于检索
			this.checkedMap = {};
			this.checkedArray.forEach(item=>{
				this.checkedMap[item.refpk] = item;
			});
		}
	}
	initComponent = () => {
		this.inited = true;
		this.pageSize = 10;//每页数据数
		this.currPageIndex = 1;//激活页码
		let { jsonp, headers, param, value, matchUrl, onMatchInitValue, valueField = "refpk" } = this.props;
		let requestList = [
			this.getTableHeader(),
			this.getTableData({
					'refClientPageInfo.currPageIndex': this.currPageIndex - 1, 
					'refClientPageInfo.pageSize': this.pageSize 
				}),
		];
		let valueMap = refValParse(value);
		if (this.checkedArray.length == 0 && valueMap.refpk) {
			requestList.push(request(matchUrl, {
				method: 'post',
				data: {
					...param,
					pk_val: valueMap.refpk.split(',')
				},
				jsonp: jsonp,
				headers

			}))
		};

		Promise.all(requestList).then(([columnsData, bodyData, matchData]) => {
			if (this.props.onAfterAjax) {
				this.props.onAfterAjax(bodyData)
			}
			if (matchData) {
				let { data = [] } = matchData;
				this.checkedMap = {};
				this.checkedArray = data.map(item=>{
					item.key = item[valueField];
					item._checked = true;
					this.checkedMap[item.key] = item;
					return item;
				});
				if(Object.prototype.toString.call(onMatchInitValue) === '[object Function]'){
					onMatchInitValue(data);
				}
				this.setState({
					selectedDataLength: this.checkedArray.length,
					mustRender: Math.random()
				})
			}
			this.launchTableHeader(columnsData);
			this.launchTableData(bodyData);
			this.setState({
				showLoading: false
			});
		}).catch((e)=>{
			this.launchTableHeader({});
			this.launchTableData({});
			this.setState({
				showLoading: false
			});
			console.error(e)
		});;
	}
	getTableHeader = () =>{

		let { refModelUrl, param, jsonp, headers } = this.props;

		return request(refModelUrl.refInfo, {
			method: 'get',
			params: param,
			jsonp: jsonp,
			headers
		});
	}
	getTableData = ( params ) =>{
		let { refModelUrl, param, jsonp, headers } = this.props;
		return request(refModelUrl.tableBodyUrl, {
			method: 'get',
			params: { 
				...param, 
				...params
			},
			jsonp: jsonp,
			headers
		});
	}

	/**
	 * 根据 refinfo 返回结果拆解并渲染表格表头
	 * @param {object} data 
	 */
	launchTableHeader = (data) => {
		if(!data) return;
		let { multiple ,valueField='refpk'} = this.props;
		let {  filterColumn = []  } = this.props;
		let keyList = data.strFieldCode || [];
		let titleList = data.strFieldName || [];
		let fMap = {};
		filterColumn.forEach(element => {
			fMap[element.dataIndex] = element;
		});
		this.fliterFormInputs = [];
	
		let colunmsList = keyList.map((item, index) => {
			
			return {
				key: item,
				dataIndex: item,
				title: titleList[index],
				...fMap[item]		
			}
		});
		if (colunmsList.length === 0) {
			colunmsList = [{ title: "未传递表头数据", dataIndex: "nodata", key: "nodata" }];
			
		} else if(!multiple) {
			//单选时用对号符号标记当前行选中
			colunmsList.unshift({
				title: " ",
				dataIndex: "a",
				key: "a",
				width: 45,
				render(text, record, index) {
					return(
						<Radio.RadioGroup
							name={record[valueField]}
							selectedValue={record._checked?record[valueField]:null}
						>
							<Radio value={record[valueField]}></Radio>
						</Radio.RadioGroup>   
					)
				}
			})
			
		}
		this.columnsData = colunmsList;
	}
	/**
	 * 处理并渲染表格数据
	 */
	launchTableData = (response) => {
		if(!response) return;
		let { valueField = "refpk" } = this.props;
		let { data = [], page = {} } = response;
		data.map((record, k) => {
			record.key = record[valueField];
			return record;
		});
		this.tableData = data;
		this.pageCount = page.pageCount || 0;
		this.currPageIndex = page.currPageIndex + 1 || 0;
		this.totalElements = page.totalElements || 0;
	}
	handleBtnSave = (checkedArray) => {
		let {valueField} = this.props;
		this.filterInfo = '';
		this.checkedArray = Object.assign([],  checkedArray || []);
		//内部缓存已选择值，缓存成 Map 便于检索
		this.checkedMap = {};
		this.checkedArray.forEach(item=>{
			this.checkedMap[item[valueField]] = item;
		});
		this.props.onSave(checkedArray);
	}
	handleBtnCancel = () => {
		this.filterInfo = '';//关闭再进来条件清空
		this.props.onCancel()
	}
	/**
	 * 跳转到制定页数的操作
	 * @param {number} index 跳转页数
	 */
	handlePagination = (index) => {
		let { filterInfo } = this;
		let param  = {
			'refClientPageInfo.currPageIndex': index - 1, 
			'refClientPageInfo.pageSize': this.pageSize
		}
		if(typeof(filterInfo)==='string'){
			param.content = filterInfo;
		}else{
			Object.keys(filterInfo).forEach(key => {
				if(!filterInfo[key]){
					delete filterInfo[key];
				}
			});
			if(Object.keys(filterInfo).length > 0){
				param.content = JSON.stringify(filterInfo);
			}
		}
		this.loadTableData(param);
	}
	/**
	 * 选择每页数据个数
	 */
	dataNumSelect = (index, pageSize) => {
		let { filterInfo } = this;
		Object.keys(filterInfo).forEach(key => {
			if(!filterInfo[key]){
				delete filterInfo[key];
			}
		});
		this.currPageIndex = 1;//激活页码
		let param  = {
			'refClientPageInfo.currPageIndex': 0 , 
			'refClientPageInfo.pageSize': pageSize
		}
		if(Object.keys(filterInfo) > 0){
			param.content = JSON.stringify(filterInfo);
		}
		this.pageSize = pageSize;
		this.loadTableData(param);
	}
	loadTableData = (param) => {
		this.setState({
			showLoading: true
		});
		const _this = this;

		this.getTableData(param).then(response => {
			_this.launchTableData(response)
			_this.setState({
				showLoading: false
			});
		}).catch(()=>{
			_this.launchTableData({})
			_this.setState({
				showLoading: false
			});
		});
	}
	handlePageSize(size) {
		const _this = this;
		let { refModelUrl: { tableBodyUrl }, param, jsonp, headers } = this.props
		this.setState({
			showLoading: true
		}, function () {
			let { filterInfo } = _this;
			let paramWithPageSize = { page: 0, pageSize: size, 'refClientPageInfo.currPageIndex': 0, 'refClientPageInfo.pageSize': size }
			if (filterInfo) {
				Object.keys(filterInfo).forEach(key => {
					if(!filterInfo[key]){
						delete filterInfo[key];
					}
				});
				if(Object.keys(filterInfo) > 0){
					paramWithPageSize.content = JSON.stringify(filterInfo);
				}
			}
			_this.loadTableData(paramWithPageSize);
		})
	}
	miniSearchFunc = (value) => {
		console.log("miniSearchFunc",value)
		clearTimeout(searchTimeCount);
		const _this = this;
		searchTimeCount = setTimeout(() => {
			let { refModelUrl: { tableBodyUrl }, param, jsonp, headers } = this.props;
			this.filterInfo = value;
			this.setState({
				showLoading: true,
				tableIsSelecting: true
			}, function () {
				let { pageSize } = _this;
				let paramWithFilter = Object.assign({}, param, { page: 0, pageSize: pageSize, content: value, 'refClientPageInfo.currPageIndex': 0, 'refClientPageInfo.pageSize': pageSize })
				
				_this.loadTableData(paramWithFilter);
			})
		}, 300);
		
	}
	searchFilterInfo = (filterInfo) => {
		console.log('searchFilterInfo,filterInfo',filterInfo)
		const _this = this;
		let { refModelUrl: { tableBodyUrl }, param, jsonp, headers } = this.props;
		this.filterInfo = filterInfo;
		this.setState({
			showLoading: true,
			tableIsSelecting: true
		}, function () {
			let { pageSize } = _this;
			let paramWithFilter = Object.assign({}, param, { page: 0, pageSize: pageSize, content: '', 'refClientPageInfo.currPageIndex': 0, 'refClientPageInfo.pageSize': pageSize })
			if (Object.keys(filterInfo).length > 0) {
				paramWithFilter.content = JSON.stringify(filterInfo)
			}
			
			_this.loadTableData(paramWithFilter);
		})
	}

	//搜索
	onFilterChange = (field,value,condition) =>{
		alert(`field=${field},value=${value},condition=${condition}`)
	
	  }
	  //清除
	  onFilterClear = (field) =>{
		alert(field)
	  }
	render() {
		const _this = this;
		let { className, miniSearch = true, title = '', backdrop, size = 'lg', 
		multiple, showModal, lang = 'zh_CN', value,
		valueField,emptyBut=false,buttons,theme='ref-red',searchPanelLocale,filterColumn } = this.props;
		let { showLoading, tableIsSelecting, selectedDataLength, mustRender } = this.state;
		let { tableData, pageCount, pageSize, currPageIndex, columnsData, totalElements, checkedArray } = _this;
		
		let _tableData = tableData.map(item => {
			item._checked = _this.checkedMap.hasOwnProperty(item[valueField]);
			return item;
		});
		checkedArray.forEach(item => {
			item._checked = true;
		});
		let op = {
			value,
			multiple,
			className, 
			miniSearch,
			title, 
			backdrop, 
			size,
			showModal, 
			lang, 
			valueField, 
			emptyBut, 
			buttons, 
			theme,
			fliterFormInputs :this.fliterFormInputs,
			showLoading,
			tableData:_tableData,
			pageCount, 
			currPageIndex, 
			columnsData,
			totalElements,
			searchPanelLocale,
			onSave:this.handleBtnSave,
			onCancel:this.handleBtnCancel,
			dataNumSelect:this.dataNumSelect,
			handlePagination:this.handlePagination,
			searchFilterInfo:this.searchFilterInfo,
			miniSearchFunc:this.miniSearchFunc,
			matchData:this.checkedArray,
			filterColumn,
			onFilterChange:this.onFilterChange,
			onFilterClear:this.onFilterClear
		}
		
		return (
			<RefFilterTableBaseUI {...op} />
		);
	}
}
export default RefFilterTableBase;