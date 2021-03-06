import React from 'react';
import { Link } from 'react-router';
import Header from './Header.jsx';
import SubjectList from './SubjectList.jsx';
require('../../css/components/WelcomeView.scss');

import SubjectActions from '../actions/SubjectActions.js';
import SubjectStore from '../stores/SubjectStore.js';

import ComponentKey from '../utils/ComponentKey.js';
import API, {APIConstants} from '../utils/API.js';

class Welcome extends React.Component {
  // Welcome screen presented to the user once they have logged in. 

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
    this.initData = this.initData.bind(this);
    console.log('DID CONSTRUCT');
  }

  componentDidMount() {
    // Populate local state from store & setup Firebase observation.
    this.initData();

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

  // Set up all the data for the welcome screen
  initData() {
    //Get the User's ID from the route
    let userId = this.props.routeParams.userId;
    console.log('subjects = ', SubjectStore.getAll());

    //Update the handle to the subjects (connect it to the subject store)
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
  }

  onSubmitChange() {
    this.setState({ isSubmitting: SubjectStore.isSubmitting() });
  }

  // Callback to be passed to SubjectList child, is called when the user wants
  // to add a new subject to the list
  onAddSubject(subjectName) {
    let userId = this.props.routeParams.userId;
    SubjectActions.create(userId, subjectName);
  }

  render() {
    console.log('render()');
    console.log('subjects = ', this.state.subjects);
    return (
      <div className='RouteContainer'>
        <Header>
        <Link to='archive' params={{userId: this.props.routeParams.userId}} className='Stack-label'>
         <div className='Stack'>
            <img className='Stack-icon' src={require('../../images/basic_picture_multiple.svg')} />
            Archives
          </div>
          </Link>
        </Header>
        <div className='Welcome'>
          <div className='Marquee'>
            <h1 className='Marquee-Heading'>Welcome, {this.props.routeParams.userId}.</h1>
            <div className="Marquee-Subheading">Select the course the questions are for below, or add a new course.</div>
          </div>
          <SubjectList
            userId={this.props.routeParams.userId}
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
};

export default Welcome;
