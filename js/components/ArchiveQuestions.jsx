import React from 'react';
import { Link } from 'react-router';
import Question from './Question.jsx';
import QuestionComposer from './QuestionComposer.jsx';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';
import ComponentKey from '../utils/ComponentKey.js';
import API, {APIConstants} from '../utils/API.js';
import PresentationStore from '../stores/PresentationStore.js';
import PresenterResponses from './PresenterResponses.jsx';
import Modal from 'react-modal';
require('../../css/components/Button.scss');
require('../../css/components/Archive.scss');
require('../../css/components/QuestionManager.scss');
require('../../css/components/Presenter.scss');
//Little way to set up modals as in other files.
var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class QuestionList extends React.Component {
  onCurrentQuestion(key) {
    this.props.onCurrentQuestion(key);
  }
  render() {

    let questions = this.props.questions.map((question, index) => {
      return (
        <div className='ListItem' style={this.sectionStyle}
          onClick ={this.onCurrentQuestion.bind(this,question.key)}>
          {question.value}
        </div>
        );
    });
    return (
            <div>
    {questions}
    </div>
    );
  }
}

QuestionList.propTypes = {
  onCurrentQuestion: React.PropTypes.func,
};

class ArchiveQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResponseModalOpen: false,
      responseModalKey: undefined,
      activeQuestionKey: "NONE",
      courseKey: this.props.courseId,
      lectureKey: this.props.lectureId,
      responses: [],
      lecture: {},
    };

    this.sectionStyle = {
      flexGrow: 1,
      textAlign: 'center',
    };
    
    this.tableStyle = {
      display: 'flex',
      justifyContent: 'center',
    }
    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
    this.onPresentationChange = this.onPresentationChange.bind(this);
  }

componentDidMount() {
    LectureStore.addChangeListener(this.onLectureChange);
    PresentationStore.addChangeListener(this.onPresentationChange);

    this.initData();
  }

  componentWillUnmount() {
    let courseKey = this.state.courseKey;
    let lectureKey = this.state.lectureKey;

    LectureStore.removeChangeListener(this.onLectureChange);
    PresentationStore.removeChangeListener(this.onPresentationChange);

    API.unsubscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.unsubscribe(APIConstants.responses, this.componentKey, lectureKey);
  }
  
   initData() {
    let courseKey = this.state.courseKey;
    let lectureKey = this.state.lectureKey;
    this.setState({lecture: LectureStore.getAll(courseKey)});
    this.setState({responses: PresentationStore.getResponses(lectureKey)});
    API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.subscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  onLectureChange() {
    let courseKey = this.state.courseKey;
    let lectureKey = this.state.lectureKey;

    let lecture = LectureStore.get(courseKey, lectureKey);
    this.setState({'lecture': lecture});
  }

  onPresentationChange() {
    let courseKey = this.state.courseKey;
    let lectureKey = this.state.lectureKey;

    this.setState({'responses': PresentationStore.getResponses(lectureKey)});
  }
  
  onCurrentQuestion(key) {
    this.setState({activeQuestionKey: key}); //Store key of the new selected question 
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

  
  render() {
  let questions = [];   
  if (this.state.lecture && this.state.lecture.questions) {

      questions = this.state.lecture.questionOrder.map((key) => {
        return {
          key: key,
          value: this.state.lecture.questions[key],
        };
      });
  }
  
    let style = {
      maxWidth: 800,
      display: 'flex',
      alignItems: 'flex-start',
      margin: '0 auto',
      flexDirection: 'column',
    };

    let thumbStyle = {
      marginRight: '1em',
      marginBottom: '1em',
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: 4,
    };

    let thumbContainerStyle = {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    };

  
      let activeResponses;
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      if (this.state.responses) {
        activeResponses = this.state.responses[this.state.activeQuestionKey];
      }
    }
    
    let responseSrc;
    let key = this.state.responseModalKey;
    if (key && activeResponses) {
      responseSrc = activeResponses[key].imageURI; //Set in previous conditional
    }
    return (
      <div className='top' ref='topSection' style={this.sectionStyle}>
              <Modal className='Modal--Response' isOpen={this.state.isResponseModalOpen} onRequestClose={this.hideResponseModal.bind(this)}>
          <a onClick={this.hideResponseModal.bind(this)} className='Modal__cross'>&times;</a>
          <div className='Response-Modal-Centerer'>
            <span className='Image-Layout-Helper'/><img className='Response-Modal-Image' src={responseSrc}/>
          </div>
        </Modal>

          <div className='Column-Left'>
            <div className='Heading2'>Select</div>
            <div className='Heading1'>QUESTION</div>
            <QuestionList
            questions={questions}
            onCurrentQuestion={this.onCurrentQuestion.bind(this)} 
            activeQuestionKey={this.state.activeQuestionKey}
          />
          </div>
            <div className='Column-Right'>
            <div className='Heading2'> </div>
              <div className='Heading1'>RESPONSES</div>
            <div className="ResponseThumbnails">
              <PresenterResponses responses={activeResponses || {}} onThumbnailClick={this.onThumbnailClick.bind(this)}/>
            </div>
            </div>
      </div>
       



    );
  }
}

ArchiveQuestions.propTypes = {
  courseKey: React.PropTypes.string,
  lectureKey: React.PropTypes.string,
  lecture: React.PropTypes.object,
    router: React.PropTypes.func,
};

export default ArchiveQuestions;
