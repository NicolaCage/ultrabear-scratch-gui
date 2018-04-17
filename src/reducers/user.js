//判断本地有缓存  user
let initialState =  {}
try { 
    const serializedState = localStorage.getItem('user');
    if (serializedState === null) {
        initialState= {
            jwt: '',
            name: ''
        };
    } else {
        initialState= JSON.parse(serializedState);
    }
} catch (err) {
    // ... 错误处理
    initialState= {
        jwt: '',
        name: ''
    };
}


const SETUP_USER = 'scratch-gui/user/SETUP_USER';
const UNSET_USER = 'scratch-gui/user/UNSET_USER';

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SETUP_USER:
        if (action.user) return action.user;
        else return state;
    case SETUP_USER:
        return null;
    default:
        return state;
    }
};

const setUser = function (userInfo) {
    return {
        type: SETUP_USER,
        user: userInfo
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
