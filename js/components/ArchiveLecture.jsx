import React from 'react';
import { Link } from 'react-router';
import Question from './Question.jsx';
import QuestionComposer from './QuestionComposer.jsx';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';

import API, {APIConstants} from '../utils/API.js';
require('../../css/components/QuestionManager.scss');

class ArchiveLecture extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lectures: {},
    };
    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
  }
  
    initData(courseKey) {
    if (courseKey) {
      this.setState({lectures: LectureStore.getAll(courseKey)});
console.log(this.state.lectures);
      API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
    }
  }
  
    onLectureChange() {
    this.setState({lectures: LectureStore.getAll(this.props.routeParams.courseId)});
  }

  render() {
    return (
        <table>
            <tr>
              <th>Lecture Name</th>
              <th></th>
            </tr>
            <tr>
              <td>sdfsd</td>
              <td><Link to="responses" className='Button--unstyled'>View Responses</Link></td>
            </tr>
          </table>
    );
  }
}

ArchiveLecture.propTypes = {
  courseName: React.PropTypes.string,
  courseKey: React.PropTypes.string,
  lectureKey: React.PropTypes.string,
  lecture: React.PropTypes.object,
};

export default ArchiveLecture;
