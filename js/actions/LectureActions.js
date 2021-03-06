import Dispatcher from '../dispatcher/Dispatcher.js';
import LectureConstants from '../constants/LectureConstants.js';
let ActionTypes = LectureConstants.ActionTypes;

import config from '../config';
let firebaseRoot = config.firebase.base;
let Firebase = require('firebase');
import LectureCode from '../utils/LectureCode.js';

let LectureActions = {
    generateCode: () => {
        let refs = []; // clear the array
        let ref = new Firebase(`${firebaseRoot}/activeLectures`);
        ref.once('value', (snapshot) => {
            snapshot.forEach((child) => {
                refs.push(child.key());
            })
            let test = LectureCode.generate(refs);
            console.log("[CODE] Generated code: "+test);
            Dispatcher.dispatch({
                type: ActionTypes.LECTURE_CODE_LIST_UPDATE,
                lectureCode: test,
            });
        });
    },

    updateLectures: (courseKey, lectures) => {
        if (!courseKey || !lectures) return;
        Dispatcher.dispatch({
            type: ActionTypes.LECTURES_UPDATE_SUCCESS,
            courseKey: courseKey,
            lectures: lectures,
        });
    },

    /* lectures */

    create: (courseKey, lectureCode, lectureTitle) => {
    let API = require('../utils/API').default;
        //Create the new lecture
        let newLecture = {
            title: lectureTitle,
            lectureCode: lectureCode,
            questions: [],
            questionOrder: []
        };

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

    updateCode: (courseKey, lectureKey, lecCode) => {
        let API = require('../utils/API').default;

        let ref = API.updateLectureCode(courseKey, lectureKey, lecCode, (error) => {
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




    /* activeLecture */
    // None of these currently have callbacks, they will be implemented later. We don't
    // really need them at this point in time.
    activateLecture: (lectureCode, courseKey, lectureKey, title, user) => {
        let API = require('../utils/API').default;
        let ref = API.createActiveLecture(lectureCode, courseKey, lectureKey, title, user, () => {});
    },

    setActiveQuestion: (lectureCode, activeQuestionKey) => {
        let API = require('../utils/API').default;
        let ref = API.updateActiveLectureQuestion(lectureCode, activeQuestionKey, () => {});
    },

    clearActiveQuestion: (lectureCode) => {
        let API = require('../utils/API').default;
        let ref = API.clearActiveLectureQuestion(lectureCode, () => {});
    },

    deactivateLecture: (lectureCode) => {
        let API = require('../utils/API').default;

        console.log(API);
        console.log(API.deleteActiveLecture);

        let ref = API.deleteActiveLecture(lectureCode, () => {});
    }

};

export default LectureActions;
