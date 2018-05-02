import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import ButtonComponent from '../components/button/button.jsx';
import { ASSETS_ROOT } from '../api-config';
import {setProject} from '../reducers/project';
import {openLoadingProject, closeLoadingProject, openProjectList} from '../reducers/modals'

class LoadStudentProjButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'fetchStudentRealtimeWorkSpace',
        ]);
        this.state = {
            loadingError: false,
            errorMessage: ''
        };
    }

    handleClick () {
        if(this.props.forRefresh) {
            this.fetchStudentRealtimeWorkSpace(this.props.project.unionid);
        }
        else {
            let unionid = prompt("要查看的学生UnionId");
            if (!unionid) {
                return;
            }
            this.fetchStudentRealtimeWorkSpace(unionid);
        }
    }

    fetchStudentRealtimeWorkSpace(unionid) {
        let config = {
            headers:{
                jwt:this.props.user.jwt,
            },
        }
        this.props.openLoadingState();
        axios.get( SCRATCH_SERVER_BASE + '/live/sb3/' + unionid, config)
        .then((res)=>{
            let data = res.data.data
            let code = res.data.code
            if (code==0){
                this.props.vm.loadProject(data)
                .then(() => {
                    this.props.closeLoadingState();
                    this.props.setProject({
                        id: "",
                        name: "",
                        unionid: unionid,
                        hash: "",
                        teacher: "",
                        isStudentRealtime: true,
                    });
                })
                .catch(error => {
                    this.setState({loadingError: true, errorMessage: error});
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
        if (this.state.loadingError) throw new Error(`Failed to load project: ${this.state.errorMessage}`);
        const {
            loadProject,
            setProject,
            closeLoadingState,
            openLoadingState,
            ...props
        } = this.props;
        return (
            <section
                style= {{cursor: "pointer"}}
                onClick={this.handleClick}
                {...props}
            >
                {this.props.forRefresh ? "刷新学生界面":"获取学生界面"}
            </section>
        );
    }
}

LoadStudentProjButton.propTypes = {
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    }),
    forRefresh: PropTypes.bool,
};

const mapStateToProps = state => ({
    vm: state.vm,
    user: state.user,
    project: state.project,
});

const mapDispatchToProps = dispatch => ({
    setProject: (project) => dispatch(setProject(project)),
    closeLoadingState: () => dispatch(closeLoadingProject()),
    openLoadingState: () => dispatch(openLoadingProject()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoadStudentProjButton);