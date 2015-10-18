import React from 'react';
import { Button } from './UI.jsx';

import QuestionSelector from './QuestionSelector.jsx';
import PresenterQuestion from './PresenterQuestion.jsx';
import PresenterResponses from './PresenterResponses.jsx';
import PresenterDetails from './PresenterDetails.jsx';
import PresenterActivate from './PresenterActivate.jsx';
import Timer from './Timer.jsx';

import Modal from 'react-modal';

import LectureStore from '../stores/LectureStore.js';
import PresentationStore from '../stores/PresentationStore.js';

import LectureActions from '../actions/LectureActions.js';

import LectureCode from '../utils/LectureCode.js';
import API, {APIConstants} from '../utils/API.js';

require('../../css/components/Presenter.scss');

//Little way to set up modals as in other files.
var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class Presenter extends React.Component {

  constructor(props) {
    super(props);

    props.onChangeCourse(null, props.routeParams.courseName);

    this.state = {
      lectureIsActive: false,
      lectureCode: "???",
      activeQuestionKey: "NONE",

      courseKey: undefined,
      lectureKey: undefined,
      responses: [],
      lecture: {},

      displayingResponses: false,

      isResponseModalOpen: false,
      responseModalKey: undefined,
    };


    this.waitingForCode = false;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);

    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
    this.onPresentationChange = this.onPresentationChange.bind(this);
  }

  componentDidMount() {
    // Listen for store changes
    LectureStore.addChangeListener(this.onLectureChange);
    PresentationStore.addChangeListener(this.onPresentationChange);

    this.initData();
  }

  componentWillUnmount() {
    let lectureKey = this.props.routeParams.lectureId;
    let courseKey = this.props.routeParams.courseId;
    let lectureCode = this.state.lectureCode;

    LectureActions.deactivateLecture(lectureCode); //Presentation finished, deactivate

    LectureStore.removeChangeListener(this.onLectureChange);
    PresentationStore.removeChangeListener(this.onPresentationChange);

    API.unsubscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.unsubscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  /* Sets up all the basic data for the application */
  initData() {
    let courseKey = this.props.routeParams.courseId;
    let lectureKey = this.props.routeParams.lectureId;
    let lectureCode = this.state.lectureCode;

    this.state.courseKey = courseKey;
    this.state.lectureKey = lectureKey;
    this.state.lectureCode = lectureCode;

    this.setState({lecture: LectureStore.getAll(lectureKey)});
    this.setState({responses: PresentationStore.getResponses(lectureKey)});

    LectureActions.generateCode();

    API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.subscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  onLectureChange() {
    let courseKey = this.props.routeParams.courseId;
    let lectureKey = this.props.routeParams.lectureId;
    let lectureCode = LectureStore.getCode();

    let lecture = LectureStore.get(courseKey, lectureKey);
    this.setState({'lecture': lecture, 'lectureCode': lectureCode});

    // Update the database with our lecture
    LectureActions.activateLecture(lectureCode, courseKey, lectureKey);

    console.log(lecture);

    //Select the first question automatically
    if (lecture && lecture.questionOrder && lecture.questionOrder[0]) {
      this.setState({'activeQuestionKey':lecture.questionOrder[0]});
    }
  }

  onPresentationChange() {
    let lectureKey = this.props.routeParams.lectureId;

    this.setState({'responses': PresentationStore.getResponses(lectureKey)});
  }

  //Triggered when the user selects a question
  onActivateQuestion(key) {
    this.setState({activeQuestionKey: key}); //Store key of the new selected question
    this.reset(); //When a new question is selected, stop taking answers for the old one
  }

  onThumbnailClick(key) {
    this.setState({responseModalKey: key});
    this.showResponseModal();
  }

  showResponseModal() {
    this.setState({isResponseModalOpen: true});
  }

  hideResponseModal() {
    this.setState({isResponseModalOpen: false});
  }

  start() {
    this.setState({takingQuestions: true}); //Start taking answers

    let lectureCode = this.state.lectureCode;
    let activeQuestionKey = this.state.activeQuestionKey;
    LectureActions.setActiveQuestion(lectureCode, activeQuestionKey); //Set active question

    this.refs.timer.startTimer();
  }

  stop() {
    this.setState({takingQuestions: false}); //Stop taking answers

    let lectureCode = this.state.lectureCode;
    LectureActions.clearActiveQuestion(lectureCode); //Set active question to none

    this.refs.timer.stopTimer();
  }

  reset() {
    this.stop();

    if (this.refs.timer) {
      this.refs.timer.resetTimer();
    }
  }

  activateLecture() {
    /* The lecture and code will not be activated when the window is
    first opened, as lecturers may want to view the lecture without actually
    launching a presentation. This is to be called when the user wishes to 
    actually launch the presentation, and begin accepting responses. */

    this.setState({'lectureIsActive': true});
  }

  showQuestion() {
    this.setState({'displayingResponses': false});
  }

  showResponses() {
    this.setState({'displayingResponses': true});
  }


  render() {
    let questions = [];
    let activeQuestion;
    let activeQuestionComponent;


    if (this.state.lecture && this.state.lecture.questions && this.state.lecture.questionOrder) {
      questions = this.state.lecture.questionOrder.map((key) => {
        return {
          key: key,
          value: this.state.lecture.questions[key],
        };
      });

      // Find the currently active question
      questions.forEach((q) => {
        if (q.key === this.state.activeQuestionKey) {
          activeQuestion = q;
          if (activeQuestion) {
            activeQuestionComponent = <PresenterQuestion question={activeQuestion}/>;
          }
        }
      });
    }

    if (typeof this.state.activeQuestionKey !== 'undefined') {
      var timer = <Timer interval="1000" increment="1000" ref="timer"/>;
      var button;
      if (this.state.takingQuestions) {
        button = <Button key="1" onClick={this.stop}>Stop Taking Responses</Button>;
      } else {
        button = <Button key="2" onClick={this.start}>Start Taking Responses</Button>;
      }
    }

    let activeResponses;
    var responseCount = 0;

    if (typeof this.state.activeQuestionKey !== 'undefined') {
      if (this.state.responses) {
        activeResponses = this.state.responses[this.state.activeQuestionKey];

        if (activeResponses) {
          responseCount = Object.keys(activeResponses).length;

          console.log(responseCount);
        }
      }
    }


    let responseSrc;
    let key = this.state.responseModalKey;

    if (key && activeResponses && activeResponses[key]) {
      responseSrc = activeResponses[key].imageURI; //Set in previous conditional
    }

    var activeResponsesDisplay = <PresenterResponses responses={activeResponses || {}} onThumbnailClick={this.onThumbnailClick.bind(this)}/>


    var questionClass = "SectionLabel";
    var responsesClass = "SectionLabel";

    var contentDisplay;

    if (this.state.displayingResponses) {
      responsesClass += " SectionLabel--Selected";
      contentDisplay = activeResponsesDisplay;
    } else {
      questionClass += " SectionLabel--Selected";
      contentDisplay = activeQuestionComponent;
    }


    var upperBanner;

    if (this.state.lectureIsActive) {
      upperBanner = <PresenterDetails code={this.state.lectureCode}/>
    } else {
      upperBanner = <PresenterActivate activateLecture={this.activateLecture.bind(this)}/>
    }


    var lowerBanner;

    if (this.state.lectureIsActive) {
      lowerBanner = (
        <div className="PresentationControls">
          <div className="PresentationControlItem"> {button} </div>
          <div className="PresentationControlItem"> <p> {responseCount} Responses </p> </div>
          <div className="PresentationControlItem PresentationControlItemRight"> {timer} </div>
        </div>
      );
    }
    

    return (
      <div className='PresenterView'>

        {/* Markup for displaying responses in a modal view */}
        <Modal className='Modal--Response' isOpen={this.state.isResponseModalOpen} onRequestClose={this.hideResponseModal.bind(this)}>
          <a onClick={this.hideResponseModal.bind(this)} className='Modal__cross'>&times;</a>
          <div className='Response-Modal-Centerer'>
            <span className='Image-Layout-Helper'/><img className='Response-Modal-Image' src={responseSrc}/>
          </div>
        </Modal>

        {/* Question selector, displayed on the left of the screen */}
        <div className='Column--supporting'>
          <QuestionSelector questions={questions} onActivateQuestion={this.onActivateQuestion.bind(this)} activeQuestionKey={this.state.activeQuestionKey}/>
        </div>

        {/* All non-question selector content on the window */}
        <div className='Column--main'>

          {/* Upper Banner */}
          {upperBanner}

          {/* Question and response display */}
          <div className="PresentationContent">
            <div className="PresentationContentControls">
              <h2 className={questionClass} onClick={this.showQuestion.bind(this)}>Question</h2> 
              <h2 className={responsesClass} onClick={this.showResponses.bind(this)}>Responses</h2>
            </div>

            {/* Question or Responses */}
            <div className="PresentationContentItem">
              {contentDisplay}
            </div>
          </div>
          
          { /* Presentation Controls */ }
          {lowerBanner}
        </div>


      </div>
    );
  }
}

export default Presenter;
