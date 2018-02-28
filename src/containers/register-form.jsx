import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';
import md5 from 'md5'
import jwtDecode from 'jwt-decode';

import RegisterFormComponent from '../components/register-form/register-form.jsx';

import {closeRegisterForm} from '../reducers/modals';
import {setUser, unsetUser} from '../reducers/user';
import { AUTH_ROOT } from '../api-config';
import cookie from 'react-cookies';

class RegisterForm extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSubmit',
            'handleIdChange',
            'handlePasswordChange',
            'handlePasswordAgainChange',
            'handleNameChange'
        ]);
        this.state = {
            id: "",
            password: "",
            name: "",
        };
    }
    handleIdChange (e) {
        var value = e.target.value;
        this.setState({id: value});
    }
    handlePasswordChange (e) {
        var value = e.target.value;
        this.setState({password: value});
    }
    handlePasswordAgainChange (e) {
        var value = e.target.value;
        this.setState({password2: value});
    }
    handleNameChange(e) {
        var value = e.target.value;
        this.setState({name: value});
    }
    handleSubmit () {
        if (this.state.password != this.state.password2) {
            alert("两次输入密码不一致");
            return;
        }
        if (!this.state.id || this.state.id.length == 0 || !this.state.password || this.state.password.length == 0) {
            return;
        }

        var payload = JSON.stringify({
            "id": this.state.id,
            "pwd": md5(this.state.password),
            "name": this.name
        });
        xhr({
            method: "POST",
            url: AUTH_ROOT + '/adduserid',
            body: payload,
            headers: {
                "Content-Type": "application/json"
            },
        }, (err, response, body) => {
            body = JSON.parse(body);
            if (!err && body.data) {
                let jwt = body.data;
                var decoded = jwtDecode(jwt);
                this.props.setUser({
                    id: decoded.id,
                    permission: decoded.permission,
                    name: decoded.name,
                    openId: decoded.openId,
                    unionId: decoded.unionId,
                    jwt: jwt
                });
                cookie.save('userId', decoded.id, { path: '/', maxAge: loginValidSeconds });
                cookie.save('userName', decoded.name, { path: '/', maxAge: loginValidSeconds });
                cookie.save('permission', decoded.permission, { path: '/', maxAge: loginValidSeconds });
                cookie.save('jwt', jwt, { path: '/', maxAge: loginValidSeconds });
                alert("注册成功");
                this.props.close();
            }
            else {
                //TODO: show why it failed
                alert("注册失败");
            }
        });
    }

    render () {
        return (
            <RegisterFormComponent
                onIdChange={this.handleIdChange}
                onPasswordChange={this.handlePasswordChange}
                onPasswordAgainChange = {this.handlePasswordAgainChange}
                onNameChange={this.handleNameChange}
                onRegister={this.handleSubmit}
                onScan={this.handleScan}
                {...this.props}
            />
        );
    }
}

RegisterForm.propTypes = {
    
};

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user)),
    unsetUser: (user) => dispatch(unsetUser(user)),
    close: () => {
        dispatch(closeRegisterForm());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterForm);
