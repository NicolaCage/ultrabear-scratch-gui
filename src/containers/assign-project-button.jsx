import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';

import ButtonComponent from '../components/button/button.jsx';

import {openAssignProjectWindow} from '../reducers/modals'

class AssginProjectButton extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const {
            onClicked,
            ...props
        } = this.props;
        return (
            <ButtonComponent
                onClick={this.props.onClicked}
                {...props}
            >
                分配课件
            </ButtonComponent>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onClicked: () => {
        dispatch(openAssignProjectWindow());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AssginProjectButton);
