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
		border: '1px solid #0f0',
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

    return (
      <div style={this.styles.container}>
        <div style={this.styles.responses}>{thumbnails}</div>
      </div>
    );
  }
}

PresenterResponses.propTypes = {
  onThumbnailClick: React.PropTypes.func.isRequired,
  responses: React.PropTypes.object.isRequired,
};

export default PresenterResponses;
