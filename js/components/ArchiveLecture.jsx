import React from 'react';
import { Link } from 'react-router';
import Question from './Question.jsx';
import QuestionComposer from './QuestionComposer.jsx';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';
import ComponentKey from '../utils/ComponentKey.js';

import API, {APIConstants} from '../utils/API.js';
require('../../css/components/QuestionManager.scss');

class LectureLinks extends React.Component {

  render() {
  let {courseKey, lectureKey, lecture, ...delegateProps} = this.props;
    return (
    	<tr>
       		<td>{lecture.title}</td>
			<td><Link to="responses" params={{courseName: this.props.courseName, courseId: courseKey, lectureId: lectureKey}} className='Button--unstyled'>View Responses</Link></td>
       	</tr>
    );
  }
}

LectureLinks.propTypes = {
  to: React.PropTypes.string,
  courseName: React.PropTypes.string,
  courseId: React.PropTypes.string,
  children: React.PropTypes.node,
  onChangeCourse: React.PropTypes.func,
};

class ArchiveLecture extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lectures: {},
    };
    this.componentKey = ComponentKey.generate();
    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
  }
    componentDidMount() {
    // Listen for store changes
    LectureStore.addChangeListener(this.onLectureChange);

    // Initialise store data
    this.initData(this.props.courseKey);
  }

  componentWillReceiveProps(newProps) {
    // Initialise store data
    this.initData(this.props.courseKey);
  }

  componentWillUnmount() {
    LectureStore.removeChangeListener(this.onLectureChange);
    API.unsubscribe(APIConstants.lectures, this.componentKey, this.props.courseKey);
  }
	initData(courseKey) {
	 if (courseKey) {
    	this.setState({lectures: LectureStore.getAll(courseKey)});
    	API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
    }
  }
  
  onLectureChange() {
    this.setState({lectures: LectureStore.getAll(this.props.courseKey)});
  }

  render() {
		let lectureLinks;
      if (this.state.lectures) {
      lectureLinks = Object.keys(this.state.lectures).map((lectureKey) => {
        return (
        <LectureLinks
            key={lectureKey}
            courseKey={this.props.courseKey}
            lectureKey={lectureKey}
            lecture={this.state.lectures[lectureKey]}
          />
        );
      });
    }

    return (
        <table>
            <tr>
              <th>Lecture Name</th>
              <th></th>
            </tr>
              {lectureLinks}
          </table>
    );
  }
}

ArchiveLecture.propTypes = {
  courseName: React.PropTypes.string,
  courseKey: React.PropTypes.string,
  lectureKey: React.PropTypes.string,
  lecture: React.PropTypes.object,
    router: React.PropTypes.func,
};

export default ArchiveLecture;
