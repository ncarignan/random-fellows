const superagent = require('superagent');

//TODO: import from helper module

const _getCoursesFromLS = (handler) => {
  JSON.parse(localStorage.getItem('courses')) ? handler({ courses: JSON.parse(localStorage.getItem('courses')) }) : handler({ courses: [] });
};

const _getCoursesFromAPI = (handler, destination) => {
  return superagent.get(destination)
    // .set('Authorization', `Bearer ${process.env.CANVAS_API_URL}`)
    .then(result => {
      let courses = result.body.map(course => new Course(course));
      localStorage.setItem('courses', JSON.stringify(courses.courses));
      console.log('from api new courses', courses);
      return handler({courses, currentCourseId : null});
    })
    .catch(console.error);
};

class Course {
  constructor(course = {}) {
    this.name = course.courseName || course.name;
    this.id = course.id;
  }
}

Course.get = (handler, destination) => {
  if (destination === 'LS') {
    return _getCoursesFromLS(handler);
  }
  return _getCoursesFromAPI(destination, handler);
};




export default Course;