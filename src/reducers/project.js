const initialState = {
    id: "",
    name: "new project",
    owner: "",
    hash: "",
    teacher: "",
};

const SETUP_PROJECT = 'scratch-gui/project/SETUP_PROJECT';

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SETUP_PROJECT:
        return action.project;
    default:
        return state;
    }
};

const setProject = function (projectInfo) {
    return {
        type: SETUP_PROJECT,
        project: {
            id: projectInfo.id,
            name: projectInfo.name,
            owner: projectInfo.owner,
            hash: projectInfo.hash,
            teacher: projectInfo.teacher,
        }
    };
};

export {
    reducer as default,
    setProject,
};
