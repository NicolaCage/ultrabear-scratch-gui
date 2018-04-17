import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import md5 from 'md5'
import {closeLoginForm} from '../../reducers/modals';
import styles from './login-form.css';
import {Wechat_APPID,Wechat_Redirect_URL, Wechat_State_Login} from "../../wechat-config";

class LoginFormComponent extends Component {
    constructor(props) {
        super(props);
        bindAll(this,[
            'onNameChange',
            'onPwdChange',
            'onNationChange',
        ])
        this.state={
            name:'',
            pwd:"",
            nation: "86",
        }
    }

    onNationChange(e) {
        let str =e.target.value.replace(/\s+/g,"")
        this.setState({
            nation: str
        })
    }

    onNameChange(e) {
        let str =e.target.value.replace(/\s+/g,"")        
        this.setState({
            name: str
        })
    }
    onPwdChange(e) {
        let str =e.target.value.replace(/\s+/g,"")        
        this.setState({
            pwd: str
        })
        console.log(this.state.pwd)
    }

    login(){
        if(this.state.name==''){
            alert('手机号码不能为空')
        }else if(this.state.pwd==''){
            alert('登录密码不能为空')
        }else{
            debugger
            let data={
                id: this.state.nation + this.state.name,
                pwd: md5(this.state.pwd)
            }
             this.props.onLogin(data)
        }
    }

    render() {
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.props.close}
            >
            <Box>
            <div className='login-container  container' style={{display:' -webkit-flex', display: 'flex'}}>
                <div>
                    <p style={{fontSize:'20px',marginBottom:'20px',textAlign:'center'}}>登录</p>
                    <div className='select-input' style={{height:'35px',marginBottom:'30px'}}>
                        <span className='login-val'> 国家编码 :</span>
                         <select className='login-nation' defaultValue='86' onChange={this.onNationChange}>
                             <option value="86">中国</option>
                             <option value="1">美国</option>
                         </select>
                    </div> 
                    <p style={{height:'35px',marginBottom:'30px'}}>
                        <span className='login-val'> 手机号码 :</span>  <input placeholder='' onInput={this.onNameChange}/>
                    </p>
                    <p style={{height:'35px',marginBottom:'30px'}}>
                        <span className='login-val'> 密码 :</span>  <input type="password" placeholder='' onInput={this.onPwdChange}/>
                    </p> <br/>
                    <button className={styles.loginButton} loading={this.props.islogin} onClick={ e=> {
                            this.login();
                        }}
                    >登录</button>
                    <button className={styles.optionButton} onClick={e => { window.location.replace(`https://open.weixin.qq.com/connect/qrconnect?appid=${Wechat_APPID}&redirect_uri=${encodeURIComponent(Wechat_Redirect_URL)}&response_type=code&scope=snsapi_login&state=${Wechat_State_Login}#wechat_redirect`) }}
                        >微信扫码登录</button>
                    {/* 去个人中心设置 */}
                    <button className={styles.optionButton} onClick={e => { window.location.replace("https://student.ultrabear.com.cn/login") }}>注册</button>
                    <button className={styles.optionButton} onClick={e => { window.location.replace("https://student.ultrabear.com.cn/login") }}>重置密码</button>
                </div>
            </div>
            </Box>
            </ReactModal>
        );
    }
}

LoginFormComponent.propTypes = {
    close: PropTypes.func.isRequired,
    onLogin: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    close: () => {
        dispatch(closeLoginForm());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginFormComponent);