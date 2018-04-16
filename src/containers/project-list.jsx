import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';
import md5 from 'md5'

import ProjectListComponent from '../components/project-list/project-list.jsx';
import {closeProjectList} from '../reducers/modals';
import {setProject} from '../reducers/project';
import { ASSETS_ROOT } from '../api-config';


class ProjectList extends React.Component {
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
        console.log("loading project: " +projectId);
        if (!projectId || projectId.length == 0) return;
        xhr({
            method: "GET",
            url: ASSETS_ROOT + "/projects/" + projectId,
        }, (err, response, body) => {
            body = JSON.parse(body);
            if (!err && body.data && body.data.data) {
                this.props.loadProject(body.data.data);
                console.log("project loaded");
                this.props.setProject({
                    id: body.data.id,
                    name: body.data.name,
                    owner: body.data.owner,
                    hash: body.data.hash,
                });
                this.props.close();
            }
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
            <ProjectListComponent
                onProjectChoose={this.chooseProject}
                projectList={this.state.projectList}
                {...this.props}
            />
        );
    }
}

ProjectList.propTypes = {
    
};

const mapStateToProps = state => ({
    user: state.user,
    loadProject: state.vm.fromJSON.bind(state.vm)
});

const mapDispatchToProps = dispatch => ({
    setProject: (project) => dispatch(setProject(project)),
    close: () => {
        dispatch(closeProjectList());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectList);
