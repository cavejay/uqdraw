import React from 'react';
import { Link } from 'react-router';
import Question from './Question.jsx';
import QuestionComposer from './QuestionComposer.jsx';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';
import ComponentKey from '../utils/ComponentKey.js';
import ArchiveQuestions from './ArchiveQuestions.jsx';
import API, {APIConstants} from '../utils/API.js';

require('../../css/components/Button.scss');
require('../../css/components/Archive.scss');
require('../../css/components/QuestionManager.scss');

class LectureLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.sectionStyle = {
      flexGrow: 1,
      textAlign: 'center',
      margin: 10,
      width: 200,
    };

  }

  onCurrentLecture(key) {
    this.props.onCurrentLecture(key);
  }

  render() {
  let {courseKey, lectureKey, lecture, ...delegateProps} = this.props;
    return (
        <div className='ListItem' style={this.sectionStyle}
          onClick ={this.onCurrentLecture.bind(this,lectureKey)}>
          {lecture.title}
        </div>

    );
  }
}

LectureLinks.propTypes = {
  to: React.PropTypes.string,
  lectureKey: React.PropTypes.string,
  onCurrentLecture: React.PropTypes.func,
  children: React.PropTypes.node,
};

class ArchiveLecture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lectures: {},
      courseKey: this.props.courseKey,
       activeLectureKey: undefined,
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

  onCurrentLecture(key) {
    this.setState({activeLectureKey: key}); //Store key of the new selected lecture 
  }

  render() {
		let lectureLinks;
    let {courseKey, lectureKey, lecture, ...delegateProps} = this.props;
    if (this.state.activeLectureKey) {
       var currentLectureQuestions = 
          <ArchiveQuestions
            key={this.state.activeLectureKey}
            userId = {this.props.userId}
            courseId={this.state.courseKey}
            lectureId={this.state.activeLectureKey}
            lecture={this.state.lectures[this.state.activeLectureKey]}
          />

    }
      if (this.state.lectures) {
      lectureLinks = Object.keys(this.state.lectures).map((lectureKey) => {
        return (
          <LectureLinks
            key={lectureKey}
            userId = {this.props.userId}
            courseKey={this.props.courseKey}
            lectureKey={lectureKey}
            lecture={this.state.lectures[lectureKey]}
            onCurrentLecture={this.onCurrentLecture.bind(this)} 
          />

        );
      });

    }

    return (
      <div className='top' ref='topSection' style={this.sectionStyle}>
          <div className='Column-Left'>
            <div className='Heading2'>Select</div>
            <div className='Heading1'>LECTURE</div>
             {lectureLinks}
          </div>
            <div className='Column-Right'>
                {currentLectureQuestions}
            </div>
        </div>
       



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
