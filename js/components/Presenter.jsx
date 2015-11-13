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
      lectureIsActive: false, //If the lecture is in preview mode or not
      lectureCode: "???", //Current lecture code. Starts as ??? when one has not yet been obtained
      activeQuestionKey: "NONE", //The currently active question, NONE if no question is active

      courseKey: undefined, //The key for the course that this lecture belongs to
      lectureKey: undefined, //The key for the lecture that is being displayed
      responses: [], //All of the responses for this lecture, as fetched from the store
      lecture: {}, //Object describing the lecture being displayed

      displayingResponses: false, //If responses or the question are being shown on the screen

      isResponseModalOpen: false, //If a response is being shown in a modal or not
      responseModalKey: undefined, //The key of the response being shown in the modal.
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

    LectureActions.deactivateLecture(lectureCode); //Presentation finished, deactivate the lecture in the database

    LectureStore.removeChangeListener(this.onLectureChange);
    PresentationStore.removeChangeListener(this.onPresentationChange);

    API.unsubscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.unsubscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  /* Sets up all the basic data for the application */
  initData() {
    //Get all of the basic lecture information from the route
    let courseKey = this.props.routeParams.courseId;
    let lectureKey = this.props.routeParams.lectureId;
    let lectureCode = this.state.lectureCode;

    //Store the lecture information in the component state
    this.state.courseKey = courseKey;
    this.state.lectureKey = lectureKey;
    this.state.lectureCode = lectureCode;

    this.setState({lecture: LectureStore.getAll(lectureKey)});
    this.setState({responses: PresentationStore.getResponses(lectureKey)});

    //Get a code for this lecture that can be used once it's activated
    LectureActions.generateCode();

    API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.subscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  //Triggered whenever the lecture object is updated in the store
  onLectureChange() {
    //Get all of the relevant information about the lecture
    let courseKey = this.props.routeParams.courseId;
    let lectureKey = this.props.routeParams.lectureId;
    let lectureCode = LectureStore.getCode();

    //Update the handle on the lecture store
    let lecture = LectureStore.get(courseKey, lectureKey);
    this.setState({'lecture': lecture, 'lectureCode': lectureCode});

    //Whilst waiting for the title, set title to a loading message
    let title = "Loading Title...";

    //If there is s title available, get this title, otherwise just keep the
    //loading message.
    if (lecture && lecture.title) {
      title = lecture.title;
    }

    // Update the database with our lecture
    LectureActions.activateLecture(lectureCode, courseKey, lectureKey, title, this.props.routeParams.userId);

    //Select the first question automatically
    if (lecture && lecture.questionOrder && lecture.questionOrder[0]) {
      this.setState({'activeQuestionKey':lecture.questionOrder[0]});
    }
  }

  //Called whenever changes are made to the presentation objects, most often
  //called for updating the reponses that are to be displayed on the screen.
  onPresentationChange() {
    let lectureKey = this.props.routeParams.lectureId;

    this.setState({'responses': PresentationStore.getResponses(lectureKey)});
  }

  //Triggered when the user selects a question
  onActivateQuestion(key) {
    this.setState({activeQuestionKey: key}); //Store key of the new selected question
    this.reset(); //When a new question is selected, stop taking answers for the old one
  }

  //When the user clicks on one of the response thumbnails
  onThumbnailClick(key) {
    this.setState({responseModalKey: key});
    this.showResponseModal();
  }

  // Display a modal view with the last selected response in it
  showResponseModal() {
    this.setState({isResponseModalOpen: true});
  }

  // Dismiss the modal view
  hideResponseModal() {
    this.setState({isResponseModalOpen: false});
  }

  // Start taking answers for a specific question
  start() {
    this.setState({takingQuestions: true}); //Start taking answers

    //Get the code for the current lecture and the question that is being launched
    let lectureCode = this.state.lectureCode;
    let activeQuestionKey = this.state.activeQuestionKey;

    //Connect to the database and update to display this question. From here
    //students' screens will automatically be updated to display the question
    //can prompt them to give a response
    LectureActions.setActiveQuestion(lectureCode, activeQuestionKey);

    // 
    this.refs.timer.startTimer();
  }

  //Pauses the responses for a specific question. This differs from reset, as
  //the timer is not reset. Users can re-launch the responses for a question
  //and the timer will continue from where it was
  stop() {
    this.setState({takingQuestions: false}); //Stop taking answers

    let lectureCode = this.state.lectureCode;
    LectureActions.clearActiveQuestion(lectureCode); //Set active question to none

    this.refs.timer.stopTimer();
  }

  //Runs the stop function above, however the timer is also reset to zero.
  reset() {
    this.stop();

    if (this.refs.timer) {
      this.refs.timer.resetTimer();
    }
  }

  // The lecture and code will not be activated when the window is
  // first opened, as lecturers may want to view the lecture without actually
  // launching a presentation. This is to be called when the user wishes to 
  // actually launch the presentation, and begin accepting responses.
  activateLecture() {
    this.setState({'lectureIsActive': true});
  }

  //Displays the question tab to the presenter
  showQuestion() {
    this.setState({'displayingResponses': false});
  }

  //Displays the resonses tab to the presenter
  showResponses() {
    this.setState({'displayingResponses': true});
  }


  render() {
    let questions = [];
    let activeQuestion;
    let activeQuestionComponent;


    //Get a list of all of the questions in the correct order
    if (this.state.lecture && this.state.lecture.questions && this.state.lecture.questionOrder) {
      questions = this.state.lecture.questionOrder.map((key) => {
        return {
          key: key,
          value: this.state.lecture.questions[key],
        };
      });

      // Find the currently active question, and ensure that it is highlighted
      questions.forEach((q) => {
        if (q.key === this.state.activeQuestionKey) {
          activeQuestion = q;
          if (activeQuestion) {
            activeQuestionComponent = <PresenterQuestion question={activeQuestion}/>;
          }
        }
      });
    }

    //If a question is selected, display the timer and question launch buttons
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      var timer = <Timer interval="1000" increment="1000" ref="timer"/>;
      var button;
      if (this.state.takingQuestions) {
        button = <Button key="1" onClick={this.stop}>Stop Taking Responses</Button>;
      } else {
        button = <Button key="2" onClick={this.start}>Start Taking Responses</Button>;
      }
    }


    //Format the responses page
    let activeResponses;
    var responseCount = 0;

    //As above, if there is a selected question
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      //If there are some responses to show
      if (this.state.responses) {
        activeResponses = this.state.responses[this.state.activeQuestionKey];

        if (activeResponses) {
          responseCount = Object.keys(activeResponses).length;
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
