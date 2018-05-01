const initialState = {
    id: "",
    name: "new project",
    unionid: "",
    hash: "",
    teacher: "",
    isStudentRealtime: false,
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
            unionid: projectInfo.unionid,
            hash: projectInfo.hash,
            teacher: projectInfo.teacher,
            isStudentRealtime: projectInfo.isStudentRealtime == undefined? false: projectInfo.isStudentRealtime,
        }
    };
};

export {
    reducer as default,
    setProject,
};
