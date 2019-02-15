import './course-select.css';

import React from 'react';

class CourseSelect extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  handleSelectCourse = event => {
    this.props.handleChangeState({currentCourseId : event.target.value, pairs: null, student: null})
    localStorage.setItem('currentCourseId', event.target.value)
  }

  render(){
    return (
      <div className="courses modal">
        {!!this.props.courses.length && 
        this.props.courses.map((course, idx) => (
          <div className="course" onClick={this.handleSelectCourse} value={course.id} key={idx}>{course.name.split(':')[0]}</div>
        )
        )}
      </div>
    );
  }
}

export default CourseSelect;
