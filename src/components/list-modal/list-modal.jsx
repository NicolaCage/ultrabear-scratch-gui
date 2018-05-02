import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import CloseButton from '../close-button/close-button.jsx';

import styles from './list-modal.css';

const messages = defineMessages({
    title: {
        id: 'gui.importInfo.title',
        defaultMessage: 'View a Scratch 2.0 Project',
        description: 'Scratch 2.0 import modal label - for accessibility'
    },
    formDescription: {
        defaultMessage:
            'Enter a link to one of your shared Scratch projects. Changes made in this 3.0 Preview will not be saved.',
        description: 'Import project message',
        id: 'gui.importInfo.message'
    },
    invalidFormatError: {
        id: 'gui.importInfo.invalidFormatError',
        defaultMessage: 'Uh oh, that project link or id doesn\'t look quite right.',
        description: 'Invalid project link or id message'
    }
});

const ImportModal = ({intl, ...props}) => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel={intl.formatMessage({...messages.title})}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onCancel}
    >
    <button onClick={e=>{
        this.props.onCancel()
    }}>
    tuichu</button>
    <Box className={styles.body}>
        <Box className={styles.faqLinkText}>
            <FormattedMessage
                defaultMessage="To learn more, go to the {previewFaqLink}."
                description="Invitation to try 3.0 preview"
                id="gui.importInfo.previewfaq"
                values={{
                    previewFaqLink: (
                        <a
                            className={styles.faqLink}
                            href="//scratch.mit.edu/preview-faq"
                        >
                            <FormattedMessage
                                defaultMessage="Preview FAQ"
                                description="link to Scratch 3.0 preview FAQ page"
                                id="gui.importInfo.previewfaqlink"
                            />
                        </a>
                    )
                }}
            />
        </Box>
    </Box>
    </ReactModal>
);

ImportModal.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    hasValidationError: PropTypes.bool.isRequired,
    inputValue: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onViewProject: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

export default injectIntl(ImportModal);
