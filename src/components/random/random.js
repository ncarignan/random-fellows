import "./random.css";

import React from "react";

// import Roster from "../roster/roster.js";
import Canvas from "../canvas-api/canvas-api.js";
import Student from "../../lib/models/student";

// When generating pairs, the program attempts to create all unique pairs that have not been created before
// this is the amount of tries before the program automatically allows students to pair up with each other again. Make this bigger to be more accurate, it is already very small to keep things quick
const TRIES = 120;

// const CURRENT_STUDENTS = [
//   "Rick",
//   "Sarkis",
//   "Skyler",
//   "Nikki",
//   "Andrew",
//   "Jessica",
//   "Evy",
//   "Erik",
//   "Jerome",
//   "Nicole",
//   "Jared",
//   "Michael",
//   "Peter M",
//   "H'Liana",
//   "Karl",
//   "Connor",
//   "Xochil",
//   "Lorin",
//   "Erin",
//   "Anthony",
//   "Mae",
//   "Jeff",
//   "Peter B"
// ];

class Random extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      // students: JSON.parse(localStorage.getItem('students')),
      maxPairs: 1
    };
  }
  componentDidMount () {
    Student.get(this.handleChangeState, 'LS');
  }

  handleCreatePairs = () => {
    let result = this._handleCreatePairs(); // returns an array of [pairs, classroom]
    if (result) {
      this.handleChangeState({ pairs: result[0], students: result[1], student: null });
      console.log('new pairs')
      localStorage.setItem("students", JSON.stringify(result[1]));
    } else {
      console.log("there are no more unique combinations"); //TODO: Alert the user
    }
  };

  _handleCreatePairs = (tries = 0, projectName) => {
    let resultPairs = [];
    let resultStudents = [];
    let tempStudents = JSON.parse(JSON.stringify(this.state.students)).filter(student => (student.availableToPair && !student.unavailable) ? true : resultStudents.push(student) && false); //TODO: refactor to a spread operator
    projectName = projectName
      ? projectName
      : `${new Date().getUTCMonth()}-${new Date().getDay()}-18 [${tries}]`;

    while (tempStudents.length) {
      if (!(tempStudents.length - 1)) {
        let a = tempStudents.pop(); //A
        let b = resultPairs[resultPairs.length - 1][0];
        let c = resultPairs[resultPairs.length - 1][1];
        resultPairs[resultPairs.length - 1].push(a);

        a.projects.push({
          projectName: projectName,
          partners: [b.name, c.name] //TODO: refactor to include all names
        });
        b.projects[b.projects.length - 1] = {
          projectName: projectName,
          partners: [a.name, c.name]
        };
        c.projects[b.projects.length - 1] = {
          projectName: projectName,
          partners: [a.name, b.name]
        };

        a.collaborations[b.name] = a.collaborations[b.name]
          ? a.collaborations[b.name] + 1
          : 1;
        a.collaborations[c.name] = a.collaborations[c.name]
          ? a.collaborations[c.name] + 1
          : 1;

        b.collaborations[a.name] = b.collaborations[a.name]
          ? b.collaborations[a.name] + 1
          : 1;

        c.collaborations[a.name] = c.collaborations[a.name]
          ? c.collaborations[a.name] + 1
          : 1;

        resultStudents.push(a);
      } else {
        let aToSplice = Math.floor(Math.random() * tempStudents.length);
        let a = tempStudents.splice(aToSplice, 1)[0];
        let b = tempStudents.splice(
          Math.floor(Math.random() * tempStudents.length),
          1
        )[0];
        resultPairs.push([a, b]);
        a.projects.push({ projectName: projectName, partners: [b.name] });
        b.projects.push({ projectName: projectName, partners: [a.name] });

        a.collaborations[b.name] = a.collaborations[b.name]
          ? a.collaborations[b.name] + 1
          : 1;
        b.collaborations[a.name] = b.collaborations[a.name]
          ? b.collaborations[a.name] + 1
          : 1;

        resultStudents.push(a, b);
      }
    }
    let allNewPairs = true;
    resultPairs.forEach(pair => {
      for (let i = 0; i < pair.length; i++) {
        // check all pair members
        for (let j = i; j < pair.length; j++) {
          // check against the name of the other partners
          if (pair[i].collaborations[pair[j].name] > this.state.maxPairs) {
            allNewPairs = false;
          }
        }
      }
    });
    if (tries > TRIES) {
      //TODO: adjust maxPairs up
      this.handleChangeState({maxPairs : this.state.maxPairs + 1});
      return this._handleCreatePairs(0);
    } else if (!allNewPairs) {
      return this._handleCreatePairs(tries + 1);
    } else {
      return [resultPairs, resultStudents, tries];
    }
  };

  selectStudent = e => {
    let pairs = [];
    let student;

    let index;

    let maxPicked = this.state.students
      .filter(student => student.unavailable)
      .reduce(
        (a, c) => {
          if (a[0] !== Math.floor(c.picked / c.weight)) a[1] = true;

          return c.picked / c.weight > a[0] ? [c.picked / c.weight, a[1]] : a;
        },
        [this.state.students[0].picked, false]
      );

    if (!maxPicked[1]) maxPicked[0]++; //if maxPicked[1] ever flagged a different amount of clicks

    do {
      index = Math.floor(Math.random() * this.state.students.length);
      student = this.state.students[index];
    } while (student.picked / student.weight >= maxPicked[0]);
    
    let tempStudents = this.state.students;
    tempStudents[index].picked++;
    this.handleChangeState({
      students: tempStudents, 
      student: student.name, 
      pairs
    })
  };

  handleChangeState = state => {
    //TODO: keep the students sorted on screen
    // if(state.students && state.students.length) {
    //   console.log(state.students);

    //   state.students = state.students.sort((a, b) => a.name > b.name);
    // }
    return state ? this.setState(state) : null;
  };

  render() {
    return (
      <section className="counter deck">
        <Canvas
          students={this.state.students}
          handleChangeState={this.handleChangeState}
        />
        <span className="clicker" onClick={this.handleCreatePairs}>
          Pairs
        </span>
        <span className="clicker" onClick={this.selectStudent}>
          Next!
        </span>
        <span className="student">{this.state.student}</span>
        <ul className="pairs">
          {this.state.pairs &&
            this.state.pairs.map((pair, i) => (
              <li key={i}>{pair.reduce((a, c) => `${a} ${c.name},`, "").slice(0, -1)}</li>
            ))}
        </ul>
      </section>
    );
  }
}

export default Random;
