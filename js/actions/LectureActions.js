import Dispatcher from '../dispatcher/Dispatcher.js';
import LectureConstants from '../constants/LectureConstants.js';
let ActionTypes = LectureConstants.ActionTypes;
// let API = require('../utils/API').default;

let LectureActions = {

   updateLectures: (courseKey, lectures) => {
        if (!courseKey || !lectures) return;
        Dispatcher.dispatch({
            type: ActionTypes.LECTURES_UPDATE_SUCCESS,
            courseKey: courseKey,
            lectures: lectures,
        });
    },

    create: (courseKey, lectureCode, lectureTitle) => {
    let API = require('../utils/API').default;
        let newLecture = {title: lectureTitle, lectureCode: lectureCode, questions: []};
        let ref = API.addToLectures(courseKey, newLecture, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_FAIL,
                    courseKey: courseKey,
                    lecture: newLecture,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_SUCCESS,
                    courseKey: courseKey,
                    lectureKey: ref.key(),
                    lecture: newLecture,
                });
            }
        });
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_CREATE_INITIATED,
            courseKey: courseKey,
            lecture: newLecture,
        });
    },
    
    updateCode: (courseKey, lectureKey, lecCode, lecture) => {
    let API = require('../utils/API').default;
    	lecture.lectureCode = lecCode;
        let newLecture = lecture;
        let ref = API.updateLectureCode(courseKey, lectureKey, newLecture, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_FAIL,
                    courseKey: courseKey,
                    lecture: newLecture,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_SUCCESS,
                    courseKey: courseKey,
                    lectureKey: ref.key(),
                    lecture: newLecture,
                });
            }
        });
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_CREATE_INITIATED,
            courseKey: courseKey,
            lecture: newLecture,
        });
    },    
    

    delete: (courseKey, lectureKey) => {
    let API = require('../utils/API').default;
        API.removeLecture(courseKey, lectureKey, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_DELETE_FAIL,
                    courseKey,
                    lectureKey,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_DELETE_SUCCESS,
                    courseKey,
                    lectureKey,
                });
            }
        });
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_DELETE_INITIATED,
            courseKey,
            lectureKey,
        });
    },

};

export default LectureActions;