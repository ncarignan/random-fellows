import "./canvas-api.css";

import React from "react";

import Student from "../../lib/models/student.js";

const API_URL = 'http://localhost:3001'

class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleAvailability = e => {
    let tempStudents = [...this.props.students];
    tempStudents[e.target.id].unavailable
      ? (tempStudents[e.target.id].unavailable = false)
      : (tempStudents[e.target.id].unavailable = true);
    this.props.handleChangeState(tempStudents);
  };

  // getStudentsHandler = result => {
  //   let students = result.body.map(student => new Student(student));
  //   console.log(result);
  //   this.props.handleChangeState(students);
  // }
  
  render() {
    return (
      <section className="roster">
        <button onClick={() => {Student.get(`${API_URL}/course/all`, this.props.handleChangeState)}}>getStudents</button>
        {/* <button onClick={this.getStudents}>updateStudents</button> */}
        {this.props.students.length &&
          this.props.students.map((student, i) => (
            <div
              className={
                student.unavailable ? "button paused deck" : "button play deck"
              }
              key={i}
            >
              <div className="card">{student.name}</div>
              <span className="card" id={i} onClick={this.toggleAvailability} />
            </div>
          ))}
      </section>
    );
  }
}


export default Roster;
