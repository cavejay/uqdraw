import React from 'react';
import Touchy from '../touchy.js';
import config from '../config.js';
let Spinner = require('react-spinkit');

require('../../css/components/Drawing.scss');
require('../../css/components/Canvas.scss');
require('../../css/components/Button.scss');

class Drawing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEraserActive: false,
      lineWidth: 'm',
      isFullscreen: false,
      isCorrectActive: false,
    };
    this.ctx = undefined; // drawing canvas context

  }

  componentDidMount() {
    // prevents 'pull-to-refresh' on mobile browsers firing while drawing.
    document.body.classList.add('noScrollOnOverflow');

    React.findDOMNode(this).addEventListener('webkitfullscreenchange', () => {
      // Need to reinit state after fullscreen, chrome is losing state all over
      // the place. No description of what they are doing.
      setTimeout(() => {
        this.initializeCanvases();
        this.initializeTouchy();
      }, 1000); // t/o required as event is fired before it is fullscreened.
    });

    // Setup the presentation canvas
    let displayCanvas = React.findDOMNode(this.refs.displayCanvas);
    let displayCtx = displayCanvas.getContext('2d');
    this.displayCanvas = displayCanvas; // need access for saving img
    this.displayCtx = displayCtx;

    // Setup the drawing canvas that will actually capture the drawing input
    // before transferring it to the presentation canvas
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx; // put on the React Component so methods can access it

    this.initializeCanvases();
    this.initializeTouchy();  // sets up touch event handling for drawing input.
  }

  componentWillUnmount() {
    // TODO: probably memory leaks from the Touchy event handlers
    document.body.classList.remove('noScrollOnOverflow');
  }

  initializeCanvases() {
    // Canvases have to have their widths hard-set to prevent distortion
    // through scaling.
    this.setCanvasWidths();

    // Set up the default drawing tools. These are changed by the user
    // when the drawing window is shown.
    this.setLineWidth('m');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#333333';
  }


  // When a click is made, will need to work out the mid point of the dot that
  // is to be draw, for the most accurate and consistent drawing experience.
  // This function gives a quick way to calculate the midpoint.
  computeMidpoint(point1, point2) {
    var midpoint = {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
    };
    return midpoint;
  }

  // Triggerd when the user draws on the screen, begins calculating the
  // drawing of smooth lines as the finger or pointer is dragged across
  // the screen.
  //
  // As the refresh rate of the touch sensing is not high enough to draw
  // perfectly smooth lines, quadradic curves are used to join each of 
  // the points, for a smooth line (rather than straight lines between
  // points which provides a sub-par experience)
  fingerTouchedScreen(hand, finger, displayCtx, ctx, canvas) {
    var points = this.points;
    if (hand.fingers.length > 1) return; // only deal with single finger.

    // Setup event listeners for the finger that caused the event firing.
    finger.on('start', (point) => {
      points = [];
      points.push({x: point.x, y: point.y+offset});
    });

    var offset = -101;
    // Wiping version
    finger.on('move', (point) => {
      points.push({x: point.x, y: point.y+offset});

      // Wipe the canvas clean on each move event, allows making single path
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Starting two points of the path.
      var point1 = points[0];
      var point2 = points[1];

      // Begin the path creation.
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);

      // Add all points to the bath using quadratic bezier
      for (var i = 1; i < points.length; i++) {
        // Make path end be the midpoint, with control point at p1.
        var mid = this.computeMidpoint(point1, point2);
        ctx.quadraticCurveTo(point1.x, point1.y, mid.x, mid.y);
        point1 = points[i];
        point2 = points[i+1];
      }

      // Last point as straight line for now, next move event will smooth it.
      ctx.lineTo(point1.x, point1.y);
      ctx.stroke();
    });

    finger.on('end', (point) => {
      // Transfer image from drawing to display canvas + clear drawing canvas.
      displayCtx.drawImage(canvas, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
  }

  //Set up the engine used for sensing drawing on the canvas.
  initializeTouchy() {
    this.points = []; // list of all touch points in the current movement

    var toucher = Touchy(this.canvas, true, (hand, finger) => {
      this.fingerTouchedScreen(hand, finger, this.displayCtx, this.ctx, this.canvas);
    });
  }

  //Resizing of the window can cause issues in the display of the canvas, 
  //to prevent this, the canvas widths are calculated and hard set using
  //this funciton. It is called when this component is initialised.
  setCanvasWidths() {
    // Must set DOM properties, as CSS styling will distory otherwise.
    this.displayCanvas.width = parseInt(getComputedStyle(this.displayCanvas).width, 10);
    this.displayCanvas.height = parseInt(getComputedStyle(this.displayCanvas).height, 10);
    this.canvas.width = this.displayCanvas.width;
    this.canvas.height = this.displayCanvas.height;
  }

  // Turns the eraser on or off (depending on the current state). Eraser is 
  // enabled by changing the color of the drawing tool to the color of the 
  // background.
  toggleEraser() {
    if (!this.state.isEraserActive) {
      this.ctx.strokeStyle = '#F7FAFE';
    } else {
      this.ctx.strokeStyle = '#333333';
    }

    this.setState({ isEraserActive: !this.state.isEraserActive });
  }

  // Users and select if they think they have a correct answer. This function
  // toggels the isCorrectActive state item.
	toggleCorrect() {
       if (!this.state.isCorrectActive) ;
    else                           ;
    this.setState({ isCorrectActive: !this.state.isCorrectActive });
  }

  //Removes all of the drawings from the canvas.
  clearCanvas() {
    var ctx = this.displayCtx;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  // Sets the line width for the canvas and stores the state on the component
  setLineWidth(size) { // size is 's' | 'm' | 'l'
    let lineWidth;
    if (size === 's') lineWidth = 3;
    if (size === 'm') lineWidth = 5;
    if (size === 'l') lineWidth = 10;
    this.ctx.lineWidth = lineWidth;

    this.setState({
      lineWidth: size
    });
  }

  // Cycles the line width to the next size in the list.
  cycleLineWidth() {
    if      (this.state.lineWidth === 's') this.setLineWidth('m');
    else if (this.state.lineWidth === 'm') this.setLineWidth('l');
    else if (this.state.lineWidth === 'l') this.setLineWidth('s');
  }

  // Submit the current canvas
  onSubmitImage() {
    let dataURL = this.displayCanvas.toDataURL(); // canvas encoded as dataURI
    let isCorrect = this.state.isCorrectActive;
    this.props.SubmitImage(dataURL, isCorrect);
  }

  // Used for automatic question display flow. When the lecture moves from
  // having an active question to having no active question (triggered by
  // a remote event), this is called, disabling the ability for users to
  // submit responses.
  hideQuestion() {
    this.setState({ isQuestionOpen: false });
    clearCanvas();
  }

  fullscreen() {
    React.findDOMNode(this).webkitRequestFullscreen();
    this.setState({ isFullscreen: true });
  }

  render() {
    let markup;
    var eraserStyle = {};

    if (this.state.isEraserActive)
      eraserStyle = { backgroundImage: 'url(../../images/eraser-active.svg)' };

    var correctStyle = {};
    if (this.state.isCorrectActive) {
      correctStyle = { backgroundImage: 'url(../../images/thumbsup-active.png)' };
    } else {
      correctStyle = { backgroundImage: 'url(../../images/thumbsup.png)' };
    }

    var clearStyle = {};

    var activeStyle = {backgroundColor: '#fff'};
    var smallStyle = (this.state.lineWidth === 's') ? activeStyle : {};
    var mediumStyle = (this.state.lineWidth === 'm') ? activeStyle : {};
    var largeStyle = (this.state.lineWidth === 'l') ? activeStyle : {};

    if (this.state.isFullscreen)
      var fullscreenStyle = {display: 'none'};

    var submitText = "Submit"
    if (this.props.isSubmitting){
      var loadingIndicator = <Spinner spinnerName='double-bounce' noFadeIn />;
      this.state.hasSubmitted = true;
      submitText = "Submitting Answer..."
    }

    if(!this.props.isSubmitting && this.state.hasSubmitted) {
    	this.clearCanvas();
    }


    // Hack to get some type of submission feedback working
    if(this.props.isQuestionOpen) this.state.hasSubmitted = false;
    if(!this.props.isSubmitting && this.state.hasSubmitted) submitText = "Submitted";

    return (
      <div>
        <canvas key='displayCanvas' ref='displayCanvas' id='displayCanvas'></canvas>
        <canvas key='canvas' ref='canvas' id='canvas'></canvas>

        <div className='ActionBar'>
          <div onClick={this.toggleEraser.bind(this)} className='Action Action--eraser'>
            <div style={eraserStyle} className='Action-icon'></div>
          </div>
          <div onClick={this.clearCanvas.bind(this)} className='Action Action--clear'>
            <div style={clearStyle} className='Action-icon'></div>
          </div>
         <div onClick={this.toggleCorrect.bind(this)} className='Action Action--correct'>
            <div style={correctStyle} className='Action-icon'></div>
          </div>
          <div onClick={this.cycleLineWidth.bind(this)} className='Action Action--strokeWidth'>
            <div className='BrushSizeIcon'>
              <div style={smallStyle} className='BrushSize BrushSize-small'></div>
              <div style={mediumStyle} className='BrushSize BrushSize-medium'></div>
              <div style={largeStyle} className='BrushSize BrushSize-large'></div>
            </div>
          </div>
        </div>
        <div className='responseButton submitButton' onClick={this.onSubmitImage.bind(this)}>
          Tap to Submit
        </div>
      </div>
    );
  }
}

Drawing.propTypes = {
  onSubmitImage: React.PropTypes.func,
  isSubmitting: React.PropTypes.bool,
};


export default Drawing;
