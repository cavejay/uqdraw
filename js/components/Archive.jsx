import React from 'react';
import Header from './Header.jsx';
import { Link } from 'react-router';
import SubjectStore from '../stores/SubjectStore.js';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';
import API, {APIConstants} from '../utils/API.js';
import ArchiveList from './ArchiveList.jsx';
import ArchiveLecture from './ArchiveLecture.jsx';
require('../../css/components/Table.scss');
require('../../css/components/Button.scss');
require('../../css/components/Colors.scss');


class Archive extends React.Component {
 constructor(props) {
    super(props);
    props.onChangeCourse(props.routeParams.courseId, props.routeParams.courseName);
    this.state = {
      subjects: [], // list of subject names
      currentCourse: "sad",
      lectures: {},
    };
    let userId = this.props.routeParams.userId;
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onSubmitChange = this.onSubmitChange.bind(this);
    this.initData = this.initData.bind(this);
    
    
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
  }
   componentDidMount() {
    // Populate local state from store & setup Firebase observation.
    this.initData();
    // Listen for store changes
    SubjectStore.addChangeListener(this.onSubjectChange);
    SubjectStore.addChangeListener(this.onSubmitChange);
  }

  componentWillReceiveProps(newProps) {
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    let userId = this.props.routeParams.userId;
    SubjectStore.removeChangeListener(this.onSubjectChange);
    SubjectStore.removeChangeListener(this.onSubmitChange);
    API.unsubscribe(APIConstants.subjects, this.componentKey, userId);
  }

  initData() {
    let userId = this.props.routeParams.userId;

    this.setState({
      subjects: SubjectStore.getAll(),
      isSubmitting: SubjectStore.isSubmitting(),
    }, () => {
    });
    API.subscribe(APIConstants.subjects, this.componentKey, userId);
  }

  onSubjectChange() {
    this.setState({ subjects: SubjectStore.getAll() });
  }

  onSubmitChange() {
    this.setState({ isSubmitting: SubjectStore.isSubmitting() });
  }

  render() {
    let lectures;
    if (this.props.courseName) {
    console.log(this.props.courseId);
      lectures =            <ArchiveLecture
            courseName={this.props.courseName}
            courseKey={this.props.courseId}
            userId={this.props.routeParams.userId}
          />
    }
    return (
      <div className='ArchiveView'>
        <Header />
        <div className='top' ref='topSection' style={this.sectionStyle}>
            <h1 className='CodeHeading'>Archive Manager</h1>
            <div className='CodeSubheading'>Pick a course</div>
    	</div>

          <ArchiveList
            courseName={this.props.courseName}
            courseKey={this.props.courseId}
            userId={this.props.routeParams.userId}
            subjects={this.state.subjects}
            onChangeCourse={this.props.onChangeCourse}
          />
        <div ref='divider' style={this.divider}></div>
        <div className='CodeSubheading' style={this.sectionStyle}>{this.props.courseName} Lecture Sessions</div>
        <div className='MainContainer' style={this.tableStyle}>
          {lectures}
          </div>
      </div>
    );
  }
}
Archive.propTypes = {
  onChangeCourse: React.PropTypes.func,
};

export default Archive;
