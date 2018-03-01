import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import {closeProjectList} from '../../reducers/modals';

import styles from './project-list.css';

const ProjectListComponent = props => {
    
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

ProjectListComponent.propTypes = {
    close: PropTypes.func.isRequired,
    onProjectChoose: PropTypes.func,
    projectList: PropTypes.array,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    close: () => {
        dispatch(closeProjectList());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectListComponent);