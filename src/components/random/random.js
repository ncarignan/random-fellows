import "./random.css";

import React from "react";

import Roster from "../roster/roster.js";
import Canvas from "../canvas-api/canvas-api.js";

// When generating pairs, the program attempts to create all unique pairs that have not been created before
// this is the amount of tries before the program automatically allows students to pair up with each other again. Make this bigger to be more accurate, it is already very small to keep things quick
const TRIES = 120;

const CURRENT_STUDENTS = [
  "Rick",
  "Sarkis",
  "Skyler",
  "Nikki",
  "Andrew",
  "Jessica",
  "Evy",
  "Erik",
  "Jerome",
  "Nicole",
  "Jared",
  "Michael",
  "Peter M",
  "H'Liana",
  "Karl",
  "Connor",
  "Xochil",
  "Lorin",
  "Erin",
  "Anthony",
  "Mae",
  "Jeff",
  "Peter B"
];

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: this.getStudents(),
      maxPairs: 1
    };
  }

  Student(student) {
    Object.assign(this, student);
  }

  getStudents() {
    let allStudents = [];
    if (localStorage.getItem("students")) {
      JSON.parse(localStorage.getItem("students")).forEach(student =>
        allStudents.push(new this.Student(student))
      );
    } else {
      CURRENT_STUDENTS.forEach(studentName => {
        allStudents.push(
          new this.Student({
            name: studentName,
            projects: [],
            collaborations: {},
            picked: 0,
            weight: 1,
            unavailabe: true,
            availableToPair: true,
            availableToWhiteBoard: true,
            present: true
          })
        );
      });
    }
    return allStudents;
  }

  handleCreatePairs = () => {
    let result = this._handleCreatePairs(); // returns an array of [pairs, classroom]
    if (result) {
      this.setState({ pairs: result[0], students: result[1], student: null });
      localStorage.setItem("students", JSON.stringify(result[1]));
    } else {
      console.log("there are no more unique combinations"); //TODO: Alert the user
    }
  };

  _handleCreatePairs = (tries = 0, projectName) => {
    let resultPairs = [];
    let resultStudents = [];
    let tempStudents = JSON.parse(JSON.stringify(this.state.students));
    projectName = projectName
      ? projectName
      : `${new Date().getUTCMonth()}-${new Date().getDay()}-18 [${tries}]`;

    while (tempStudents.length) {
      if (!(tempStudents.length - 1)) {
        let a = tempStudents.splice(0, 1)[0];
        let b = resultPairs[resultPairs.length - 1][0];
        let c = resultPairs[resultPairs.length - 1][1];
        resultPairs[resultPairs.length - 1].push(a);

        a.projects.push({
          projectName: projectName,
          partners: [b.name, c.name]
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
        b.collaborations[c.name] = b.collaborations[c.name]
          ? b.collaborations[c.name] + 1
          : 1;

        c.collaborations[a.name] = c.collaborations[a.name]
          ? c.collaborations[a.name] + 1
          : 1;
        c.collaborations[b.name] = c.collaborations[b.name]
          ? c.collaborations[b.name] + 1
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
      this.state.maxPairs++;
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
          a[0] !== Math.floor(c.picked / c.weight) ? (a[1] = true) : null;

          return c.picked / c.weight > a[0] ? [c.picked / c.weight, a[1]] : a;
        },
        [this.state.students[0].picked, false]
      );

    if (!maxPicked[1]) maxPicked[0]++; //if maxPicked[1] ever flagged a different amount of clicks

    do {
      index = Math.floor(Math.random() * this.state.students.length);
      student = this.state.students[index];
    } while (student.picked / student.weight >= maxPicked[0]);

    this.state.students[index].picked++;
    this.setState({ student: student.name, pairs });
  };

  handleChangeState = state => {
    return state ? this.setState(state) : null;
  };

  render() {
    return (
      <section className="counter deck">
        <Roster
          students={this.state.students}
          handleChangeState={this.handleChangeState}
        />
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
              <li key={i}>{pair.reduce((a, c) => `${a} ${c.name},`, "")}</li>
            ))}
        </ul>
      </section>
    );
  }
}

export default Counter;
