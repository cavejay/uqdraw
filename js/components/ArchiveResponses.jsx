import React from 'react';

class ArchiveResponses extends React.Component {

  onThumbnailClick(key, event) {
    event.preventDefault();
    this.props.onThumbnailClick(key);
  }

  render() {
    console.log(this.props.date)
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
                var newDate = new Date(this.props.responses[responseKey].submitted);
          var newDateMonth = newDate.toDateString();
      if ((this.props.responses[responseKey].isCorrect == true) && (this.props.date==newDateMonth)){
       return (
        <a key={responseKey} href="" onClick={this.onThumbnailClick.bind(this, responseKey)}>
          <img className='Thumbnail' style={this.styles.correctResponse} src={this.props.responses[responseKey].imageURI}/>
        </a>      );
      } else if (this.props.date==newDateMonth){
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

ArchiveResponses.propTypes = {
  onThumbnailClick: React.PropTypes.func.isRequired,
  responses: React.PropTypes.object.isRequired,
};

export default ArchiveResponses;
