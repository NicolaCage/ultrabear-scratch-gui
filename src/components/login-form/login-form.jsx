import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import {closeLoginForm} from '../../reducers/modals';

import styles from './login-form.css';

const LoginFormComponent = props => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.close}
    >
        <Box className={styles.body}>
            <div className={styles.section}>
                <label>用户名</label>
                <input
                    autoFocus
                    type="text"
                    onChange={props.onUserNameChange}
                />
            </div>
            <div className={styles.section}>
                <label>密码</label>
                <input
                    type="password"
                    onChange={props.onPasswordChange}
                />
            </div>
            <button className={styles.submitbutton}
                onClick={props.onSubmit}
            > 登录 </button>

            <a className={styles.wechatbutton}
                onClick={props.onScan}
            > 微信扫码登录</a>
            
            <a className={styles.registerbutton}
                onClick={props.onRegister}
            > 注册</a>
        </Box>
    </ReactModal>
);

LoginFormComponent.propTypes = {
    close: PropTypes.func.isRequired,
    onUserNameChange: PropTypes.func,
    onPasswordChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onScan: PropTypes.func,
    onRegister: PropTypes.func,
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