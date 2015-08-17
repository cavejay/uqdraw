import React from 'react';

import Header from './Header.jsx';
import SubjectList from './SubjectList.jsx';
require('../../css/components/WelcomeView.scss');

import SubjectActions from '../actions/SubjectActions.js';
import SubjectStore from '../stores/SubjectStore.js';

import ComponentKey from '../utils/ComponentKey.js';
import API, {APIConstants} from '../utils/API.js';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.componentKey = ComponentKey.generate();
    this.state = {
      subjects: [], // list of subject names
    };

    // Ensure the receiver for the various callbacks is the current object.
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onSubmitChange = this.onSubmitChange.bind(this);
    this.onAddSubject = this.onAddSubject.bind(this);
    this.onRemoveSubject = this.onRemoveSubject.bind(this);
    this.initData = this.initData.bind(this);



    console.log('DID CONSTRUCT');
  }

  componentDidMount() {
    // Populate local state from store & setup Firebase observation.
    this.initData();

    console.log('DID MOUNT');
    console.log('subjectsNow = ', SubjectStore.getAll());
    // Listen for store changes
    SubjectStore.addChangeListener(this.onSubjectChange);
    SubjectStore.addChangeListener(this.onSubmitChange);
  }

  componentWillReceiveProps(newProps) {
    console.log('WILL RECEIVE PROPS');
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    console.log('DID UNMOUNT');
    let userId = this.props.routeParams.userId;
    SubjectStore.removeChangeListener(this.onSubjectChange);
    SubjectStore.removeChangeListener(this.onSubmitChange);
    API.unsubscribe(APIConstants.subjects, this.componentKey, userId);
  }

  initData() {
    let userId = this.props.routeParams.userId;
    console.log('USERID = ', userId);
    console.log('subjects = ', SubjectStore.getAll());

    this.setState({
      subjects: SubjectStore.getAll(),
      isSubmitting: SubjectStore.isSubmitting(),
    }, () => {
      console.log('cb subjects = ', this.state.subjects);
    });
    API.subscribe(APIConstants.subjects, this.componentKey, userId);
  }

  onSubjectChange() {
    this.setState({ subjects: SubjectStore.getAll() });
    console.log('subjectchange');
  }

  onSubmitChange() {
    this.setState({ isSubmitting: SubjectStore.isSubmitting() });
    console.log('submitchange');
  }

  // Callback to be passed to SubjectList child
  onAddSubject(subjectName) {
    let userId = this.props.routeParams.userId;
    SubjectActions.create(userId, subjectName);
  }

  onRemoveSubject(subjectName) {
    let userId = this.props.routeParams.userId;
    SubjectActions
  }

  render() {
    console.log('render()');
    console.log('subjects = ', this.state.subjects);
    return (
      <div className='RouteContainer'>
        <Header />
        <div className='Welcome'>
          <div className='Marquee'>
            <h1 className='Marquee-Heading'>Welcome, Lecturer.</h1>
            <div className="Marquee-Subheading">Select the course the questions are for below, or add a new course.</div>
          </div>
          <SubjectList
            subjects={this.state.subjects}
            onAddSubject={this.onAddSubject}
            onChangeCourse={this.props.onChangeCourse}
          />
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {
  onAddSubject: React.PropTypes.func,
  onChangeCourse: React.PropTypes.func,
  onRemoveSubject: React.PropTypes.func,
};

export default Welcome;
