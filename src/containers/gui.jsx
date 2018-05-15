import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import axios from 'axios';
import {openExtensionLibrary} from '../reducers/modals';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import vmListenerHOC from '../lib/vm-listener-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';

import { AUTH_ROOT, USER_INFO_API_URL, WECHAT_SCAN_API_URL, WORKSPACE_SOCKET_URL } from '../api-config';
import xhr from 'xhr';
import {setUser, unsetUser} from '../reducers/user';
import {openRegisterForm} from '../reducers/modals';
import bindAll from 'lodash.bindall';
import protocol from '../lib/websocket-protocol'

const loginValidSeconds = 60*60;

class GUI extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'checkAuth',
            'initialWebsocket',
            'handleWSOpen',
            'handleWSClose',
            'handleWSData',
            'sendWSPacket',
        ]);
        this.state = {
            loading: true,
            loadingError: false,
            errorMessage: ''
        };
    }
    
    checkAuth() {
        let jwt = this.props.user.jwt;
        if (jwt == null || jwt.length == 0) {
            this.props.onUnSetUser();
            console.log("continu as guest");
            return false;
        }
        return true;
    }

    handleWSOpen () {
        // alert("connection opened");
    }

    handleWSClose () {
        alert("connection closed");
    }

    handleWSData (msg) {
        let decoded = JSON.parse(msg.data);
        if(decoded.type === protocol.MSG_REQUEST_PROJECT_SB3) {
            let toJSON = this.props.vm.toJSON.bind(this.props.vm);
            let sb3 = toJSON();
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

    initialWebsocket() {
        // Deal with Websocket
        let uid = this.props.user.unionid;
        if (!uid) {
            return;
        }
        let socket = new WebSocket( WORKSPACE_SOCKET_URL + "/" + uid);
        socket.onopen = () => this.handleWSOpen();
        socket.onmessage = (m) => this.handleWSData(m);
        socket.onclose = () => this.handleWSClose();
        this.setState({
            socket: socket
        });
    }

    componentDidMount () {
        let self = this;
        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
        this.props.vm.loadProject(this.props.projectData)
            .then(() => {
                this.setState({loading: false}, () => {
                    this.props.vm.setCompatibilityMode(true);
                    this.props.vm.start();
                });
            })
            .catch(e => {
                // Need to catch this error and update component state so that
                // error page gets rendered if project failed to load
                this.setState({loadingError: true, errorMessage: e});
            });
        
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
            axios.post( WECHAT_SCAN_API_URL, {
                code: code
            })
            .then( response => {
                if (response.data.code == 0) {
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
                            this.props.onSetUser(user);
                            window.history.pushState({}, document.title, "/");
                        }
                    })
                }
                else {
                    alert("验证失败");
                    console.log(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
                alert("验证失败" + error);
            });
        }

        this.initialWebsocket();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.projectData !== nextProps.projectData) {
            this.setState({loading: true}, () => {
                this.props.vm.loadProject(nextProps.projectData)
                    .then(() => {
                        this.setState({loading: false});
                    })
                    .catch(e => {
                        // Need to catch this error and update component state so that
                        // error page gets rendered if project failed to load
                        this.setState({loadingError: true, errorMessage: e});
                    });
            });
        }
    }

    componentWillUnmount () {
        this.props.vm.stopAll();
    }

    render () {
        if (this.state.loadingError) throw new Error(`Failed to load project: ${this.state.errorMessage}`);
        const {
            children,
            fetchingProject,
            loadingStateVisible,
            projectData, // eslint-disable-line no-unused-vars
            vm,
            onSetUser,
            onUnSetUser,
            onOpenRegisterForm,
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                loading={fetchingProject || this.state.loading || loadingStateVisible}
                vm={vm}
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
    fetchingProject: PropTypes.bool,
    importInfoVisible: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    previewInfoVisible: PropTypes.bool,
    loginFormVisible: PropTypes.bool,
    listModalVisible:PropTypes.bool,
    registerFormVisible: PropTypes.bool,
    projectListVisible: PropTypes.bool,
    uploadcostumeVisible: PropTypes.bool,
    projectData: PropTypes.string,
    vm: PropTypes.instanceOf(VM)
};

GUI.defaultProps = GUIComponent.defaultProps;

const mapStateToProps = state => ({
    activeTabIndex: state.editorTab.activeTabIndex,
    blocksTabVisible: state.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    costumesTabVisible: state.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
    feedbackFormVisible: state.modals.feedbackForm,
    importInfoVisible: state.modals.importInfo,
    loadingStateVisible: state.modals.loadingProject,
    registerFormVisible: state.modals.registerForm,
    previewInfoVisible: state.modals.previewInfo,
    loginFormVisible: state.modals.loginForm,
    listModalVisible: state.modals.projectsList,
    projectListVisible: state.modals.projectList,
    uploadcostumeVisible: state.modals.uploadcostume,
    soundsTabVisible: state.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
    user: state.user,
    vm: state.vm,
});

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: tab => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onSetUser: (user) => dispatch(setUser(user)),
    onUnSetUser: () => dispatch(unsetUser()),
    onOpenRegisterForm: ()=>dispatch(openRegisterForm()),
});

const ConnectedGUI = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI);

export default vmListenerHOC(ConnectedGUI);
