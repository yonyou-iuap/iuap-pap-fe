import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import {Pagination} from 'tinper-bee';
import Pagination from 'bee-pagination';
// import 'bee-pagination/build/Pagination.css';
// import './index.less';
import {paginationLocale} from 'ref-core/lib/utils/locale.js'
const propTypes = {
	onSelect: PropTypes.func,
    pageCount: PropTypes.number,
    currPageIndex: PropTypes.number,
    show: PropTypes.bool
};

const defaultProps = {
    pageCount: 0,
    currPageIndex: 0,
    onSelect: ()=>{},
    show: true
}

class PaginationWrap extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    onSelect = (e) =>{
        if(e.target.type === 'button' && e.target.dataset.paginationButton){
            let { onSelect } = this.props;
            onSelect(e.target.dataset.paginationButton)
        }
    }
    render(){
        const _this = this;
        let {  currPageIndex, pageCount, show,totalElements,lang='zh_CN',onSelect } = this.props;
        return(
             <div className="ref-pagination">
                  <Pagination  
                        style={{display: show ? '' : 'none' }}
                        pageCount={pageCount}
                        first
                        last
                        prev
                        next
                        boundaryLinks
                        className={pageCount > 0 ? '' : `  ref-multiple-table-pagination-hide`}
                        items={pageCount}
                        maxButtons={5}
                        total={totalElements}
                        activePage={currPageIndex}
                        onSelect={onSelect}
                        locale={paginationLocale(lang)}
                    />
             </div>


            // <div className="ref-pagination" style={{display: show ? '' : 'none' }}>
            //     <div className="ref-pagination-button" onClick={_this.onSelect}>
            //         <Button className="ref-pagination-button-item" shape="border" size="sm" disabled={currPageIndex === 1} data-pagination-button="start">{'«'}</Button>
            //         <Button className="ref-pagination-button-item" shape="border" size="sm" disabled={currPageIndex === 1} data-pagination-button="last">{'‹'}</Button>
            //         <Button className="ref-pagination-button-item" shape="border" size="sm" disabled={currPageIndex === pageCount} data-pagination-button="next">{'›'}</Button>
            //         <Button className="ref-pagination-button-item" shape="border" size="sm" disabled={currPageIndex === pageCount} data-pagination-button="end">{'»'}</Button>
            //     </div>
            //     <div className="ref-pagination-total"><span>第 {currPageIndex} 页 </span>共计 {pageCount} 页</div>
                
            // </div>
        )
    }
}
PaginationWrap.propTypes = propTypes;
PaginationWrap.defaultProps = defaultProps;
export default PaginationWrap;