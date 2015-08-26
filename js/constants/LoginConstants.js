let keyMirror = require('keymirror');

export default {
    ActionTypes: keyMirror({
        LOGIN_CREATE_INITIATED: null,
        LOGIN_CREATE_SUCCESS: null,
        LOGIN_CREATE_FAIL: null,
        LOGIN_INITIATED: null,
        LOGIN_SUCCESS: null,
        LOGIN_FAIL: null,
        LOGIN_BADPASSWORD: null,
        LOGIN_NOUSER: null,
        LOGIN_USER: 'LOGIN_USER',
  			LOGOUT_USER: 'LOGOUT_USER',
    }),
};
