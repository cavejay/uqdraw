import Dispatcher from '../dispatcher/Dispatcher.js';
import SubjectConstants from '../constants/SubjectConstants.js';
let API = require('../utils/API.js').default;
let APIConstants = require('../utils/API.js').APIConstants;
// import API from '../utils/API.js';
// import {APIConstants} from '../utils/API.js';
let actionTypes = SubjectConstants.ActionTypes;

let SubjectActions = {
  create: (userId, subjectName) => {
    if (!subjectName) return;

    API.addToSubjects(userId, subjectName, (error) => {
      if (error === null) {
        Dispatcher.dispatch({
          type: actionTypes.SUBJECT_CREATE_SUCCESS,
          userId: userId,
          subjectName: subjectName,
        });
      } else {
        Dispatcher.dispatch({
          type: actionTypes.SUBJECT_CREATE_FAIL,
          userId: userId,
          subjectName: subjectName,
          error: error,
        });
      }
    });

    Dispatcher.dispatch({
      type: actionTypes.SUBJECT_CREATE_INITIATED,
      subjectName: subjectName,
    });
  },

  updateSubjects: (subjectsMap) => {
    Dispatcher.dispatch({
      type: actionTypes.SUBJECTS_UPDATE,
      subjects: subjectsMap,
    });
  },
    delete: (subjectName, userId) => {
    if (!subjectName || !userId) return;

    API.removeCourse(subjectName, userId, (error) => {
      if (error === null) {
      console.log("ENTERING HYPERSPEED");
        Dispatcher.dispatch({
          type: actionTypes.SUBJECT_DELETE_SUCCESS,
          userId: userId,
          subjectName: subjectName,
        });
      } else {
        Dispatcher.dispatch({
          type: actionTypes.SUBJECT_DELETE_FAIL,
          userId: userId,
          subjectName: subjectName,
          error: error,
        });
      }
    });

    Dispatcher.dispatch({
      type: actionTypes.SUBJECT_DELETE_INITIATED,
      subjectName: subjectName,
    });
  },
};

export default SubjectActions;
