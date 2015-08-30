let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import LoginConstants from '../constants/LoginConstants.js';
let ActionTypes = LoginConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let AuthStore = Object.assign({}, EventEmitter.prototype, {
  router: null,
  emitChange: function() {
      this.emit(CHANGE_EVENT, this.router);
  },
  addChangeListener: function(callback, router) {
      this.router = router;
      this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
  },
});

let dispatcherCallback = function(action) {
  switch(action.type) {
    case ActionTypes.LOGIN_SUCCESS: {
      console.log('PASSWORD_CORRECT');
      AuthStore.emitChange();
      break;
    }

    case ActionTypes.LOGIN_BADPASSWORD: {
      console.log('BAD_PASSWORD');
      break;
    }

    case ActionTypes.LOGIN_NOUSER: {
      console.log('UNKNOWN_USER');
    }

    default:
        //noop
  }
};

AuthStore.dispatchToken = Dispatcher.register(dispatcherCallback);

export default AuthStore;
