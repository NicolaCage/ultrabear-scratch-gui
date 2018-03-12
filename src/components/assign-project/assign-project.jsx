import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import {closeAssignProjectWindow} from '../../reducers/modals';

import styles from './assign-project.css';

const AssignProjectComponent = props => {
    const listItems = props.projectList.map((project) =>
        <li key={project.id} onClick={()=>props.onProjectChoose(project.id)}  className={styles.listItem}>
            <span>{project.name}</span>
        </li>
    );

    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
            onRequestClose={props.close}
        >
            <Box className={styles.body}>
                <div>我的作品：</div>
                <ul className={styles.projectList}>
                    {listItems}
                </ul>
            </Box>
        </ReactModal>
    );
};

AssignProjectComponent.propTypes = {
    close: PropTypes.func.isRequired,
    onProjectChoose: PropTypes.func,
    projectList: PropTypes.array,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    close: () => {
        dispatch(closeAssignProjectWindow());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignProjectComponent);