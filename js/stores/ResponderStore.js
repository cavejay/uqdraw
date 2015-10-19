let Dispatcher = require('../dispatcher/Dispatcher.js');
let EventEmitter = require('events').EventEmitter;
import ResponseConstants from '../constants/ResponseConstants.js';
import ResponderActions from '../actions/ResponderActions.js';
let ActionTypes = ResponseConstants.ActionTypes;

let CHANGE_EVENT = 'change';
let QUESTION_CHANGE = 'q_change';

let _isSubmitting = false;
let _state = {};

let ResponderStore = Object.assign({}, EventEmitter.prototype, {
    isSubmitting: function() {
        return _isSubmitting;
    },

    refreshState: function() {
      return _state;
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
            let {activeQ, courseID, lectureID} = action;
            _state.isQuestionOpen = true;
            _state.activeQ = activeQ;
            _state.courseID = courseID;
            _state.lectureID = lectureID;
            _isSubmitting = false;
            ResponderStore.emitChange();
            ResponderActions.getQuestionText(courseID, lectureID, activeQ);
            break;
        }

        // this needs to be made in a separate call after we get the first lot
        case ActionTypes.GET_QUESTION_TEXT: {
            _state.questionText = action.questionText;
            if(!_state.questionText) _state.questionText = "...";
            ResponderStore.emitChange();
            break;
        }

        // We want a pop up to say we're submitting
        case ActionTypes.RESPONSE_CREATE_INITIATED: {
            _isSubmitting = true;
            _state.isQuestionOpen = false
            ResponderStore.emitChange();
            break;
        }

        case ActionTypes.RESPONSE_CREATE_SUCCESS: {
            console.log("[API] Succeeded in adding reponse to firebase")
            _isSubmitting = false;
            ResponderStore.emitChange();
            break;
        }
    }

};

ResponderStore.dispatchToken = Dispatcher.register(dispatchCallback);

export default ResponderStore;
