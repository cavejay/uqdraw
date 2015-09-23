import React from 'react';
import Header from './Header.jsx';
import PresenterResponses from './PresenterResponses.jsx';
let Firebase = require('firebase');
import config from '../config.js';
import Modal from 'react-modal';
//Little way to set up modals as in other files.
var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class Responses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: [], // array of lecture responses
               isResponseModalOpen: false,
               responseModalKey: undefined,
    };
        this.sectionStyle = {
      flexGrow: 1,
      textAlign: 'center',
    };
  }

  componentDidMount() {
    this.observeFirebaseResponses();
  }

  observeFirebaseResponses() {
    this.responsesRef = new Firebase(`${config.firebase.base}/presentations/3fa/responses`);
    this.responsesRef.on('value', (snapshot) => {
      let responses = snapshot.val() || {};
      responses = Object.keys(responses).map((key) => {
        return responses[key].submissionDataURI;
      });
      this.setState({ responses });
    });
  }

      onThumbnailClick(key) {
    this.setState({responseModalKey: key});
    this.showResponseModal();
  }

  showResponseModal() {
    this.setState({isResponseModalOpen: true});
  }

  hideResponseModal() {
    this.setState({isResponseModalOpen: false});
  }

  
  render() {
    let style = {
      maxWidth: 800,
      display: 'flex',
      alignItems: 'flex-start',
      margin: '0 auto',
      flexDirection: 'column',
    };

    let thumbStyle = {
      marginRight: '1em',
      marginBottom: '1em',
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: 4,
    };

    let thumbContainerStyle = {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    };

    let thumbnails = this.state.responses.map((uri) => {
      return <img width='250' style={thumbStyle} src={uri} />;
    });
  
      let activeResponses;
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      if (this.state.responses) {
        activeResponses = this.state.responses[this.state.activeQuestionKey];
      }
    }
    let responseSrc;
    let key = this.state.responseModalKey;
    if (key && activeResponses) {
      responseSrc = activeResponses[key].imageURI; //Set in previous conditional
    }
    return (
      <div className='ResponsesView'>
                  {/* Markup for displaying responses in a modal view */}
        <Modal className='Modal--Response' isOpen={this.state.isResponseModalOpen} onRequestClose={this.hideResponseModal.bind(this)}>
          <a onClick={this.hideResponseModal.bind(this)} className='Modal__cross'>&times;</a>
          <div className='Response-Modal-Centerer'>
            <span className='Image-Layout-Helper'/><img className='Response-Modal-Image' src={responseSrc}/>
          </div>
        </Modal>
        <Header />
        <div className='MainContainer'>
                    <div className='top' ref='topSection' style={this.sectionStyle}>
            <h1 className='CodeHeading'>COMS3200: Introduction</h1>
    	</div>
          {/* Responses */}
            <div className="ResponseThumbnails">
              <PresenterResponses responses={activeResponses || {}} onThumbnailClick={this.onThumbnailClick.bind(this)}/>
            </div>
          
        

        </div>
      </div>
    );
  }
}

export default Responses;
