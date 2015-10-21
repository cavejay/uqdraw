let keyMirror = require('keymirror');

export default {
    ActionTypes: keyMirror({
            RESPONSE_CREATE_INITIATED: null,
            RESPONSE_CREATE_SUCCESS: null,
            RESPONSE_CREATE_FAIL: null,
            RESPONSES_UPDATE_INITIATED: null,
            RESPONSES_UPDATE_SUCCESS: null,
            RESPONSES_UPDATE_FAIL: null,
            ACTIVE_QUESTION_CHANGE: null,
            GET_QUESTION_TEXT: null,
            GET_COURSE_CODE: null,
    }),
};
