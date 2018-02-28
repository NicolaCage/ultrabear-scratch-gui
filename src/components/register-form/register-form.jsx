import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import {closeRegisterForm} from '../../reducers/modals';

import styles from './register-form.css';

const askBeforeClose = function(closeFunc) {
    return function() {
        if (confirm("确定要终止么？")) closeFunc();
    }
}

const RegisterFormComponent = props => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        onRequestClose={askBeforeClose(props.close)}
    >
        <Box className={styles.body}>
            <h2>请输入用户信息，进行注册</h2>
            <div className={styles.section}>
                <label>手机号</label>
                <input
                    autoFocus
                    type="text"
                    onChange={props.onIdChange}
                />
            </div>
            <div className={styles.section}>
                <label>密码</label>
                <input
                    type="password"
                    onChange={props.onPasswordChange}
                />
            </div>
            <div className={styles.section}>
                <label>再次输入密码</label>
                <input
                    type="password"
                    onChange={props.onPasswordAgainChange}
                />
            </div>
            <div className={styles.section}>
                <label>姓名</label>
                <input
                    type="text"
                    onChange={props.onNameChange}
                />
            </div>
            <a className={styles.submitbutton}
                onClick={props.onRegister}
            > 确定</a>
        </Box>
    </ReactModal>
);

RegisterFormComponent.propTypes = {
    close: PropTypes.func.isRequired,
    onIdChange: PropTypes.func,
    onPasswordChange: PropTypes.func,
    onPasswordAgainChange: PropTypes.func,
    onNameChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onScan: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    close: () => {
        dispatch(closeRegisterForm());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterFormComponent);