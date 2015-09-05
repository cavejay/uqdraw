import Dispatcher from '../dispatcher/Dispatcher.js';
import ResponseConstants from '../constants/ResponseConstants.js';
let API = require('../utils/API').default;
let actionTypes = ResponseConstants.ActionTypes;


let ResponderActions = {
    createResponse: function(lectureKey, questionKey, response) {
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

    updateResponses: function(lectureKey, responses) {
        Dispatcher.dispatch({
            type: actionTypes.RESPONSES_UPDATE_SUCCESS,
            lectureKey,
            responses,
        });
    }
};

export default ResponderActions;
