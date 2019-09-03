import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const baseUrl = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();
describe('Sign Up', () => {
  describe('POST /api/v1/auth/signup', () => {
    // test 3
    it('should display \'Sorry, not registed\'', (done) => {
      chai.request(app)
        .post(`${baseUrl}/auth/signup`)
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