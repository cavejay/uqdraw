import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
    };
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.tick = this.tick.bind(this);
  }

  // Start timer counting. Timer is not reset, so if there is elapsed time
  // the timer will continue from where it was 
  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(this.tick, this.props.interval);
    }
  }

  // Pause the timer at its current point
  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  // Stop the timer if it is not already stopped, and set it back to 0.
  resetTimer() {
    this.stopTimer();
    this.setState({elapsed: 0});
  }

  // Update the timer based on how much time has elapsed since the last update.
  tick() {
    this.setState({elapsed: Number(this.state.elapsed) + +Number(this.props.increment)});
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    this.styles = {
      container: {
        fontSize: 30,
      }
    };
    let totalSeconds = Math.round(this.state.elapsed / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    if (seconds < 10) { seconds = '0' + seconds; }
    return (
      <div style={this.styles.container}>
        <span>{minutes}:{seconds}</span>
      </div>
    );
  }
}

export default Timer;
