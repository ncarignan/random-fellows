const superagent = require('superagent');

//TODO: import from helper module

const _getStudentsFromLS = (handler) => {
  JSON.parse(localStorage.getItem('students')) ? handler({students : JSON.parse(localStorage.getItem('students'))}) : handler({students : []});
};

const _getStudentsFromAPI = (handler, destination) => {
  return superagent.get(destination)
    // .set('Authorization', `Bearer ${process.env.CANVAS_API_URL}`)
    .then(result => {
      let students = { students: result.body.map(student => new Student(student)) };
      localStorage.setItem('students', JSON.stringify(students.students));
      console.log('from api new students', students);
      return handler(students);
    })
    .catch(console.error);
};

class Student {
  constructor(student = {}){
    this.name = student.studentName || student.name;
    this.projects = student.projects || [];
    this.collaborations = student.collaborations || {};
    this.picked = student.picked || 0;
    this.weight = student.weight || 1;
    this.unavailabe = student.unavailable || false;
    this.availableToPair = student.availableToPair || true;
    this.availableToWhiteBoard = student.availableToWhiteBoard || true;
    this.present = student.present || true;
  }
}

Student.get = (handler, destination) => {
  if (destination === 'LS') {
    return _getStudentsFromLS(handler);
  }
  return _getStudentsFromAPI(destination, handler);
};




export default Student;