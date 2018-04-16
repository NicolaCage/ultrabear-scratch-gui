import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';
import md5 from 'md5'
import jwtDecode from 'jwt-decode';
import {setProject} from '../reducers/project';
import AssignProjectComponent from '../components/assign-project/assign-project.jsx';
import { ASSETS_ROOT } from '../api-config';

class AssginProjectWindow extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            "chooseProject"
        ]);
        this.state = {
            projectList: [],
        };
    }

    chooseProject(projectId) {

        let studentId = prompt("请输入学生的用户名:");
        let newProjectId = this.props.user.id + "_" + studentId + "_" + projectId;

        xhr({
            method: "POST",
            url: ASSETS_ROOT + "/projects/"+projectId,
            body: JSON.stringify({
                id: newProjectId,
                name: this.props.project.name,
                owner: studentId
            }),
            headers: {
                "Content-Type": "application/json",
                "jwt": this.props.user.jwt
            }
        }, (err, response, body) => {
            if (!err && body.code == 0) {
                alert("上传成功，项目代码 ：" + newProjectId);
            }
            else alert("失败 " + err);
        });
    }

    componentDidMount () {
        if (!this.props.user) return;
        xhr({
            method: "GET",
            url: ASSETS_ROOT + '/user/' + this.props.user.id + "/projects",
        }, (err, response, body) => {
            body = JSON.parse(body);
            if (!err && body.data && body.code == 0) {
                this.setState({
                    projectList: body.data
                })
            }
            else {
                alert("can not load projects");
            }
        });
    }

    render () {
        return (
            <AssignProjectComponent
                onProjectChoose={this.chooseProject}
                projectList={this.state.projectList}
                {...this.props}
            />
        );
    }
}

AssginProjectWindow.propTypes = {
    
};

const mapStateToProps = state => ({
    user: state.user,
    project: state.project,
});

const mapDispatchToProps = dispatch => ({
    setProject: (project) => dispatch(setProject(project)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssginProjectWindow);
