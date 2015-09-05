import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Route, RouteHandler } from 'react-router';

import config from './config.js';
import Welcome from './components/Welcome.jsx';
import QuestionManager from './components/QuestionManager.jsx';
import Presenter from './components/Presenter.jsx';
import Answer from './components/Answer.jsx';
import StartView from './components/StartView.jsx';
import Archive from './components/Archive.jsx';
import Responses from './components/Responses.jsx';
let Firebase = require('firebase');

require('../css/main.css');
require('../node_modules/normalize.css/normalize.css');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: undefined,
      courseId: undefined,
      courseName: undefined,
      activeQuestionKey: undefined,
    	lecID: undefined,
    };
    this.onChangeCourse = this.onChangeCourse.bind(this);
  }

  onChangeCourse(courseId, courseName) {
    if (!courseId && courseName) {
      let ref = new Firebase(config.firebase.base + '/courseLists/' + this.state.userId);
      ref.orderByValue().equalTo(courseName).once('value', (snapshot) => {
        let content = snapshot.val();
        let firstKey = Object.keys(content)[0];
        this.setState({courseId: firstKey, courseName: content[firstKey]});
      });
    } else {
      this.setState({courseId: courseId, courseName: courseName});
    }
  }

  render() {
    return (
      <div className="App">
        <RouteHandler {...this.state} onChangeCourse={this.onChangeCourse} routeParams={this.props.routeParams}/>
      </div>
    );
  }
}

// These define the routes for the application. The particular route that
// matches will lead to the handler component being recursivley rendered
// and the resultant tree being mounted to where <RouteHandler/> appears in
// the App component above (line 12 atm).
let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="questionManager" handler={QuestionManager} path="/:courseName/question-manager"/>
    <Route name="welcome" handler={Welcome} path="/welcome/:userId" />
    <Route name="drawing" handler={Answer} path="/drawing/:lectureCode"/>
    <Route name="presenter" handler={Presenter} path="/:courseId/:lectureId"/>
    <Route name="archive" handler={Archive} path="/archive" />
    <Route name="responses" handler={Responses} path="/responses" />
    {/* <Route name="test" handler={Test} path="/test" /> */}
    <DefaultRoute handler={StartView}/>
  </Route>
);

Router.run(routes, function(Handler, state) {
  React.render(<Handler routeParams={state.params}/>, document.querySelector('#react'));
});
