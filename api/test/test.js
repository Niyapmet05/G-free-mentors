import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const vers = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();

//test sign up with existing data
describe('Sign Up', () => {
  describe('POST /api/v1/auth/signup', () => {
    // test 1
    it('should display  409 status', (done) => {

      chai.request(app)
        .post(`${vers}/auth/signup`)
        .send({
          id:1,
          firstName: "Aphrodis",
          lastName: "NIYOMURENGEZI",
          email: "niyomurengeziaphrodis@gmail.com",
          password: "1987AN",
          age: 32,
          sex: "M",
          experience: "7 years",
          address: "Kigali",
          bio: "engineer",
          occupation: "developer",
          expertise: "high"
        })
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
  });
})
//test sign up with valid data
describe('Sign Up', () => {
  describe('POST /api/v1/auth/signup', () => {
    // test 1
    it('should display  201 status', (done) => {
      chai.request(app)
        .post(`${vers}/auth/signup`)
        .send({
          id:1,
          firstName: "Aphrodis",
          lastName: "NIYOMURENGEZI",
          email: "niyomurengeziaphrods@gmail.com",
          password: "1987AN",
          age: 32,
          sex: "M",
          experience: "7 years",
          address: "Kigali",
          bio: "engineer",
          occupation: "developer",
          expertise: "high"
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });
})

//test sign up with invalid data
describe('Sign Up', () => {
  describe('POST /api/v1/auth/signup', () => {
    // test 1
    it('should display status 404', (done) => {
      chai.request(app)
        .post(`${vers}/auth/signup`)
        .send({
          id:"",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          age: "",
          sex: "",
          experience: "",
          address: "",
          bio: "",
          occupation: "",
          expertise: ""
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

 // end of Sign-up

//test sign in with valid data
describe('Sign in', () => {
  describe('POST / Signin with correct email and password', () => {
    const signInData = {
      email: 'tuyishimepascal@gmail.com',
      password: '1985PT',
    };
    it('Should return 200 status', (done) => {
      chai.request(app)
        .post(`${vers}/auth/signin`)
        .send(signInData)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
})

//test sign in with mismatching email and password
//test sign in with  correct email and  wrong password
describe('Sign in', () => {
  describe('POST / Signin with wrong email and password', () => {
    const signInData = {
      email: 'tuyishimepscal@gmail.com',
      password: '1985PT',
    };
    it('Should return 404 status', (done) => {
      chai.request(app)
        .post(`${vers}/auth/signin`)
        .send(signInData)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
})

//test sign in with wrong email and correct password
describe('Sign in', () => {
  describe('POST / sign in with wrong email and correct password', () => {
    const signInData = {
      email: 'tuyishimepascal@gmail.com',
      password: '1985T',
    };
    it('Should return 404 status', (done) => {
      chai.request(app)
        .post(`${vers}/auth/signin`)
        .send(signInData)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
})
//test sign in with mismatching email and password
describe('Sign in', () => {
  describe('POST / sign in with mismatching email and password', () => {
    const signInData = {
      email: 'tuyishimescal@gmail.com',
      password: '198T',
    };
    it('Should return 404 status', (done) => {
      chai.request(app)
        .post(`${vers}/auth/signin`)
        .send(signInData)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
})


//sign in with empty data
describe('Sign in', () => {
  describe('POST / Signin with empty', () => {
    const signInData = {
      email: 'tuyishimescal@gmail.com',
      password: '',
    };
    it('Should return a 404 status', () => {
      chai.request(app)
        .post(`${vers}/auth/signin`)
        .send(signInData)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
})


//change user to mentor
describe('PATCH', () => {
  describe('access with admin to change a mento', () => {
    const token= {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxhdWRldHdhcmlAZ21haWwuY29tIiwicGFzc3dvcmQiOiIyNUNOIiwiaWF0IjoxNTY3NzQ2Mjk5LCJleHAiOjE1Njc4MzI2OTl9.JijCvS82iMqHyTJ4LaSQJPyF-0Y8UG_q2Q5tIgOB1bk',
    };
    it('Should return a 409 status', () => {
      chai.request(app)
        .post(`${vers}user/3`)
        .send(token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
})
