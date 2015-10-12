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
    let questions = this.props.questions.map((question, index) => {
      let className = 'PresenterListItem';
      if (question.key === this.props.activeQuestionKey) {
        className += ' PresenterListItem--active';
      }
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
