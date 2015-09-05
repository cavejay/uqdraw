let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import ResponseConstants from '../constants/ResponseConstants.js';
let ActionTypes = ResponseConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _isSubmitting = false;
let ResponderStore = Object.assign({}, EventEmitter.prototype, {
    isSubmitting: function() {
        return _isSubmitting;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


let dispatchCallback = function(action) {
    switch(action.type) {
        case ActionTypes.RESPONSE_CREATE_INITIATED: {
            _isSubmitting = true;
            PresentationStore.emitChange();
            break;
        }
        case ActionTypes.RESPONSE_CREATE_SUCCESS: {
            let {lectureKey, questionKey, responseKey, response} = action;
            _isSubmitting = false;
            if (lectureKey && response) {
               _responses[lectureKey] = _responses[lectureKey] || {};
               _responses[lectureKey][questionKey] = _responses[lectureKey][questionKey] || {};
                Object.assign(_responses[lectureKey][questionKey], {[responseKey]: response});
            }
            PresentationStore.emitChange();
            break;
        }
        case ActionTypes.RESPONSE_CREATE_FAIL: {
            _isSubmitting = false;
            PresentationStore.emitChange();
            break;
        }
    }
};

ResponderStore.dispatchToken = Dispatcher.register(dispatchCallback);

export default ResponderStore;
