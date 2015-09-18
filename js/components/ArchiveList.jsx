import React from 'react';
import { Link } from 'react-router';

let Modal = require('react-modal');
require('../../css/components/Button.scss');
require('../../css/components/Form.scss');

// React Modal Setup
let appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class ArchiveListItem extends React.Component {
  onChangeCourse(courseId, courseName) {
    this.props.onChangeCourse(courseId, courseName);
  }

  render() {
    return (
      <Link
        className='ListItem'
        to={this.props.to}
        params={{courseId: this.props.courseId, userId:this.props.userId}}
        onClick={this.onChangeCourse.bind(this, this.props.courseId,
        this.props.courseName)}
      >
        {this.props.children}
      </Link>
    );
  }
}

ArchiveListItem.propTypes = {
  to: React.PropTypes.string,
  courseName: React.PropTypes.string,
  courseId: React.PropTypes.string,
  children: React.PropTypes.node,
  onChangeCourse: React.PropTypes.func,
};

class ArchiveList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onCourseInputChange(event) {
    this.setState({ newCourse: event.target.value });
  }


  render() {
    var items = Object.keys(this.props.subjects).map((key) => {
      return (
        <ArchiveListItem
          key={key}
          to='responses'

          userId={this.props.userId}
          courseId={key}
          courseName={this.props.subjects[key]}

          onChangeCourse={this.props.onChangeCourse}
        >
          {this.props.subjects[key]}
        </ArchiveListItem>);
    });

    return (
      <div className='Grid SubjectList'>
        <div>
          {items}
        </div>
      </div>
    );
  }
}
ArchiveList.propTypes = {
  subjects: React.PropTypes.object,
  onChangeCourse: React.PropTypes.func,
};

export default ArchiveList;
