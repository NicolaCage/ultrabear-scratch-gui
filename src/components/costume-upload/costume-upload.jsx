import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {closeUploadCostume} from '../../reducers/modals';
import CloseButton from '../close-button/close-button.jsx';
import { COSTUMES_SUBMIT_URL} from '../../api-config';
import bindAll from 'lodash.bindall';
import styles from './list-modal.css';
import axios, { post } from 'axios';

class ListModalComponent extends Component {
    constructor(props) {
        super(props);
        bindAll(this,[
            'onNameChange',
            'onFileChange',
            'fileUpload',
            'upload'
        ])
        this.state={
            detail:{},
            isdetail:false,
            file:null,
            name:''
        }
    }
    onFileChange(e) {
        this.setState({file:e.target.files[0]})
    }
    onNameChange(e){
        let str =e.target.value.replace(/\s+/g,"")        
        this.setState({
            name: str
        })
    }
    fileUpload(file) {
        const url = SUBMIT_API_URL;
        const formData = new FormData();
        formData.append('file',file)
        formData.append('resolution','1')
        formData.append('name',this.state.name)
        formData.append('center_x',"0")
        formData.append('center_y',"10")
        formData.append('format',"png")
        const config = {
            headers:{
                jwt:this.props.user.jwt,
                'Content-Type':'application/json'
            },
        }
        return post(url, formData,config)
    }
    upload(e){
        e.preventDefault()
        if(this.state.name==''){
            alert('名字不能为空')
            return
        }
        if( !this.state.file ){
            alert('请选择文件')
            return
        }
        // this.fileUpload(this.state.file)
        let config = {
            headers: {
                jwt: this.props.user.jwt ,
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }
        let data={
            file:this.state.file,
            resolution:1,
            name:this.state.name,
            center_x:0,
            center_y:0,
            format:'png'
        }
        axios({
            url:COSTUMES_SUBMIT_URL,
            method:'post', 
            data:{
                file:this.state.file,
                resolution:1,
                name:this.state.name,
                center_x:0,
                center_y:0,
                format:'png'
            } , 
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {config},
            })
            .then((res)=>{
                console.log(res)
            })
            .catch(error=>{
                alert("网络错误" + error)
            }); 
    
    }
    render() {
         
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.props.close}
                style={{textAlign:'center'}}
            >
                <form onSubmit={this.upload}>
                    <p style={{fontSize:'14px'}}><span style={{width:'25%',display:'inline-block',textAlign:'right'}}>请上传造型图片: </span> <input type='file'  style={{width:'30%',margin:'30px 30px 0',height:'50px',fontSize:'16px',display:'inline-block'}} onChange={this.onFileChange} /></p> 
                    <p style={{fontSize:'14px'}}><span style={{width:'25%',display:'inline-block',textAlign:'right'}}>名字:</span> <input maxlength='6' placeholder='长度小于6' style={{width:'30%',margin:'0 30px 0',lineHeight:'28px',fontSize:'14px',display:'inline-block',outline:'none',lineHeight:'28px'}} onChange={this.onNameChange}/></p> 
                    <button style={{fontSize:'14px',margin:'30px auto'}} type="primary" >确认上传</button>
                </form>
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
        dispatch(closeUploadCostume());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListModalComponent);
