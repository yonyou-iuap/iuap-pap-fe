import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ComboItem from '../ComboItem';
// import './index.less';
const propTypes = {
	show: PropTypes.bool,
	style: PropTypes.object,
	slider: PropTypes.string,
	onClickItem: PropTypes.func
};

const defaultProps = {
	show: true,
	style: {},
	slider: 'up',
	onClickItem: (record)=>{}
};


/**
 * 下拉面板
 */
class SliderPanel extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1
		}
	}
	// shouldComponentUpdate(nextProps, nextState) {
	// 	const thisProps = this.props, thisState = this.state;
	// 	if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
	// 		Object.keys(thisState).length !== Object.keys(nextState).length) {
	// 		return true;
	// 	}

	// 	for (const key in nextProps) {
	// 		if (!is(thisProps[key], nextProps[key])) {
	// 			return true;
	// 		}
	// 	}

	// 	for (const key in nextState) {
	// 		if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }
	handleSelect = (eventKey) => {
		console.log(eventKey);
		this.setState({
			activePage: eventKey
		});
	}
	dataNumSelect = (index, value) => {
		console.log(index, value);

	}
	onClickItem = (e) => {
		e.stopPropagation(); 
		if(e.target.dataset.type !== 'comboitem'){
			return ;
		}
		this.props.onClickItem(e.target, e);
	}
	render() {
		const _this = this;
		let { show, style, slider,onFilterMouseEnter,onFilterMouseLeave } = this.props;
		return (
			<div className={`ref-slider-panel ${slider == 'up' ? 'ref-slider-slider-up' : 'ref-slider-slider-down'}`} style={{ display: show ? '' : 'none' ,...style}}>
				
				<ul 
					onClick={_this.onClickItem}
					onMouseEnter={onFilterMouseEnter} 
					onMouseLeave={onFilterMouseLeave}
				>
					{this.props.children}
				</ul>
			</div>
		);
	}
}
SliderPanel.propTypes = propTypes;
SliderPanel.defaultProps = defaultProps;
export default SliderPanel;
export {ComboItem}
