import React from 'react';
import config from '../config';
import Header from './Header.jsx';
import QuestionList from './QuestionList.jsx';
import LectureComposer from './LectureComposer.jsx';
import HorizontalDragScroll from '../composables/HorizontalDragScroll.js';

import QuestionActions from '../actions/QuestionActions.js';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';
import API, {APIConstants} from '../utils/API.js';
import ComponentKey from '../utils/ComponentKey.js';
import lectureCode from '../utils/lectureCode.js';
let Firebase = require('firebase');
let Modal = require('react-modal');

require('../../css/components/Colors.scss');
require('../../css/components/QuestionManager.scss');

var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class QuestionManager extends React.Component {
  constructor(props) {
    super(props);
    //props.onChangeCourse(null, props.routeParams.courseName);
    this.componentKey = ComponentKey.generate();
    this.lectureCode = lectureCode.generate();
    this.state = {
      curYPos: 0,
      curXPos: 0,
      curScrollPos: 0,
      curDown: false,
      curOffset: 0,
      isLectureModalOpen: false,
    	isDeleteModalIsOpen: false,
      lectures: {},
    };

    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
  }

  componentDidMount() {
    // Listen for store changes
    LectureStore.addChangeListener(this.onLectureChange);

    // Initialise store data
    this.initData(this.props.routeParams.courseId);
  }

  componentWillReceiveProps(newProps) {
    // Initialise store data
    this.initData(newProps.routeParams.courseId);
  }

  componentWillUnmount() {
    LectureStore.removeChangeListener(this.onLectureChange);
    API.unsubscribe(APIConstants.lectures, this.componentKey, this.props.routeParams.courseId);
  }

  initData(courseKey) {
    if (courseKey) {
      this.setState({lectures: LectureStore.getAll(courseKey)});

      API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
    }
  }

  onLectureChange() {
    this.setState({lectures: LectureStore.getAll(this.props.routeParams.courseId)});
  }

  showLectureModal(event) {
    this.setState({isLectureModalOpen: true});
    event.preventDefault();
  }

  hideLectureModal(event) {
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onAddLecture(title) {
    LectureActions.create(this.props.routeParams.courseId, this.lectureCode, title);
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onRemoveLecture(lectureId) {
    LectureActions.delete(this.props.routeParams.courseId, lectureId);
  }

  onAddQuestion(lectureKey, lecture, question) {
    QuestionActions.create(this.props.routeParams.courseId, lectureKey, lecture, question);
    event.preventDefault();
  }

  onRemoveQuestion(lectureKey, lecture, questionKey) {
    QuestionActions.delete(this.props.routeParams.courseId, lectureKey, lecture, questionKey);
    event.preventDefault();
  }
  
  showDeleteModal(event) {
    this.setState({isDeleteModalIsOpen: true});
  }

  hideDeleteModal(event) {
    this.setState({isDeleteModalIsOpen: false});
    event.preventDefault();
  }

  render() {
    let lectures;
    if (this.state.lectures) {
      lectures = Object.keys(this.state.lectures).map((lectureKey) => {
        return (
          <QuestionList
            key={lectureKey}
            userId = {this.props.routeParams.userId}
            courseKey={this.props.routeParams.courseId}
            lectureKey={lectureKey}
            lecture={this.state.lectures[lectureKey]}
            onRemoveLecture={this.onRemoveLecture.bind(this)}
            onAddQuestion={this.onAddQuestion.bind(this)}
            onRemoveQuestion={this.onRemoveQuestion.bind(this)}
          />
        );
      });
    }

    return (
      <div className='ViewContainer'>
        <Header>
          <div className='Stack'>
            <img className='Stack-icon' onClick={this.showDeleteModal.bind(this)} src={require('../../images/delete_lecture.png')} />
            <div className='Stack-label' onClick={this.showDeleteModal.bind(this)}>Delete Course</div>
            <Modal isOpen={this.state.isDeleteModalIsOpen} className='Modal--deleteCourse'>
 			
        	</Modal>
          </div>
        </Header>
        <div className='QuestionManager' {...this.props.scrollHandlers} data-scrollable="true">
          <div className='QustionManager-header' data-scrollable="true">
            <div className="TitleBar-title">
              <h1>Question Manager - {this.props.courseName}</h1>
            </div>
          </div>
          <div className='CardListsContainer'>
            <div className='CardLists scrollbar' ref={this.props.setScrollRef} data-scrollable="true">
              {lectures}
              <div className="CardList--add" onClick={this.showLectureModal.bind(this)}>
                <span>Add a new lecture...</span>
              </div>
            {/* side scroll does not respect right margin of rightmost object without this */
            <div>&nbsp;</div> }
            </div>
          </div>
          <LectureComposer
            isOpen={this.state.isLectureModalOpen}
            onClose={this.hideLectureModal.bind(this)}
            onSave={this.onAddLecture.bind(this)}
          />
        </div>
        {/* Quick hack so that the scrollbar isnt sitting on bottom */}
        <div className='QuestionManagerFooter' />
      </div>
    );
  }
}

export default HorizontalDragScroll(QuestionManager);
