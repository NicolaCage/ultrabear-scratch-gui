import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import LoginFormComponent from '../components/login-form/login-form.jsx';
import ReactModal from 'react-modal';
import {setUser} from '../reducers/user';
import {closeLoginForm} from '../reducers/modals';
import { AUTH_ROOT, URL, USER_INFO_API_URL } from '../api-config';
import axios from 'axios';

const loginValidSeconds = 60*60;

class LoginForm extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleLogin',
        ]);
    }
    
    handleLogin(datas){
        axios.post(URL + '/auth/api/v1.0/login', datas)
        .then(response => {
            if (response.data.code==0) {
                let jwt = response.data.data;
                const config = {
                    headers: {
                        'jwt': jwt
                    }
                }
                axios.get(USER_INFO_API_URL, config)
                .then( res => {
                    if (res.data.code==0) {
                        let user = res.data.data;
                        user.jwt = jwt;
                        this.props.setUser(user);
                        this.props.close();
                    }
                })
            }
            else {
                alert('登录失败');
            }
        })
        .catch((error)=>{
           console.log(error)
        });
    }

    render () {
        return (
            <LoginFormComponent
                onLogin={this.handleLogin}
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
