import React from 'react';
import Header from './Header.jsx';
import { Link } from 'react-router';
import SubjectStore from '../stores/SubjectStore.js';
import API, {APIConstants} from '../utils/API.js';
import ArchiveList from './ArchiveList.jsx';
require('../../css/components/Table.scss');
require('../../css/components/Button.scss');
require('../../css/components/Colors.scss');


class Archive extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      subjects: [], // list of subject names
    };
     let userId = this.props.routeParams.userId;
         this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onSubmitChange = this.onSubmitChange.bind(this);
        this.initData = this.initData.bind(this);
    this.sectionStyle = {
      flexGrow: 1,
      textAlign: 'center',
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

  // Callback to be passed to SubjectList child
  onAddSubject(subjectName) {
    let userId = this.props.routeParams.userId;
    SubjectActions.create(userId, subjectName);
  }

  render() {

    return (
      <div className='ArchiveView'>
        <Header />
        <div className='topSection' ref='topSection' style={this.sectionStyle}>
            <h1 className='CodeHeading'>Archive Manager</h1>
            <div className='CodeSubheading'>Pick a course</div>
            </div>

          <ArchiveList
            userId={this.props.routeParams.userId}
            subjects={this.state.subjects}
            onAddSubject={this.onAddSubject}
            onChangeCourse={this.props.onChangeCourse}
          />
      </div>
    );
  }
}

export default Archive;
