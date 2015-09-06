let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import ResponseConstants from '../constants/ResponseConstants.js';
let ActionTypes = ResponseConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _isSubmitting = false;
let _questionText = "This is your father speaking?";

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
        case ActionTypes.ACTIVE_QUESTION_CHANGE: {
            _isSubmitting = false;
            ResponseStore.emitChange();
        }
    }
};

ResponderStore.dispatchToken = Dispatcher.register(dispatchCallback);

export default ResponderStore;
