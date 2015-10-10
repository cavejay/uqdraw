import React from 'react';
import Header from './Header.jsx';
import QuestionSelector from './QuestionSelector.jsx';
import PresenterQuestion from './PresenterQuestion.jsx';
import PresenterResponses from './PresenterResponses.jsx';
import LectureStore from '../stores/LectureStore.js';
import PresentationStore from '../stores/PresentationStore.js';
import API, {APIConstants} from '../utils/API.js';
import LectureActions from '../actions/LectureActions.js';
import Modal from 'react-modal';
let Firebase = require('firebase');
import config from '../config.js';
require('../../css/components/Presenter.scss');
//Little way to set up modals as in other files.
var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class ArchiveQuestion extends React.Component {
  onCurrentQuestion(key) {
    this.props.onCurrentQuestion(key);
  }
  render() {
    let questions = this.props.questions.map((question, index) => {
      let className = 'PresenterListItem';
      if (question.key === this.props.activeQuestionKey) {
        className += ' PresenterListItem';
      }
      return (
      <tr>
        <td>{question.value} </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td><div key={question.key} className={className}  onClick={this.onCurrentQuestion.bind(this, question.key)}>View Responses</div></td>
      </tr>
        );
    });
    return (
            <table>
            <tr>
              <th> Question </th>
              <th> Number of Responses </th>
              <th> Number of Connections </th>
              <th> Duration </th>
              <th></th>
            </tr>
		{questions}
		</table>
    );
  }
}

ArchiveQuestion.propTypes = {
  onCurrentQuestion: React.PropTypes.func,
};

class Responses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResponseModalOpen: false,
      responseModalKey: undefined,
      lectureCode: undefined,
      activeQuestionKey: "NONE",
      courseKey: undefined,
      lectureKey: undefined,
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
    
    this.divider = {
        width: '100%',
        height: 1,
        backgroundColor: '#e0e0e0',
        display: 'flex',
        justifyContent: 'center',
        margin: 20,
    };
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
    let lectureKey = this.props.routeParams.lectureId;
    let courseKey = this.props.routeParams.courseId;

    LectureStore.removeChangeListener(this.onLectureChange);
    PresentationStore.removeChangeListener(this.onPresentationChange);

    API.unsubscribe(APIConstants.lectures, this.componentKey, courseKey);
    API.unsubscribe(APIConstants.responses, this.componentKey, lectureKey);
  }
  
   initData() {
    let courseKey = this.props.routeParams.courseId;
    let lectureKey = this.props.routeParams.lectureId;

    this.state.courseKey = courseKey;
    this.state.lectureKey = lectureKey;

    this.setState({lecture: LectureStore.getAll(lectureKey)});
    this.setState({responses: PresentationStore.getResponses(lectureKey)});
    
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
      <div className='ResponsesView'>
        {/* Markup for displaying responses in a modal view */}
        <Modal className='Modal--Response' isOpen={this.state.isResponseModalOpen} onRequestClose={this.hideResponseModal.bind(this)}>
          <a onClick={this.hideResponseModal.bind(this)} className='Modal__cross'>&times;</a>
          <div className='Response-Modal-Centerer'>
            <span className='Image-Layout-Helper'/><img className='Response-Modal-Image' src={responseSrc}/>
          </div>
        </Modal>
        <div className='MainContainer'>
        <div className='top' ref='topSection' style={this.sectionStyle}>
            <h1 className='CodeHeading'>{this.props.courseName}: {this.state.lecture.title}</h1>
    	</div>
        <div className='MainContainer' style={this.tableStyle}>
          <ArchiveQuestion
            questions={questions}
            onCurrentQuestion={this.onCurrentQuestion.bind(this)} 
            activeQuestionKey={this.state.activeQuestionKey}
          />
          </div>
          <div ref='divider' style={this.divider}></div>
          <div className='CodeSubheading' style={this.sectionStyle}>Responses</div>
            <div className="ResponseThumbnails">
              <PresenterResponses responses={activeResponses || {}} onThumbnailClick={this.onThumbnailClick.bind(this)}/>
            </div>
        </div>
      </div>
    );
  }
}

export default Responses;
