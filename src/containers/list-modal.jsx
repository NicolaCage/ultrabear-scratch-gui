import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ListModalComponent from '../components/list-modal/list-modal.jsx';
import ReactModal from 'react-modal';
import {setUser} from '../reducers/user';
import {closeLoginForm} from '../reducers/modals';
import {closeProjectsList, openProjectList,openProjectsList} from '../reducers/modals'
import {setProject} from '../reducers/project';
import { AUTH_ROOT, ASSETS_ROOT, USER_INFO_API_URL ,SCRATCH_SERVER_BASE} from '../api-config';
import axios from 'axios';

const loginValidSeconds = 60*60;

class ListModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'InProject',
            'GetDetail'
        ]);
        this.state={
            list:[],
            detailjson:{}
        }
    }
    componentWillMount(){
        axios.get(ASSETS_ROOT+'/projects')
        .then( res => {
            if (res.data.code==0) {
                this.setState({
                    list: res.data.data
                })
            }
        }).catch(err => {
            　　alert(err);
        });
    }
    GetDetail(id){
        console.log(id)
        axios.get(ASSETS_ROOT+'/projects/'+id)
        .then( res => {
            if (res.data.code==0) {
                this.setState({
                    detailjson: res.data.data
                })
            }
        }).catch(err => {
            　　alert(err);
        });
    }
    InProject(id){
       this.fetchStudentRealtimeWorkSpace(id)
    }
    fetchStudentRealtimeWorkSpace(projectId) {
        let config = {
            headers:{
                jwt:this.props.user.jwt,
            },
        }
        this.props.openLoadingState();
        axios.get(ASSETS_ROOT + "/projects/" + projectId, config)
        .then((res)=>{
            let data = res.data.data
            let code = res.data.code
            if (code==0){
                this.props.setProject({
                    id: projectId,
                    name: data.name,
                    unionid: data.unionid,
                    hash: data.hash,
                });
                let project = data.data;
                this.props.vm.loadProject(project)
                .then(() => {
                    this.props.closeLoadingState();
                })
                .catch(error => {
                    this.props.closeLoadingState();
                });
            }
            else {
                alert('获取失败');
                this.props.closeLoadingState();
            }
        })
        .catch(error=>{
            alert("网络错误" + error)
        });
    }
    render () {
        return (
            <ListModalComponent
                {...this.props}
                list={this.state.list}
                detailjson={this.state.detailjson}
                detail={this.state.list}
                InProject={this.InProject}
                GetDetail={this.GetDetail}
            />
        );
    }
}

ListModal.propTypes = {
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    }),
     
};

const mapStateToProps = state => ({
    vm: state.vm,
    user: state.user,
    project: state.project,
});

const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user)),
    setProject: (project) => dispatch(setProject(project)),
    closeLoadingState: () => dispatch(closeProjectsList()),
    openLoadingState: () => dispatch(openProjectsList()),
    close: () => {
        dispatch(closeProjectsList());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListModal);
