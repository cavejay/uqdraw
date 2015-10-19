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
require('../../css/components/Archive.scss');
require('../../css/components/Presenter.scss');

class Archive extends React.Component {
 constructor(props) {
    super(props);
    props.onChangeCourse(props.routeParams.courseId, props.routeParams.courseName);
    this.state = {
      subjects: [], // list of subject names
      lectures: {},
      userId: this.props.routeParams.userId,
    };
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onSubmitChange = this.onSubmitChange.bind(this);
    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
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
  onLectureChange() {
    this.setState({lectures: LectureStore.getAll(this.props.routeParams.courseId)});
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
      lectures =            
      <ArchiveLecture
            userId={this.props.routeParams.userId}
            courseName={this.props.courseName}
            courseKey={this.props.courseId}
          />
    }
    return (
      <div className='ArchiveView'>
        <Header>
        <div className='archiveName'> {this.props.routeParams.userId}'s Archives </div>
        </Header>

        <div className='top' ref='topSection' style={this.sectionStyle}>
          <div className='Column-Left'>
            <div className='Heading2'>Select</div>
            <div className='Heading1'>COURSE</div>
            <ArchiveList
              courseName={this.props.courseName}
              courseKey={this.props.courseId}
              userId={this.props.routeParams.userId}
              subjects={this.state.subjects}
              onChangeCourse={this.props.onChangeCourse}
            />
          </div>
            <div className='Column-Right'>
              {lectures}
            </div>


        </div>

      </div>
    );
  }
}
Archive.propTypes = {
  onChangeCourse: React.PropTypes.func,
};

export default Archive;
