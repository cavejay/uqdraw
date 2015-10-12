import React from 'react';

class PresenterResponses extends React.Component {

  onThumbnailClick(key, event) {
    event.preventDefault();
    this.props.onThumbnailClick(key);
  }

  render() {
    this.styles = {
      container: {
        textAlign: 'center',
        color: '#ccc',
        justifyContent: 'center',
      },
      responses: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 20,
        marginRight: 10,
      },
      response: {
        marginRight: 10,
      },
      correctResponse: {
		    border: '2px solid #0f0',
      },

    };

    let thumbnails = Object.keys(this.props.responses).map((responseKey) => {
      if (this.props.responses[responseKey].isCorrect == true){
       return (
        <a key={responseKey} href="" onClick={this.onThumbnailClick.bind(this, responseKey)}>
          <img className='Thumbnail' style={this.styles.correctResponse} src={this.props.responses[responseKey].imageURI}/>
        </a>      );
      } else {
       return (
        <a key={responseKey} href="" onClick={this.onThumbnailClick.bind(this, responseKey)}>
          <img className='Thumbnail' src={this.props.responses[responseKey].imageURI}/>
        </a>      );
        }
    });

    if (thumbnails.length) { //There are some responese to show
      return (
        <div className="ResponseThumbnails">
          <div style={this.styles.container}>
            <div style={this.styles.responses}>{thumbnails}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="NoResponsesMessage"> 
          There are no responses to show. 
        </div>
      );
    }

    
  }
}

PresenterResponses.propTypes = {
  onThumbnailClick: React.PropTypes.func.isRequired,
  responses: React.PropTypes.object.isRequired,
};

export default PresenterResponses;
