import React from 'react';
import { Link } from 'react-router';

require('../../css/components/Button.scss');
require('../../css/components/Form.scss');

class ArchiveListItem extends React.Component {
  onChangeCourse(courseId, courseName) {
    this.props.onChangeCourse(courseId, courseName);
  }

  render() {
    return (
      <div className='ListItem'
      to={this.props.to}
      params={{courseName: this.props.courseName}}
      onClick={this.onChangeCourse.bind(this, this.props.courseId,
        this.props.courseName)}>
        {this.props.children}
      </div>
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
    this.sectionStyle = {
      flexGrow: 1,
      textAlign: 'center',
      margin: 10,
    };
  }
  
  render() {
    var items = Object.keys(this.props.subjects).map((key) => {
      return (
        <ArchiveListItem
          key={key}
          userId={this.props.userId}
          courseId={key}
          courseName={this.props.subjects[key]}
        	onChangeCourse={this.props.onChangeCourse}
        >
          {this.props.subjects[key]}
        </ArchiveListItem>);
    });

    return (
      <div className='List' style={this.sectionStyle}>
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