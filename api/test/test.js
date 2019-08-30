import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const baseUrl = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();
describe('Sign Up', () => {
  describe('POST /api/v1/users', () => {
    // test 3
    it('should display \'Sorry, this account already exists\'', (done) => {
      chai.request(app)
        .post(`${baseUrl}/users`)
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
          res.should.have.status(201);
          done();
        });
    });
  });
}); // end of Sign-u