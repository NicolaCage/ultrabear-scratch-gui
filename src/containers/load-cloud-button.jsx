import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';

import ButtonComponent from '../components/button/button.jsx';

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
            url: "https://assets.ultrabear.com.cn/projects/" + projectId,
        }, (err, response, body) => {
            body = JSON.parse(body);
            if (!err && body.data && body.data.data) {
                debugger
                this.props.loadProject(body.data.data);
                console.log("project loaded");
            }
        });
    }

    render () {
        const {
            loadProject, // eslint-disable-line no-unused-vars
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

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(LoadCloudButton);
