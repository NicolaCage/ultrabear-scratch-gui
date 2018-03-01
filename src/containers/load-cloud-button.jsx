import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';

import ButtonComponent from '../components/button/button.jsx';
import {setProject} from '../reducers/project';
import { ASSETS_ROOT } from '../api-config';

class LoadCloudButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
    }

    handleClick () {
        let projectId = prompt("Please enter project ID :");
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
            }
        });
    }

    render () {
        const {
            loadProject, // eslint-disable-line no-unused-vars
            setProject,
            ...props
        } = this.props;
        return (
            <ButtonComponent
                onClick={this.handleClick}
                {...props}
            >
                Load from Cloud
            </ButtonComponent>
        );
    }
}

LoadCloudButton.propTypes = {
    loadProject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    loadProject: state.vm.fromJSON.bind(state.vm)
});

const mapDispatchToProps = dispatch => ({
    setProject: (project) => dispatch(setProject(project)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoadCloudButton);
