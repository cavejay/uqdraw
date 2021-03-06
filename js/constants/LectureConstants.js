let keyMirror = require('keymirror');

export default {
    ActionTypes: keyMirror({
        LECTURE_CODE_LIST_UPDATE: null,
        LECTURES_LISTEN: null,
        LECTURES_UPDATE_INITIATED: null,
        LECTURES_UPDATE_SUCCESS: null,
        LECTURES_UPDATE_FAIL: null,
        LECTURE_CREATE_INITIATED: null,
        LECTURE_CREATE_SUCCESS: null,
        LECTURE_CREATE_FAIL: null,
        LECTURE_DELETE_INITIATED: null,
        LECTURE_DELETE_SUCCESS: null,
        LECTURE_DELETE_FAIL: null,
    }),
};
