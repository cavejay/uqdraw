import React from 'react';
import config from '../config.js';
import ComponentKey from '../utils/ComponentKey.js';

require('../../css/components/Button.scss');
require('../../css/components/Drawing.scss')

import ResponderStore from '../stores/ResponderStore.js';
import ResponderActions from '../actions/ResponderActions.js';
import Drawing from '../components/Drawing.jsx';
import API, {APIConstants} from '../utils/API.js';

class Responder extends React.Component {
  constructor(props) {
    super(props);
    this.componentKey = ComponentKey.generate();
    this.state = {
      lecID: undefined,
      isQuestionOpen: true,
      activeQ: "",
      lectureID: "",
      courseID: "",
      courseName: "TEST0000: Lecture Name ...",
      questionText: "Please wait while question loads",
      isSubmitting: false,
    };
    this.ctx = undefined; // drawing canvas context
    this.onPresentationChange = this.onPresentationChange.bind(this);
    this.getResponderState = this.getResponderState.bind(this);
  }

  componentDidMount() {
    this.getResponderState();
    API.subscribe(APIConstants.responses, this.componentKey, this.state.lectureKey);

    //As some responders may type the URL rather than using the code entry,
    //can't assume that the code is uppercase at this point. Must convert it.
    let upperLecCode = this.props.routeParams.lectureCode.toUpperCase();

    API.subscribe(APIConstants.active, this.componentKey, upperLecCode);
    ResponderStore.addChangeListener(this.onPresentationChange);
  }

  componentDidUnmount() {
    API.unsubscribe(APIConstants.responses, this.componentKey, );
    API.unsubscribe(APIConstants.active, this.componentKey);
    ResponderStore.removeChangeListener(this.onPresentationChange);
  }

  onPresentationChange() {
    this.getResponderState();
  }

  getResponderState() {
    console.log("[STORE] Updating state of component");
    this.setState(ResponderStore.refreshState());
    this.setState({isSubmitting: ResponderStore.isSubmitting()});
  }

  // Submit the current canvas
  onSubmitImage(dataURL, isCorrect) {
    let response = {
    	isCorrect: isCorrect,
      submitted: Date.now(),
      imageURI: dataURL,
      client: {
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
    this.state.isSubmitting = true;
  }

  hideQuestion() {
    this.setState({ isQuestionOpen: false });

  }

  render() {
    let markup;

    var activeStyle = {backgroundColor: '#fff'};
    var smallStyle = (this.state.lineWidth === 's') ? activeStyle : {};
    var mediumStyle = (this.state.lineWidth === 'm') ? activeStyle : {};
    var largeStyle = (this.state.lineWidth === 'l') ? activeStyle : {};

    if (!this.state.isQuestionOpen)
      var questionStyle = {display: 'none'};

    if (this.state.activeQ !== "") {
      markup = (
        <div>
          <div className='QuestionOverlay' style={questionStyle}>
            <div className="QuestionOverlay-content" >
              <h3>{this.state.questionText}</h3>
              <button className='Button' onClick={this.hideQuestion.bind(this)}>Tap To Start Drawing</button>
            </div>
          </div>

          <Drawing isQuestionOpen={this.state.isQuestionOpen} onSubmitImage={this.onSubmitImage.bind(this)} isSubmitting={this.state.isSubmitting}/>
        </div>
      );
    }

    else {
      // TODO Stick a cute picture in here somewhere
      markup = (
        <div className='QuestionOverlay noQuestion' style={questionStyle}>
          <div className='QuestionOverlay-content'>
            Your lecturer must be currently taking responses for you to submit a drawing.
            <br></br>
            <br></br>
            If this doesn't change for an extended period of time please check that the last 3 characters of your url matches those shown on your lecturer's screen.
          </div>
        </div>

      );
    }

    return (
      <div className='Drawing'>
        <div className='headerBar'>
          <h3>{this.state.courseName}</h3>
        </div>
        {markup}
        <div className='headerQuestion'> {"Question: "+this.state.questionText} </div>
      </div>
    );
  }
}

Responder.propTypes = {
  activeQuestionKey: React.PropTypes.string,
};


export default Responder;
