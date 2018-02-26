const initialState = {
    user: null
};

const SETUP_USER = 'scratch-gui/user/SETUP_USER';
const UNSET_USER = 'scratch-gui/user/UNSET_USER';

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SETUP_USER:
        debugger
        return {
            user: action.user
        };
    case SETUP_USER:
        return {
            user: null
        };
    default:
        return state;
    }
};

const setUser = function (userInfo) {
    return {
        type: SETUP_USER,
        user: {
            id: userInfo.id,
            permission: userInfo.permission,
            name: userInfo.name,
            openId: userInfo.openId,
            unionId: userInfo.unionId,
            jwt: userInfo.jwt
        }
    };
};

const unsetUser = function () {
    return {
        type: SETUP_USER
    };
};

export {
    reducer as default,
    setUser,
    unsetUser
};
