import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {closeProjectsList} from '../../reducers/modals';
import CloseButton from '../close-button/close-button.jsx';

import styles from './list-modal.css';
   

class ListModalComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            detail:{},
            isdetail:false
        }
    }
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
    }
    showdetail(index,id){
        this.setState({
            detail: this.props.list[index],
            isdetail:true
        })
        this.props.GetDetail(id)        
    }
    render() {
        console.log(this.props)
        var list = [];
        for (let i = 0; i < this.props.list.length; i++) {
            let obj = this.props.list[i];
            list.push(
                <div key={i} style={{borderBottom:'1px solid #000000'}} onClick={e=>this.showdetail(i,obj.id)}>
                    <div className='sharelistTest'>
                        <p className='testtile'>{obj.name}</p>
                        <p className='testtile'>{obj.id}</p>
                        <p className='test'>{this.timestampToTime(obj.createtime)}</p>
                        <p className='test'>{this.timestampToTime(obj.lastedittime)}</p>
                    </div>
                </div>
            );
        }
        var detail=<div>
            <button onClick={e=>{this.setState({isdetail:false})}}>返回列表</button>
            <p className='testtile'>{this.state.detail.name}</p>
            <p className='testtile'>{this.state.detail.id}</p>
            <p className='test'>{this.timestampToTime(this.state.detail.createtime)}</p>
            <p className='test'>{this.timestampToTime(this.state.detail.lastedittime)}</p>
            <button onClick={e=>{this.props.InProject(this.state.detail.unionid)}}>导入</button>
        </div>
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.props.close}
            >
                { !this.state.isdetail && list}
                {this.state.isdetail && detail}
            </ReactModal>
        );
    }
}

ListModalComponent.propTypes = {
    close: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    close: () => {
        dispatch(closeProjectsList());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListModalComponent);
