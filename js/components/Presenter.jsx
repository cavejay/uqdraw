import React from 'react';
import { Button } from './UI.jsx';

import QuestionSelector from './QuestionSelector.jsx';
import PresenterQuestion from './PresenterQuestion.jsx';
import PresenterResponses from './PresenterResponses.jsx';
import Timer from './Timer.jsx';

import LectureStore from '../stores/LectureStore.js';
import PresentationStore from '../stores/PresentationStore.js';

import LectureActions from '../actions/LectureActions.js';

import lectureCode from '../utils/lectureCode.js';
import API, {APIConstants} from '../utils/API.js';

require('../../css/components/Presenter.scss');

class Presenter extends React.Component {

  constructor(props) {
    super(props);

    //props.onChangeCourse(null, props.routeParams.courseName);

    this.state = {
      lectureCode: undefined,
      activeQuestionKey: "NONE",
      courseKey: undefined,
      lectureKey: undefined,
      responses: [],
      lecture: {},
    };

    this.state.lectureCode = this.generateCode();

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

  /* Generates a 3 digit code, used to give users access to the lecture 
   * response page */
  generateCode(courseKey, lectureKey, lecture){
    let code3 = lectureCode.generate(); //Generate the code

    //LectureActions.updateCode(courseKey, lectureKey, code3); //Store code in DB

    return code3;
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

    console.log(this.state);

    LectureActions.activateLecture(lectureCode, courseKey, lectureKey);
    
    API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.subscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  onLectureChange() {
    let courseKey = this.props.routeParams.courseId;
    let lectureKey = this.props.routeParams.lectureId;

    let lecture = LectureStore.get(courseKey, lectureKey);
    this.setState({'lecture': lecture});
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
    console.log('make a large version of submission ' + key);
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

  render() {
    this.styles = {
      presenterCode: {
        display: 'flex',
        flexDirection: 'column',
      },
      presenterCodeTitle: {
        fontSize: 22,
        letterSpacing: '8px',
      },
      presenterCodeCode: {
        fontSize: 50,
        lineHeight: 0.8,
      },
      presenterLink: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 50,
      },
      timer: {
        alignSelf: 'flex-end',
        margin: '5px 20px',
      },
    };

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
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      if (this.state.responses) {
        activeResponses = this.state.responses[this.state.activeQuestionKey];
      }
    }

    return (
      <div className='PresenterView'>
        <div className='Column--main'>

          <div className="PresentationDetails">
            <div className="Step">
              <div className='Step-number'>1</div>
              <div className='Step-instructions'>
                <span className='Step-label'>Go to</span><span className='Step-value'>uqdraw.co</span>
              </div>
            </div>
            <div className="Step">
              <div className='Step-number'>2</div>
              <div className='Step-instructions'>
                <span className='Step-label'>Enter code</span><span className='Step-value'>{this.state.lectureCode}</span>
              </div>
            </div>
          </div>
          <div className="PresentationQuestion">
            <h2 className='SectionHeading'>Question</h2>
            {activeQuestionComponent}
            <div className='Timer'>
              {timer}
              {button}
            </div>
          </div>
          <div className="PresentationResponses">
            <h2 className='SectionHeading'>Responses</h2>
            <div className="ResponseThumbnails">
              <PresenterResponses responses={activeResponses || {}} onThumbnailClick={this.onThumbnailClick}/>
            </div>
          </div>
        </div>

        <div className='Column--supporting'>
          <QuestionSelector questions={questions} onActivateQuestion={this.onActivateQuestion.bind(this)} activeQuestionKey={this.state.activeQuestionKey}/>
        </div>
      </div>
    );
  }
}

export default Presenter;
