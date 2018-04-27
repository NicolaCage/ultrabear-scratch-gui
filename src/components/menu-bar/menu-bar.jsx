import classNames from 'classnames';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import ProjectLoader from '../../containers/project-loader.jsx';
import Menu from '../../containers/menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';

import {openFeedbackForm} from '../../reducers/modals';
import {
    fileMenuOpen,
    openFileMenu,
    closeFileMenu,

    teacherMenuOpen,
    openTeacherMenu,
    closeTeacherMenu,
    
    openEditMenu,
    closeEditMenu,
    editMenuOpen
} from '../../reducers/menus';

import {openLoginForm} from '../../reducers/modals';

import styles from './menu-bar.css';

import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
import feedbackIcon from './icon--feedback.svg';
import communityIcon from './icon--see-community.svg';
import dropdownCaret from '../language-selector/dropdown-caret.svg';
import scratchLogo from './scratch-logo.svg';

import SaveCloudButton from '../../containers/save-cloud-button.jsx';

const MenuBarItemTooltip = ({
    children,
    className,
    id,
    place = 'bottom'
}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        place={place}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        place="right"
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string
};

const MenuBarMenu = ({
    children,
    onRequestClose,
    open,
    place = 'right'
}) => (
    <Menu
        className={styles.menu}
        open={open}
        place={place}
        onRequestClose={onRequestClose}
    >
        {children}
    </Menu>
);

MenuBarMenu.propTypes = {
    children: PropTypes.node,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool,
    place: PropTypes.oneOf(['left', 'right'])
};

