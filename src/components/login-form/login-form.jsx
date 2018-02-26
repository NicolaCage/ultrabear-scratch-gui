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
                    placeholder="username"
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
                onClick={props.onScan}
            > 微信扫码 </button>
            <button className={styles.submitbutton}
                onClick={props.onSubmit}
            > 登录 </button>
        </Box>
    </ReactModal>
);

LoginFormComponent.propTypes = {
    close: PropTypes.func.isRequired,
    onUserNameChange: PropTypes.func,
    onPasswordChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onScan: PropTypes.func,
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