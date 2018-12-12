import "./canvas-api.css";

import React from "react";

const superagent = require('superagent');

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

  getStudents(){
    console.log('getStudents')
    return superagent.get(`https://canvas.instructure.com/api/v1/courses`)
      .set('Authorization', `Bearer ${process.env.CANVAS_API_URL}`)
      .then(res => {
        console.log(res.body);
      })
      .catch(console.error);
  }
  render() {
    return (
      <section className="roster">
        <button onClick={this.getStudents}>getStudents</button>
        {/* {this.props.students &&
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
          ))} */}
      </section>
    );
  }
}


export default Roster;
