import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import {openExtensionLibrary} from '../reducers/modals';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import vmListenerHOC from '../lib/vm-listener-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';

import { AUTH_ROOT } from '../api-config';
import xhr from 'xhr';
import {setUser, unsetUser} from '../reducers/user';
import {openRegisterForm} from '../reducers/modals';
import bindAll from 'lodash.bindall';
const loginValidSeconds = 60*60;

class GUI extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'checkAuth'
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
            xhr({
                method: "POST",
                url: AUTH_ROOT + '/wechat',
                body: JSON.stringify({
                    code: code
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            }, (err, response, body) => {
                // body = JSON.parse(body);
                // if (!err && body.code == 0 && body.data) {
                //     let jwt = body.data;
                //     var decoded = jwtDecode(jwt);
                //     // if (body.msg.includes("id")) {
                //     if (true) {
                //         // need set up id
                //         console.log(body.msg);

                //         self.props.onSetUser({
                //             id: null,
                //             permission: null,
                //             name: null,
                //             openId: decoded.openId,
                //             unionId: decoded.unionId,
                //             jwt: jwt
                //         });

                //         self.props.onOpenRegisterForm();
                //     }
                //     else {
                //         cookie.save('userId', decoded.id, { path: '/', maxAge: loginValidSeconds });
                //         cookie.save('userName', decoded.name, { path: '/', maxAge: loginValidSeconds });
                //         cookie.save('permission', decoded.permission, { path: '/', maxAge: loginValidSeconds });
                //         cookie.save('jwt', jwt, { path: '/', maxAge: loginValidSeconds });
                        
                //         window.location = "/";
                //     }
                // }
                // else {
                //     alert("验证失败");
                // }
            });
        }
        else {
            let loggedin = this.checkAuth();
        }
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
    registerFormVisible: PropTypes.bool,
    projectListVisible: PropTypes.bool,
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
    projectListVisible: state.modals.projectList,
    soundsTabVisible: state.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
    user: state.user,
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
