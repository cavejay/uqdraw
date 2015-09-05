let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import ResponseConstants from '../constants/ResponseConstants.js';
let ActionTypes = ResponseConstants.ActionTypes;

let CHANGE_EVENT = 'change';

let _responses = {};
let PresentationStore = Object.assign({}, EventEmitter.prototype, {
    getResponses: function(lectureKey) {
        return _responses[lectureKey];
    },

    getResponsesForQuestion: function(lectureKey, questionKey) {
        if (!_responses[lectureKey]) return;
        return _responses[lectureKey][questionKey];
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
        case ActionTypes.RESPONSES_UPDATE_SUCCESS: {
            let {lectureKey, responses} = action;
            if (lectureKey && responses) {
                _responses[lectureKey] = _responses[lectureKey] || {};
                Object.assign(_responses[lectureKey], responses);
                PresentationStore.emitChange();
            }
            break;
        }
    }
};

PresentationStore.dispatchToken = Dispatcher.register(dispatchCallback);

export default PresentationStore;
