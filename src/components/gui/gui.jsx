import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import MediaQuery from 'react-responsive';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import FeedbackForm from '../feedback-form/feedback-form.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import PreviewModal from '../../containers/preview-modal.jsx';
import ImportModal from '../../containers/import-modal.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import layout from '../../lib/layout-constants.js';
import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';
import LoginForm from '../../containers/login-form.jsx';
import ListModal from '../../containers/list-modal.jsx';
import RegisterForm from '../../containers/register-form.jsx';
import ProjectList from '../../containers/project-list.jsx';

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

// Cache this value to only retreive it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        activeTabIndex,
        basePath,
        blocksTabVisible,
        children,
        costumesTabVisible,
        feedbackFormVisible,
        importInfoVisible,
        intl,
        loading,
        onExtensionButtonClick,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        previewInfoVisible,
        loginFormVisible,
        listModalVisible,
        registerFormVisible,
        projectListVisible,
        soundsTabVisible,
        vm,
        ...componentProps
    } = props;
    if (children) {
        return (
            <Box {...componentProps}>
                {children}
            </Box>
        );
    }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return (
        <Box
            className={styles.pageWrapper}
            {...componentProps}
        >
            {previewInfoVisible ? (
                <PreviewModal />
            ) : null}
            {listModalVisible ? (
                <ListModal />
            ) : null}
            {loading ? (
                <Loader />
            ) : null}
            {importInfoVisible ? (
                <ImportModal />
            ) : null}
            {feedbackFormVisible ? (
                <FeedbackForm />
            ) : null}
            {loginFormVisible ? (
                <LoginForm />
            ) : null}
            {registerFormVisible ? (
                <RegisterForm />
            ) : null}
            {projectListVisible ? (
                <ProjectList />
            ) : null}
            {isRendererSupported ? null : (
                <WebGlModal />
            )}
            <MenuBar />
            <Box className={styles.bodyWrapper}>
                <Box className={styles.flexWrapper}>
                    <Box className={styles.stageAndTargetWrapper}>
                        <Box className={styles.stageMenuWrapper}>
                            <StageHeader vm={vm} />
                        </Box>
                        <Box className={styles.stageWrapper}>
                            {/* eslint-disable arrow-body-style */}
                            <MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
                                return isRendererSupported ? (
                                    <Stage
                                        id='stage'
                                        height={isFullSize ? layout.fullStageHeight : layout.smallerStageHeight}
                                        shrink={0}
                                        vm={vm}
                                        width={isFullSize ? layout.fullStageWidth : layout.smallerStageWidth}
                                    />
                                ) : null;
                            }}</MediaQuery>
                            {/* eslint-enable arrow-body-style */}
                        </Box>
                        <Box className={styles.targetWrapper}>
                            <TargetPane
                                vm={vm}
                            />
                        </Box>
                    </Box>

                    <Box className={styles.editorWrapper}>
                        <Tabs
                            className={tabClassNames.tabs}
                            forceRenderTabPanel={true} // eslint-disable-line react/jsx-boolean-value
                            selectedIndex={activeTabIndex}
                            selectedTabClassName={tabClassNames.tabSelected}
                            selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                            onSelect={onActivateTab}
                        >
                            <TabList className={tabClassNames.tabList}>
                                <Tab className={tabClassNames.tab}>
                                    <img
                                        draggable={false}
                                        src={codeIcon}
                                    />
                                    <FormattedMessage
                                        defaultMessage="脚本"
                                        description="Button to get to the code panel"
                                        id="gui.gui.codeTab"
                                    />
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateCostumesTab}
                                >
                                    <img
                                        draggable={false}
                                        src={costumesIcon}
                                    />
                                    <FormattedMessage
                                        defaultMessage="造型"
                                        description="Button to get to the costumes panel"
                                        id="gui.gui.costumesTab"
                                    />
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateSoundsTab}
                                >
                                    <img
                                        draggable={false}
                                        src={soundsIcon}
                                    />
                                    <FormattedMessage
                                        defaultMessage="声音"
                                        description="Button to get to the sounds panel"
                                        id="gui.gui.soundsTab"
                                    />
                                </Tab>
                            </TabList>
                            <TabPanel className={tabClassNames.tabPanel}>
                                <Box className={styles.blocksWrapper}>
                                    <Blocks
                                        grow={1}
                                        isVisible={blocksTabVisible}
                                        options={{
                                            media: `${basePath}static/blocks-media/`
                                        }}
                                        vm={vm}
                                    />
                                </Box>
                                <Box className={styles.extensionButtonContainer}>
                                    <button
                                        className={styles.extensionButton}
                                        title={intl.formatMessage(messages.addExtension)}
                                        onClick={onExtensionButtonClick}
                                    >
                                        <img
                                            className={styles.extensionButtonIcon}
                                            draggable={false}
                                            src={addExtensionIcon}
                                        />
                                    </button>
                                </Box>
                            </TabPanel>
                            <TabPanel className={tabClassNames.tabPanel}>
                                {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                            </TabPanel>
                            <TabPanel className={tabClassNames.tabPanel}>
                                {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                            </TabPanel>
                        </Tabs>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
GUIComponent.propTypes = {
    activeTabIndex: PropTypes.number,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    children: PropTypes.node,
    costumesTabVisible: PropTypes.bool,
    feedbackFormVisible: PropTypes.bool,
    importInfoVisible: PropTypes.bool,
    intl: intlShape.isRequired,
    loading: PropTypes.bool,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onTabSelect: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    loginFormVisible: PropTypes.bool,
    listModalVisible:PropTypes.bool,
    registerFormVisible: PropTypes.bool,
    projectListVisible: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    basePath: './'
};
export default injectIntl(GUIComponent);
