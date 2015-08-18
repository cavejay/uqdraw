let keyMirror = require('keymirror');
//var BASE_URL = 'http://localhost:3001/';
// export default {
//   BASE_URL: BASE_URL,
//   LOGIN_URL: BASE_URL + 'sessions/create',
//   SIGNUP_URL: BASE_URL + 'users',
//   LOGIN_USER: 'LOGIN_USER',
//   LOGOUT_USER: 'LOGOUT_USER'
// }

export default {
    ActionTypes: keyMirror({
            LOGIN_CREATE_INITIATED: null,
            LOGIN_CREATE_SUCCESS: null,
            LOGIN_CREATE_FAIL: null,
            LOGIN_UPDATE_INITIATED: null,
            LOGIN_UPDATE_SUCCESS: null,
            LOGIN_UPDATE_FAIL: null,
            LOGIN_USER: 'LOGIN_USER',
  			LOGOUT_USER: 'LOGOUT_USER',
    }),
};
