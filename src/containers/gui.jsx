import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {openExtensionLibrary} from '../reducers/modals.js';

import vmListenerHOC from '../lib/vm-listener-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';

import { AUTH_ROOT } from '../api-config';
import xhr from 'xhr';
import jwtDecode from 'jwt-decode';
import {setUser, unsetUser} from '../reducers/user';
import {openRegisterForm} from '../reducers/modals';
import cookie from 'react-cookies';

import protocol from '../lib/websocket-protocol';

const loginValidSeconds = 60*60;

class GUI extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTabSelect',
            'checkAuth',
            'handleWSOpen',
            'handleWSClose',
            'handleWSData',
            'sendWSPacket',
        ]);
        this.state = {
            tabIndex: 0,
            socket: null
        };
    }
    
    checkAuth() {
        let jwt = cookie.load('jwt');
        if (!jwt) {
            this.props.onUnSetUser();
            console.log("continu as guest");
            return false;
        }
        var decoded = jwtDecode(jwt);
        console.log("login successfully as " + decoded.name);
        this.props.onSetUser({
            id: decoded.id,
            permission: decoded.permission,
            name: decoded.name,
            openId: decoded.openId,
            unionId: decoded.unionId,
            jwt: jwt
        });
        return true;
    }

    handleWSOpen () {
        alert("opened");
    }

    handleWSClose () {
        alert("closed");
    }

    handleWSData (msg) {
        let decoded = JSON.parse(msg.data);
        if(decoded.type === protocol.MSG_REQUEST_PROJECT_SB3) {
            let getSb3 = this.props.vm.saveProjectSb3.bind(this.props.vm);
            let sb3 = getSb3();
            this.sendWSPacket(protocol.MSG_RESPONSE_PROJECT_SB3, sb3);
        }
        else if(decoded.type === protocol.MSG_STATUS_CHECK) {
            this.sendWSPacket(protocol.MSG_ALIVE, null);
        }
    }

    sendWSPacket (type, data) {
        let msg = JSON.stringify({
            type: type,
            data: data
        })
        this.state.socket.send(msg)
    }

    componentDidMount () {
        let self = this;
        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
        this.props.vm.loadProject(this.props.projectData);
        this.props.vm.setCompatibilityMode(true);
        this.props.vm.start();

        // Deal with Websocket
        let uid = prompt("user id");
        let socket = new WebSocket('ws://localhost:8600/connect/' + uid);
        socket.onopen = () => this.handleWSOpen();
        socket.onmessage = (m) => this.handleWSData(m);
        socket.onclose = () => this.handleWSClose();
        this.setState({
            socket: socket
        });

        // Deal with Wechat Redirect
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        let code = getParameterByName('code');
        let state = getParameterByName('state');

        if (code) {
            xhr({
                method: "POST",
                url: AUTH_ROOT + '/wechat/coding',
                body: JSON.stringify({
                    code: code
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            }, (err, response, body) => {
                body = JSON.parse(body);
                if (!err && body.code == 0 && body.data) {
                    let jwt = body.data;
                    var decoded = jwtDecode(jwt);
                    if (body.msg.includes("id")) {
                    // if (true) {
                        // need set up id
                        console.log(body.msg);

                        self.props.onSetUser({
                            id: null,
                            permission: null,
                            name: null,
                            openId: decoded.openId,
                            unionId: decoded.unionId,
                            jwt: jwt
                        });

                        self.props.onOpenRegisterForm();
                    }
                    else {
                        cookie.save('userId', decoded.id, { path: '/', maxAge: loginValidSeconds });
                        cookie.save('userName', decoded.name, { path: '/', maxAge: loginValidSeconds });
                        cookie.save('permission', decoded.permission, { path: '/', maxAge: loginValidSeconds });
                        cookie.save('jwt', jwt, { path: '/', maxAge: loginValidSeconds });
                        
                        window.location = "/";
                    }
                }
                else {
                    alert("验证失败");
                }
            });
        }
        else {
            let loggedin = this.checkAuth();
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.projectData !== nextProps.projectData) {
            this.props.vm.loadProject(nextProps.projectData);
        }
    }
    componentWillUnmount () {
        this.props.vm.stopAll();
    }
    handleTabSelect (tabIndex) {
        this.setState({tabIndex});
    }

    render () {
        const {
            children,
            projectData, // eslint-disable-line no-unused-vars
            vm,
            onSetUser,
            onUnSetUser,
            onOpenRegisterForm,
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                enableExtensions={window.location.search.includes('extensions')}
                tabIndex={this.state.tabIndex}
                vm={vm}
                onTabSelect={this.handleTabSelect}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    ...GUIComponent.propTypes,
    feedbackFormVisible: PropTypes.bool,
    loginFormVisible: PropTypes.bool,
    projectListVisible: PropTypes.bool,
    registerFormVisible: PropTypes.bool,
    previewInfoVisible: PropTypes.bool,
    assignProjectVisible: PropTypes.bool,
    projectData: PropTypes.string,
    vm: PropTypes.instanceOf(VM),
};

GUI.defaultProps = GUIComponent.defaultProps;

const mapStateToProps = state => ({
    feedbackFormVisible: state.modals.feedbackForm,
    loginFormVisible: state.modals.loginForm,
    projectListVisible: state.modals.projectList,
    registerFormVisible: state.modals.registerForm,
    previewInfoVisible: state.modals.previewInfo,
    assignProjectVisible: state.modals.assignProject,
});

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onSetUser: (user) => dispatch(setUser(user)),
    onUnSetUser: () => dispatch(unsetUser()),
    onOpenRegisterForm: ()=>dispatch(openRegisterForm()),
});

const ConnectedGUI = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI);

export default vmListenerHOC(ConnectedGUI);
