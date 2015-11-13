import React from 'react';

class QuestionSelector extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      questionSelector: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: '200px 0 1',
        fontSize: 20,
        fontWeight: 200,
      },
      list: {
      },
      listItem: {
        display: 'flex',
        justifyContent: 'center',
        borderBottom: 'solid 1px #ddd',
        padding: '20px 10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }
    };

    this.state = {
      styles: this.styles,
    };
  }

  onActivateQuestion(key) {
    this.props.onActivateQuestion(key);
  }

  render() {
    // Create a formatted list of question elements that users can use
    // to select the question they want to take answers for

    //For all of the questions in the list (these are already ordered)
    let questions = this.props.questions.map((question, index) => {
      //Set the default class name to just "PersenterListItem", as all
      //elements will have this class name
      let className = 'PresenterListItem';

      //If this is the selected question, also add the active class, so
      //that it can be formatted differently to display this that it has
      //been selected
      if (question.key === this.props.activeQuestionKey) {
        className += ' PresenterListItem--active';
      }

      //Return the JSX markup for the element of the question selector.
      return (
        <div key={question.key} className={className} onClick={this.onActivateQuestion.bind(this, question.key)}>
          <span className="PresenterListItem-QuestionNumber">Q{index+1}:</span>
          <span className="PresenterListItem-QuestionText"> {question.value}</span>
        </div>);
    });

    return (
      <div className='PresenterList'>
        {questions}
      </div>
    );
  }
}

export default QuestionSelector;
