import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import ButtonComponent from '../components/button/button.jsx';
import { ASSETS_ROOT } from '../api-config';
import {setProject} from '../reducers/project';
import {openLoadingProject, closeLoadingProject, openProjectList} from '../reducers/modals'

class LoadCloudButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
        ]);
        this.state = {
            loadingError: false,
            errorMessage: ''
        };
    }

    handleClick () {
        let projectId = prompt("项目ID：");
        if (!projectId) {
            return;
        }
        
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
            onClick={this.handleClick}
                {...props}
            >
                从云端导入
            </section>
        );
    }
}

LoadCloudButton.propTypes = {
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.vm,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    setProject: (project) => dispatch(setProject(project)),
    closeLoadingState: () => dispatch(closeLoadingProject()),
    openLoadingState: () => dispatch(openLoadingProject()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoadCloudButton);