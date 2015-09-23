import React from 'react';
import Question from './Question.jsx';
import {Button} from './UI.jsx';
let Modal = require('react-modal');
require('../../css/components/QuestionManager.scss');

class LectureRemover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lecture: '',
      inputHasText: false,
    };
  }

  onSave() {
    this.props.onSave(this.state.lecture);
    //this.setState({lecture: '', inputHasText: false});
  }

  render() {
    let {isOpen, onClose} = this.props;
    let labelClass = 'TransparentLabel';
    if (this.state.inputHasText) {labelClass += ' TransparentLabel--hidden'; }

    return (
      <Modal isOpen={isOpen} className='Modal--lectureComposer'>
        <a onClick={onClose} href="#" className='Modal__cross'>&times;</a>
          <div className='Slat'>
          <h3> Are you sure you want to delete this course? </h3>
            <button className='Button Button--secondary' type="submit" onClick={this.onSave.bind(this)}>Yes</button>
         	<button className='Button Button--secondary' type="submit" onClick={onClose}>No</button>
          </div>

      </Modal>
    );
  }
}

LectureRemover.propTypes = {
    onSave: React.PropTypes.func,
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func,
};

export default LectureRemover;
