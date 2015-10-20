import Dispatcher from '../dispatcher/Dispatcher.js';
import ResponseConstants from '../constants/ResponseConstants.js';
let API = require('../utils/API').default;
let actionTypes = ResponseConstants.ActionTypes;


let ResponderActions = {
    createResponse: function(lectureKey, questionKey, response) {
        let API = require('../utils/API').default;
        let responseKey = API.addToResponses(lectureKey, questionKey, response, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: actionTypes.RESPONSE_CREATE_FAIL,
                    lectureKey,
                    questionKey,
                    response,
                    error,
                });
            } else {
                Dispatcher.dispatch({
                    type: actionTypes.RESPONSE_CREATE_SUCCESS,
                    lectureKey,
                    questionKey,
                    responseKey,
                    response,
                });
            }
        });
        Dispatcher.dispatch({
            type: actionTypes.RESPONSE_CREATE_INITIATED,
            lectureKey,
            questionKey,
            response,
        });
    },

    updateResponder: function(lectureCode, content) {
        if(!content) return;
        Dispatcher.dispatch({
            type: actionTypes.ACTIVE_QUESTION_CHANGE,
            activeQ: content.activeQ,
            owner: content.owner,
            courseID: content.courseID,
            lectureID: content.lectureID,
            lectureTitle: content.lectureTitle,
        })
    },

    getQuestionText: function(courseID, lectureID, questionID) {
        let API = require('../utils/API').default;
        API.getActiveQuestionText(courseID, lectureID, questionID, function(content) {
          Dispatcher.dispatch({
              type: actionTypes.GET_QUESTION_TEXT,
              questionText: content,
          })
        });
    },

    getCourseCode: function(owner, courseID) {
        let API = require('../utils/API').default;
        API.getCourseFromDB(owner, courseID, function(content) {
          Dispatcher.dispatch({
            type: actionTypes.GET_COURSE_CODE,
            courseCode: content,
          });
        });
    },

    updateResponses: function(lectureKey, responses) {
        Dispatcher.dispatch({
            type: actionTypes.RESPONSES_UPDATE_SUCCESS,
            lectureKey,
            responses,
        });
    },
};

export default ResponderActions;
