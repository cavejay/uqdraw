let keyMirror = require('keymirror');

export default {
  ActionTypes: keyMirror({
    SUBJECT_CREATE_INITIATED: null,
    SUBJECT_CREATE_SUCCESS: null,
    SUBJECT_CREATE_FAIL: null,
    SUBJECT_REMOVE_FAIL: null,
    SUBJECT_REMOVE_SUCCESS: null,
    SUBJECT_REMOVE_INITIATED: null,
    SUBJECTS_UPDATE: null,
  }),
};
