import analytics from '../lib/analytics';

const OPEN_MODAL = 'scratch-gui/modals/OPEN_MODAL';
const CLOSE_MODAL = 'scratch-gui/modals/CLOSE_MODAL';

const MODAL_BACKDROP_LIBRARY = 'backdropLibrary';
const MODAL_COSTUME_LIBRARY = 'costumeLibrary';
const MODAL_EXTENSION_LIBRARY = 'extensionLibrary';
const MODAL_FEEDBACK_FORM = 'feedbackForm';
const MODAL_LOGIN_FORM = 'loginForm';
const MODAL_PROJECTS_LIST = 'projectsList';
const MODAL_UPLOAD_COSTUME='uploadcostume'
const MODAL_REGISTER_FORM = 'registerForm';
const MODAL_PROJECT_LIST = 'projectList';
const MODAL_IMPORT_INFO = 'importInfo';
const MODAL_LOADING_PROJECT = 'loadingProject';
const MODAL_PREVIEW_INFO = 'previewInfo';
const MODAL_SOUND_LIBRARY = 'soundLibrary';
const MODAL_SPRITE_LIBRARY = 'spriteLibrary';
const MODAL_SOUND_RECORDER = 'soundRecorder';


const initialState = {
    [MODAL_BACKDROP_LIBRARY]: false,
    [MODAL_COSTUME_LIBRARY]: false,
    [MODAL_EXTENSION_LIBRARY]: false,
    [MODAL_FEEDBACK_FORM]: false,
    [MODAL_LOGIN_FORM]: false,
    [MODAL_PROJECTS_LIST]:false,
    [MODAL_REGISTER_FORM]: false,
    [MODAL_PROJECT_LIST]: false,
    [MODAL_UPLOAD_COSTUME]: false,
    [MODAL_IMPORT_INFO]: false,
    [MODAL_LOADING_PROJECT]: false,
    [MODAL_PREVIEW_INFO]: false,
    [MODAL_SOUND_LIBRARY]: false,
    [MODAL_SPRITE_LIBRARY]: false,
    [MODAL_SOUND_RECORDER]: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case OPEN_MODAL:
        return Object.assign({}, state, {
            [action.modal]: true
        });
    case CLOSE_MODAL:
        return Object.assign({}, state, {
            [action.modal]: false
        });
    default:
        return state;
    }
};
const openModal = function (modal) {
    return {
        type: OPEN_MODAL,
        modal: modal
    };
};
const closeModal = function (modal) {
    return {
        type: CLOSE_MODAL,
        modal: modal
    };
};
//open

const openProjectsList = function () {
    return openModal(MODAL_PROJECTS_LIST);
};
const openUploadCostume = function () {
    return openModal(MODAL_UPLOAD_COSTUME);
};
const openBackdropLibrary = function () {
    analytics.pageview('/libraries/backdrops');
    return openModal(MODAL_BACKDROP_LIBRARY);
};
const openCostumeLibrary = function () {
    analytics.pageview('/libraries/costumes');
    return openModal(MODAL_COSTUME_LIBRARY);
};
const openExtensionLibrary = function () {
    analytics.pageview('/libraries/extensions');
    return openModal(MODAL_EXTENSION_LIBRARY);
};
const openFeedbackForm = function () {
    analytics.pageview('/modals/feedback');
    return openModal(MODAL_FEEDBACK_FORM);
};
const openLoginForm = function () {
    analytics.pageview('/modals/login');
    return openModal(MODAL_LOGIN_FORM);
};
const openRegisterForm = function () {
    analytics.pageview('/modals/register');
    return openModal(MODAL_REGISTER_FORM);
};
const openProjectList = function () {
    analytics.pageview('/modals/projectlist');
    return openModal(MODAL_PROJECT_LIST);
};
const openImportInfo = function () {
    analytics.pageview('modals/import');
    return openModal(MODAL_IMPORT_INFO);
};
const openLoadingProject = function () {
    analytics.pageview('modals/loading');
    return openModal(MODAL_LOADING_PROJECT);
};
const openPreviewInfo = function () {
    analytics.pageview('/modals/preview');
    return openModal(MODAL_PREVIEW_INFO);
};
const openSoundLibrary = function () {
    analytics.pageview('/libraries/sounds');
    return openModal(MODAL_SOUND_LIBRARY);
};
const openSpriteLibrary = function () {
    analytics.pageview('/libraries/sprites');
    return openModal(MODAL_SPRITE_LIBRARY);
};
const openSoundRecorder = function () {
    analytics.pageview('/modals/microphone');
    return openModal(MODAL_SOUND_RECORDER);
};
const closeBackdropLibrary = function () {
    return closeModal(MODAL_BACKDROP_LIBRARY);
};
const closeCostumeLibrary = function () {
    return closeModal(MODAL_COSTUME_LIBRARY);
};
const closeExtensionLibrary = function () {
    return closeModal(MODAL_EXTENSION_LIBRARY);
};
const closeFeedbackForm = function () {
    return closeModal(MODAL_FEEDBACK_FORM);
};


//close
const closeProjectsList = function () {
    return closeModal(MODAL_PROJECTS_LIST);
};
const closeUploadCostume = function () {
    return closeModal(MODAL_UPLOAD_COSTUME);
};
const closeLoginForm = function () {
    return closeModal(MODAL_LOGIN_FORM);
};
const closeProjectList = function () {
    return closeModal(MODAL_PROJECT_LIST);
};
const closeRegisterForm = function () {
    return closeModal(MODAL_REGISTER_FORM);
};
const closeImportInfo = function () {
    return closeModal(MODAL_IMPORT_INFO);
};
const closeLoadingProject = function () {
    return closeModal(MODAL_LOADING_PROJECT);
};
const closePreviewInfo = function () {
    return closeModal(MODAL_PREVIEW_INFO);
};
const closeSpriteLibrary = function () {
    return closeModal(MODAL_SPRITE_LIBRARY);
};
const closeSoundLibrary = function () {
    return closeModal(MODAL_SOUND_LIBRARY);
};
const closeSoundRecorder = function () {
    return closeModal(MODAL_SOUND_RECORDER);
};
export {
    reducer as default,
    openBackdropLibrary,
    openCostumeLibrary,
    openExtensionLibrary,
    openFeedbackForm,
    openLoginForm,
    closeRegisterForm,
    openImportInfo,
    openLoadingProject,
    openPreviewInfo,
    openProjectList,
    openSoundLibrary,
    openSpriteLibrary,
    openSoundRecorder,
    closeBackdropLibrary,
    closeCostumeLibrary,
    closeExtensionLibrary,
    closeFeedbackForm,
    closeLoginForm,
    closeImportInfo,
    closeLoadingProject,
    closePreviewInfo,
    closeProjectList,
    closeSpriteLibrary,
    closeSoundLibrary,
    closeSoundRecorder,
    openProjectsList,
    closeProjectsList,
    openUploadCostume,
    closeUploadCostume
};
