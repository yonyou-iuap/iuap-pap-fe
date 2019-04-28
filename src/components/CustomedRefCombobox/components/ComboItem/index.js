import React, { PureComponent } from 'react';
// import './index.less';
const ComboItem = (props) =>{
	return (
		<li 
			className={`ref-combo-item ${!props.active || 'ref-combo-item-active'}`}
			onClick={(e)=>{
				if(e.target.dataset.type !== 'comboitem'){
					e.target.dataset.type = 'comboitem';
					e.target.dataset.value = props.value;
				}
				// props.onClick()
			}}
			data-value={props.value}
			data-type="comboitem"

		>
			{props.text}
		</li>
	);
}
export default ComboItem;