const MenuBar = props => {
    let validUser = !!props.user && !!props.user.id && !!props.user.unionid;
    let isTeacher = props.user.permission && (!!props.user.permission.teacher || !!props.user.permission.superadmin);

    return <Box className={styles.menuBar}>
        <div className={styles.mainMenu}>
            <div className={styles.fileGroup}>
                <div className={classNames(styles.menuBarItem)}>
                    <img
                        alt="Scratch"
                        className={styles.scratchLogo}
                        draggable={false}
                        src={scratchLogo}
                    />
                </div>
                <div className={classNames(styles.menuBarItem, styles.hoverable)}>
                    <MenuBarItemTooltip
                        id="menubar-selector"
                        place="right"
                    >
                        <LanguageSelector />
                    </MenuBarItemTooltip>
                </div>
                <div
                    className={classNames(styles.menuBarItem, styles.hoverable, {
                        [styles.active]: props.fileMenuOpen
                    })}
                    onMouseUp={props.onClickFile}
                >
                    <div className={classNames(styles.fileMenu)}>文件</div>
                    <MenuBarMenu
                        open={props.fileMenuOpen}
                        onRequestClose={props.onRequestCloseFile}
                    >
                        <MenuItemTooltip id="new">
                            <MenuItem>新建项目</MenuItem>
                        </MenuItemTooltip>
                        {validUser ? (
                            <MenuSection>
                                <MenuItem>
                                    <SaveCloudButton className={styles.menuItem} />
                                </MenuItem>
                                <MenuItem>从云端导入</MenuItem>
                            </MenuSection>
                        ) : null}
                        <MenuSection>
                            <ProjectLoader>{(renderFileInput, loadProject, loadProps) => (
                                <MenuItem
                                    onClick={loadProject}
                                    {...loadProps}
                                >
                                    从本地上传
                                    {renderFileInput()}
                                </MenuItem>
                            )}</ProjectLoader>
                            <ProjectSaver>{(saveProject, saveProps) => (
                                <MenuItem
                                    onClick={saveProject}
                                    {...saveProps}
                                >
                                    下载到本地
                                </MenuItem>
                            )}</ProjectSaver>
                        </MenuSection>
                    </MenuBarMenu>
                </div>
                {isTeacher ? (
                    <div
                        className={classNames(styles.menuBarItem, styles.hoverable, {
                            [styles.active]: props.teacherMenuOpen
                        })}
                        onMouseUp={props.onClickTeacherMenu}
                    >
                        <div className={classNames(styles.teacherMenu)}>教师操作</div>
                        <MenuBarMenu
                            open={props.teacherMenuOpen}
                            onRequestClose={props.onRequestCloseTeacherMenu}
                        >
                            <MenuItemTooltip id="new">
                                <MenuItem>新建项目</MenuItem>
                            </MenuItemTooltip>
                            <MenuSection>
                                <MenuItem>获取学生界面</MenuItem>
                                <MenuItem>分发脚本</MenuItem>
                            </MenuSection>
                        </MenuBarMenu>
                    </div>
                ) : null}
                <div
                    className={classNames(styles.menuBarItem, styles.hoverable, {
                        [styles.active]: props.editMenuOpen
                    })}
                    onMouseUp={props.onClickEdit}
                >
                    <div className={classNames(styles.editMenu)}>编辑</div>
                    <MenuBarMenu
                        open={props.editMenuOpen}
                        onRequestClose={props.onRequestCloseEdit}
                    >
                        <MenuItemTooltip id="undo">
                            <MenuItem>Undo</MenuItem>
                        </MenuItemTooltip>
                        <MenuItemTooltip id="redo">
                            <MenuItem>Redo</MenuItem>
                        </MenuItemTooltip>
                        <MenuSection>
                            <MenuItemTooltip id="turbo">
                                <MenuItem>Turbo mode</MenuItem>
                            </MenuItemTooltip>
                        </MenuSection>
                    </MenuBarMenu>
                </div>
            </div>
            <div className={classNames(styles.divider)} />
            {/* <div className={classNames(styles.menuBarItem)}>
                <MenuBarItemTooltip id="title-field">
                    <input
                        disabled
                        className={classNames(styles.titleField)}
                        placeholder="Untitled-1"
                    />
                </MenuBarItemTooltip>
            </div> */}
            {/* <div className={classNames(styles.menuBarItem)}>
                <MenuBarItemTooltip id="share-button">
                    <Button className={classNames(styles.shareButton)}>
                        <FormattedMessage
                            defaultMessage="Share"
                            description="Label for project share button"
                            id="gui.menuBar.share"
                        />
                    </Button>
                </MenuBarItemTooltip>
            </div> */}
            {/* <div className={classNames(styles.menuBarItem, styles.communityButtonWrapper)}>
                <MenuBarItemTooltip id="community-button">
                    <Button
                        className={classNames(styles.communityButton)}
                        iconClassName={styles.communityButtonIcon}
                        iconSrc={communityIcon}
                    >
                        <FormattedMessage
                            defaultMessage="See Community"
                            description="Label for see community button"
                            id="gui.menuBar.seeCommunity"
                        />
                    </Button>
                </MenuBarItemTooltip>
            </div> */}
        </div>
        <div className={styles.accountInfoWrapper}>
            <div className={classNames(styles.menuBarItem, styles.feedbackButtonWrapper)}>
                <Button
                    className={styles.feedbackButton}
                    iconSrc={profileIcon}
                    onClick={props.onLoginClicked}
                >
                    <FormattedMessage
                        defaultMessage="登录"
                        description="Label for login form modal button"
                        id="gui.menuBar.giveFeedback"
                    />
                </Button>
                {validUser ? (
                    <span className={styles.feedbackText}>
                        {"Welcome - " + props.user.name}
                    </span>
                ) : null}
            </div>
            {/* <MenuBarItemTooltip id="mystuff">
                <div
                    className={classNames(
                        styles.menuBarItem,
                        styles.hoverable,
                        styles.mystuffButton
                    )}
                >
                    <img
                        className={styles.mystuffIcon}
                        src={mystuffIcon}
                    />
                </div>
            </MenuBarItemTooltip> */}
            {/* <MenuBarItemTooltip
                id="account-nav"
                place="left"
            >
                <div
                    className={classNames(
                        styles.menuBarItem,
                        styles.hoverable,
                        styles.accountNavMenu
                    )}
                >
                    <img
                        className={styles.profileIcon}
                        src={profileIcon}
                    />
                    <span>scratch-cat</span>
                    <img
                        className={styles.dropdownCaretIcon}
                        src={dropdownCaret}
                    />
                </div>
            </MenuBarItemTooltip> */}
        </div>
    </Box>
};

MenuBar.propTypes = {
    editMenuOpen: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    teacherMenuOpen: PropTypes.bool,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickTeacherMenu: PropTypes.func,
    onGiveFeedback: PropTypes.func.isRequired,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onLoginClicked: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    fileMenuOpen: fileMenuOpen(state),
    teacherMenuOpen: teacherMenuOpen(state),
    editMenuOpen: editMenuOpen(state),
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    onGiveFeedback: () => dispatch(openFeedbackForm()),
    onClickFile: () => dispatch(openFileMenu()),
    onClickTeacherMenu: () => dispatch(openTeacherMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onRequestCloseTeacherMenu: () => dispatch(closeTeacherMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onLoginClicked: () => { dispatch(openLoginForm())},
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);
