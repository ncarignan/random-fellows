import "./roster.css";

import React from "react";

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

  render() {
    return (
      <section className="roster">
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
