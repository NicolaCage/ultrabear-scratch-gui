import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';
import md5 from 'md5'

import LoginFormComponent from '../components/login-form/login-form.jsx';

import {setUser} from '../reducers/user';
import {closeLoginForm} from '../reducers/modals';
import { AUTH_ROOT } from '../api-config';

const loginValidSeconds = 60*60;
const AppId = "wx8811da75092d28c4";
const WechatRedirectUrl = "https://coding.ultrabear.com.cn";

class LoginForm extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSubmit',
            'handleScan',
            'handleUserNameChange',
            'handlePasswordChange'
        ]);
        this.state = {
            username: "",
            password: ""
        };
    }
    handleUserNameChange (e) {
        var value = e.target.value;
        this.setState({username: value});
    }
    handlePasswordChange (e) {
        var value = e.target.value;
        this.setState({password: value});
    }
    
    handleSubmit () {
        if (!this.state.username || this.state.username.length == 0 || !this.state.password || this.state.password.length == 0) return;
        var payload = JSON.stringify({
            "id": this.state.username,
            "pwd": md5(this.state.password)
        });
        xhr({
            method: "POST",
            url: AUTH_ROOT + '/login',
            body: payload,
            headers: {
                "Content-Type": "application/json"
            },
        }, (err, response, body) => {
            // body = JSON.parse(body);
            // if (!err && body.data && body.code == 0) {
            //     if (body.msg.includes("wechat")) {
            //         // Not set up wechat yet
            //         alert("还未绑定微信，请扫码绑定");
            //         this.handleScan();
            //     }
            //     else {
            //         let jwt = body.data;
            //         var decoded = jwtDecode(jwt);
            //         this.props.setUser({
            //             id: decoded.id,
            //             permission: decoded.permission,
            //             name: decoded.name,
            //             openId: decoded.openId,
            //             unionId: decoded.unionId,
            //             jwt: jwt
            //         });
            //         cookie.save('userId', decoded.id, { path: '/', maxAge: loginValidSeconds });
            //         cookie.save('userName', decoded.name, { path: '/', maxAge: loginValidSeconds });
            //         cookie.save('permission', decoded.permission, { path: '/', maxAge: loginValidSeconds });
            //         cookie.save('jwt', jwt, { path: '/', maxAge: loginValidSeconds });
            //         this.props.close();
            //         console.log("登录成功");
            //     }
            // }
            // else {
            //     switch (body.code) {
            //         case 1: alert("用户名或密码错误"); break;
            //         case 2: alert("网络错误"); break;
            //         default: alert("登录失败");
            //     }
            // }
        });
    }

    handleScan() {
        let stateCode = "fenoojrewfvkfsdafdsfdsa";
        let callbackURI = encodeURIComponent(WechatRedirectUrl);
        console.log(callbackURI);
        let wechatScanUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${AppId}&redirect_uri=${callbackURI}&response_type=code&scope=snsapi_login&state=${stateCode}#wechat_redirect`
        window.location.href = wechatScanUrl;
    }

    render () {
        return (
            <LoginFormComponent
                onUserNameChange={this.handleUserNameChange}
                onPasswordChange={this.handlePasswordChange}
                onSubmit={this.handleSubmit}
                onScan={this.handleScan}
                onRegister = {this.handleScan}
                {...this.props}
            />
        );
    }
}

LoginForm.propTypes = {
    
};

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user)),
    close: () => {
        dispatch(closeLoginForm());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);
