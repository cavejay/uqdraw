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
    
   updateActiveLecture: (lectureCode, courseKey, lectureKey, activeQuestionKey) => {
    let API = require('../utils/API').default;
        let newActive= {courseID: courseKey, lectureID: lectureKey, activeQ: activeQuestionKey};
        let ref = API.updateActive(lectureCode, newActive, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_FAIL,
                    courseKey: courseKey,
                    activeQ: newActive,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.LECTURE_CREATE_SUCCESS,
                    courseKey: courseKey,
                    activeQ: newActive,
                });
            }
        });
        Dispatcher.dispatch({
            type: ActionTypes.LECTURE_CREATE_INITIATED,
            courseKey: courseKey,
            activeQ: newActive,
        });
    }, 
    
   getActiveLecture: (lectureCode) => {
    let API = require('../utils/API').default;
        let ref = API.getActiveLecPath(lectureCode, (error) => {
            if (error) {
                Dispatcher.dispatch({
                    type: ActionTypes.GET_ACTIVE_LECTURE_FAIL,
            		lectureCode: lectureCode,
            		ref:ref,
                });
            } else {
                Dispatcher.dispatch({
                    type: ActionTypes.GET_ACTIVE_LECTURE_SUCCESS,
                       lectureCode: lectureCode,
                       ref:ref,
                });
            }
        });
        Dispatcher.dispatch({
            type: ActionTypes.GET_ACTIVE_LECTURE_INIT,
			lectureCode: lectureCode,
			ref:ref,
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