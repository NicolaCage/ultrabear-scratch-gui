import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';
import md5 from 'md5'
import jwtDecode from 'jwt-decode';

import LoginFormComponent from '../components/login-form/login-form.jsx';

import {setUser} from '../reducers/user';
import {closeLoginForm} from '../reducers/modals';

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
            url: "https://www.ultrabear.com.cn/auth/api/v1.0/login",
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
                alert("login successfully");
                this.props.close();
            }
            else {
                alert("Login fail")
            }
        });
    }
    handleScan() {
        debugger
    }
    render () {
        return (
            <LoginFormComponent
                onUserNameChange={this.handleUserNameChange}
                onPasswordChange={this.handlePasswordChange}
                onSubmit={this.handleSubmit}
                onScan={this.handleScan}
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
