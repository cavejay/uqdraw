import React from 'react';
import config from '../config.js';
import ComponentKey from '../utils/ComponentKey.js';

require('../../css/components/Button.scss');
require('../../css/components/Drawing.scss');
require('../../css/components/Canvas.scss');

import ResponderStore from '../stores/ResponderStore.js';
import ResponderActions from '../actions/ResponderActions.js';
import Drawing from '../components/Drawing.jsx';
import API, {APIConstants} from '../utils/API.js';

var statetypes = {
  badcode: -1,
  drawing: 0,
  openbutclosed: 1,
  open: 2,
  openSubmitted: 3,
}

var hasSubmitted = false;

class Responder extends React.Component {
  constructor(props) {
    super(props);
    this.componentKey = ComponentKey.generate();
    this.state = {
      lecID: undefined,
      activeQ: "NONE",
      lectureID: "",
      courseID: "",
      courseName: "~",
      lectureTitle: "~",
      questionText: "",
      state: statetypes.badcode,
    };
    this.ctx = undefined; // drawing canvas context
    this.onChange = this.onChange.bind(this);
    this.getResponderState = this.getResponderState.bind(this);
  }

  componentDidMount() {
    this.getResponderState();
    API.subscribe(APIConstants.responses, this.componentKey, this.state.lectureKey);

    //As some responders may type the URL rather than using the code entry,
    //can't assume that the code is uppercase at this point. Must convert it.
    let upperLecCode = this.props.routeParams.lectureCode.toUpperCase();

    API.subscribe(APIConstants.active, this.componentKey, upperLecCode);
    ResponderStore.addChangeListener(this.onChange);
  }

  componentDidUnmount() {
    API.unsubscribe(APIConstants.responses, this.componentKey, );
    API.unsubscribe(APIConstants.active, this.componentKey);
    ResponderStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.getResponderState();
  }

  startDrawing() {
    this.setState({state: statetypes.drawing});
    console.log('[USER] started drawing');
  }

  openCamera() {
    // This is here for dylan
  }

  getResponderState() {
    console.log("[STORE] Updating state of component");
    let oldActiveQ = this.state.activeQ;
    this.setState(ResponderStore.refreshState());

    // Update the state.state variable now
    if(this.state.questionText == '...') { // we're open but don't have deets
      this.state.state = statetypes.openbutclosed;
    }

    if(oldActiveQ !== this.state.activeQ) {
      hasSubmitted = false;
      this.state.state = statetypes.open;
    }

    if (this.state.questionText !== '...' && !hasSubmitted) { // it must be a new question
      this.state.state = statetypes.open;
    }

    if (hasSubmitted) {
      this.state.state = statetypes.openSubmitted;
    }

    if(this.state.activeQ == undefined) { // no active question thus a bad code
      this.state.state = statetypes.badcode;
    }

    if(this.state.questionText == "" || this.state.courseCode === "~") { // We're loading the page
      this.state.state = statetypes.loading;
    }

    this.setState({isSubmitting: ResponderStore.isSubmitting()});
  }

  // Submit the current canvas
  onSubmitImage(dataURL, isCorrect) {
    if(this.state.hasSubmitted === true) return;
    let response = {
    	isCorrect: isCorrect,
      submitted: Date.now(),
      imageURI: dataURL,
      client: {
        userid: auth_info.user,
        username: auth_info.name,
        appName: navigator.appCodeName,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        width: (function(){if(window.screen) return(screen.width); else return "Not Accessible"})(),
        height: (function(){if(window.screen) return(screen.height); else return "Not Accessible"})(),
      }
    };
    let lectureKey = this.state.lectureID;
    let questionKey = this.state.activeQ;
    let ref = ResponderActions.createResponse(lectureKey, questionKey, response);
    this.setState({state:  statetypes.openSubmitted});
    hasSubmitted = true;
  }

  getQuestion() {
    var title = (<h2 className='SectionLabel'>QUESTION</h2>);
    var questionModal;
    // This is where we return the bad code message
    if (this.state.state == statetypes.badcode) {
      questionModal = (
        <div className='badCodeDiv'>
          This is not the lecture you are looking for
          Click here to go back to the homepage
        </div>
      );

      // This screen will appear when the page first loads
    } else if(this.state.state == statetypes.loading) {
      questionModal = (
        <div className='loadingDiv'>
          Loading Content
        </div>
      );

      // This will appear if the student is currently drawing an answer
    } else if (this.state.state == statetypes.drawing) {
      questionModal = (
        <div className='questionDiv'>
          {title}
          <div className='questionTextDrawing'>
            {this.state.questionText}
          </div>
        </div>
      );
      // This is shown if there is an open and active lecture
    } else if (this.state.state == statetypes.open || this.state.state == statetypes.openbutclosed || this.state.state == statetypes.openSubmitted) {
      questionModal = (
        <div className='questionDiv'>
          {title}
          <div className='questionText'>
            {this.state.questionText}
          </div>
        </div>
      );
    }
    return questionModal;
  }

  getResponse() {
    var title = (<h2 className='SectionLabel'>RESPONSE</h2>);
    if (this.state.state == statetypes.badcode) return;
    else if (this.state.state == statetypes.open) { // There's an open & active question!
      return (
        <div className='responseDiv'>
          {title}
          <div className='responseButton' onClick={this.startDrawing.bind(this)}>
            Tap to Draw
          </div>
          <div className='responseButton' onClick={this.openCamera.bind(this)}>
            Tap to Take a Picture
          </div>
        </div>
      );
    } else if (this.state.state == statetypes.openbutclosed) { // There's an open but closed question!
      return (
        <div className='responseDiv'>
          {title}
          <div className='questionNotOpenDiv'>
            Please wait for the lecturer to begin taking responses
          </div>
        </div>
      );
    } else if (this.state.state == statetypes.drawing) { // There's a question being answered
      return (
        <div classname='responseDiv'>
          // <Drawing isQuestionOpen={this.state.isQuestionOpen} onSubmitImage={this.onSubmitImage.bind(this)} isSubmitting={this.state.isSubmitting}/>
          <div className='reponseButton' onClick={this.onSubmitImage.bind(this)}>
            Tap to Submit
          </div>
        </div>
      );
    } else if (this.state.state == statetypes.openSubmitted) {
      return (
        <div className='responseDiv'>
          {title}
          <div>
            You've submitted a picture! congrats
          </div>
        </div>
      );
    }
  }

  render() {
    let markup;

    var activeStyle = {backgroundColor: '#fff'};
    var smallStyle = (this.state.lineWidth === 's') ? activeStyle : {};
    var mediumStyle = (this.state.lineWidth === 'm') ? activeStyle : {};
    var largeStyle = (this.state.lineWidth === 'l') ? activeStyle : {};

    return (
      <div className='Drawing'>
        <div className='headerBar'>
            <div className='headerText'>
                <h3>{this.state.courseName}</h3>
                <h4 id="lectureName">{this.state.lectureTitle}</h4>
            </div>
        </div>
        <div className='content'>
          {this.getQuestion()}
          {this.getResponse()}
        </div>
      </div>
    );
  }
}

Responder.propTypes = {
  activeQuestionKey: React.PropTypes.string,
};


export default Responder;
