import React from 'react';
import config from '../config.js';
import ComponentKey from '../utils/ComponentKey.js';

require('../../css/components/Button.scss');

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
      questionKey: "",
      lectureKey: "",
      questionText: "Please wait while question loads",
    };
    this.ctx = undefined; // drawing canvas context
    this.onPresentationChange = this.onPresentationChange.bind(this);
    this.getResponderState = this.getResponderState.bind(this);
  }

  componentDidMount() {
    this.getResponderState();
    API.subscribe(APIConstants.responses, this.componentKey, this.state.lectureKey);
    API.subscribe(APIConstants.active, this.componentKey, this.props.routeParams.lectureCode);
    ResponderStore.addChangeListener(this.onPresentationChange);
  }

  componentDidUnmount() {
    API.unsubscribe(APIConstants.responses, this.componentKey, );
    API.unsubscribe(APIConstants.active, this.componentKey);
    ResponderStore.removeChangeListener(this.onPresentationChange);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.activeQuestionKey !== newProps.activeQuestionKey) {
      if (newProps.activeQuestionKey) {
        //activate question
        this.setState({isQuestionActive: true});
      } else {
        //deactivate question
        this.setState({isQuestionActive: false});
      }
    }
  }

  onPresentationChange() {
    this.getResponderState();
  }

  getResponderState() {
    console.log("[STORE] Updating state of component");
    this.setState(ResponderStore.refreshState());
    // this.setState({isSubmitting: ResponderStore.isSubmitting()});
  }

  // Submit the current canvas
  onSubmitImage(dataURL) {
    let response = {
      submitted: Date.now(),
      imageURI: dataURL,
    };
    let lectureKey = this.state.lectureKey;
    let questionKey = this.state.questionKey;
    let ref = ResponderActions.createResponse(lectureKey, questionKey, response);
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

    if (this.state.isQuestionActive || true) {
      markup = (
        <div>
          <div className='QuestionOverlay' style={questionStyle}>
            <div className="QuestionOverlay-content" >
              <h3>{this.state.questionText}</h3>
              <button className='Button' onClick={this.hideQuestion.bind(this)}>Tap To Start Drawing</button>
            </div>
          </div>

          <Drawing activeQuestionKey="1" onSubmitImage={this.onSubmitImage.bind(this)} isSubmitting={this.state.isSubmitting}/>
        </div>
      );
    }

    else {
      markup = (
        <div className='QuestionOverlay' style={questionStyle}>
        There is no currently active question. You must wait for your lecturer to start taking responses before you may draw.
        </div>
      );
    }

    return (
      <div className='Drawing'>
        {markup}
      </div>
    );
  }
}

Responder.propTypes = {
  activeQuestionKey: React.PropTypes.string,
};


export default Responder;
