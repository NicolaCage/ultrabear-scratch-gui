import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';

import ButtonComponent from '../components/button/button.jsx';
import { ASSETS_ROOT } from '../api-config';

import {openProjectList} from '../reducers/modals'

class LoadCloudButton extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const {
            onLoadCloudClicked,
            ...props
        } = this.props;
        return (
            <ButtonComponent
                onClick={this.props.onLoadCloudClicked}
                {...props}
            >
                导入
            </ButtonComponent>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onLoadCloudClicked: () => {
        dispatch(openProjectList());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoadCloudButton);
