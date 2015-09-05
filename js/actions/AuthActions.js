let API = require('../utils/API').default;
import Dispatcher from '../dispatcher/Dispatcher.js';
import LoginConstants from '../constants/LoginConstants.js';
let ActionTypes = LoginConstants.ActionTypes;

let AuthActions = {
  // Checks if user is in the system
  login: (username, password) => {
    if (!username || !password) return;
    let ref = API.login(username, password, (error) => {
        if (error == 1) {
          Dispatcher.dispatch({
              type: ActionTypes.LOGIN_NOUSER,
              user: username,
              password: password,
          });
        } else if (error == 2) {
          Dispatcher.dispatch({
              type: ActionTypes.LOGIN_BADPASSWORD,
              user: username,
              password: password,
          });
        } else if (error) {
          Dispatcher.dispatch({
              type: ActionTypes.LOGIN_FAIL,
              user: username,
              password: password,
          });
        } else {
            Dispatcher.dispatch({
                type: ActionTypes.LOGIN_SUCCESS,
                user: username,
                password: password,
            });
        }
    });
    Dispatcher.dispatch({
        type: ActionTypes.LOGIN_INITIATED,
        user: username,
        password: password,
    });
  }
,
  // creates an entry for username w/ a password of password.
  // Returns 0 if the user already exists
  create: (username, password) => {
    return 0;
  },
}

export default AuthActions;
