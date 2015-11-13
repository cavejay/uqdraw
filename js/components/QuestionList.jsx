import React from 'react';
import { Link } from 'react-router';
import Question from './Question.jsx';
import QuestionComposer from './QuestionComposer.jsx';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';

import API, {APIConstants} from '../utils/API.js';
require('../../css/components/QuestionManager.scss');

class QuestionList extends React.Component {

  constructor(props) {
    super(props);
    this.lectureCode = '';
    this.state = {
      modalIsOpen: false,
    };
  }

  //Display modal for generation a question
  showQuestionModal() {
    this.setState({modalIsOpen: true});
    event.preventDefault();
  }

  //Dismiss modal for generating a question
  hideQuestionModal() {
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  //Triggered when a new question is added
  onAddQuestion(lectureKey, lecture, question) {
    this.props.onAddQuestion(lectureKey, lecture, question);
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  //Triggered when lecture is removed
  onRemoveLecture(key) {
    this.props.onRemoveLecture(key);
  }

  //Triggered when a question is removed
  onRemoveQuestion(lectureKey, lecture, questionKey) {
    this.props.onRemoveQuestion(lectureKey, lecture, questionKey);
  }

  render() {
    let {courseKey, lectureKey, lecture, ...delegateProps} = this.props;
    let questionComponents;
    // Make sure both the lecture questions and lecture question order exist
    if (lecture.questions && lecture.questionOrder) {
      questionComponents = lecture.questionOrder.map((questionKey) => {
        // If a question key is in questionOrder but has no matching question
        if (!lecture.questions.hasOwnProperty(questionKey)) {
          return null;
        }

        //For each question, generate an individual question component that
        //is used for display in the render function below
        let question = lecture.questions[questionKey];
        return (
          <Question
            key={questionKey}
            questionKey={questionKey}
            question={question}
            onRemoveQuestion={this.onRemoveQuestion.bind(this, lectureKey, lecture)}
          />
        );
      });
    }
    return (
      <div className='CardList' draggable="true">
        <div className='CardList-header'>
          <h2>{lecture.title}</h2>
          <div className='PresenterLinkContainer'>
            <Link to="presenter" params={{userId: this.props.userId, courseId: courseKey, lectureId: lectureKey}}>Launch {lecture.title} Presentation</Link>
          </div>
          <a
            className="Button--close"
            onClick={this.onRemoveLecture.bind(this, lectureKey)}>
            &times;
          </a>
        </div>
        {questionComponents}
        <div className='Card--add' onClick={this.showQuestionModal.bind(this)}>
          Add a new question
        </div>

        <QuestionComposer
          isOpen={this.state.modalIsOpen}
          onClose={this.hideQuestionModal.bind(this)}
          onSave={this.onAddQuestion.bind(this, lectureKey, lecture)}
        />
      </div>
    );
  }
}

QuestionList.propTypes = {
  courseName: React.PropTypes.string,
  lectureKey: React.PropTypes.string,
  lecture: React.PropTypes.object,
  onAddQuestion: React.PropTypes.func,
  onRemoveLecture: React.PropTypes.func,
  onRemoveQuestion: React.PropTypes.func,
};

export default QuestionList;
