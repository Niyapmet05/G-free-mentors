import "@babel/polyfill";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../models/db';
import sess from '../models/sessions';

dotenv.config();

class UserController {

  //Create user account
  static async signUp(req, res) {
    //forbidding important fields to be empty
    if(!req.body.firstName) {
      return res.status(400).json({
        success: 'false',
        message: 'First name field cannot be empty'
      })

    } else if(!req.body.lastName) {
      return res.status(400).json({
        success: 'false',
        message: 'Last name field cannot be empty'
      })

    }else if(!req.body.email) {
      return res.status(400).json({
        success: 'false',
        message: 'email field cannot be empty'
      })

    }else if(!req.body.password) {
      return res.status(400).json({
        success: 'false',
        message: 'password field cannot be empty'
      })

    }else if(!req.body.address) {
      return res.status(400).json({
        success: 'false',
        message: 'address field cannot be empty'
      })
    
    }else if(!req.body.experience) {
      return res.status(400).json({
        success: 'false',
        message: 'experience field cannot be empty'
      })

    }else if(!req.body.age) {
      return res.status(400).json({
        success: 'false',
        message: 'age field cannot be empty'
      })
 
    }else if(!req.body.sex) {
      return res.status(400).json({
        success: 'false',
        message: 'sex field cannot be empty'
      })
    }
    
    //Defining new user
    const data = {
      Id:db.length+1,
      FirstName:req.body.firstName,
      LastName:req.body.lastName,
      Sex:req.body.sex,
      Age:req.body.age,
      Email:req.body.email,
      Occupation:req.body.occupation,
      Experience:req.body.experience,
      Address:req.body.address,
      role:req.body.role,
      Bio:req.body.bio
    }
 
    //adding user to other users
    db.push(data);

    //defining token
    const token = jwt.sign({ email: data.email, password: data.password }, process.env.KEY, {
      // expires in 24 hours
      expiresIn: 86400, 
    })
    
    //returning values
    return res.status(201).json({
      status:  201,
      message: 'User created successfully', 
      token,
      data
    })
  //end of signUp
  }

  //Login a user
  static async login( req, res) {
    //email and password as mandatory
    if (!req.body.email) {
      res.status(400).json({
        status: '400',
        message: 'Email is mandatory',
      });
    } else if (!req.body.password) {
      res.status(400).json({
        status: '400',
        message: 'password is mandatory',
      });
    } else {
      //verfying if email and password match
      const matchvalues = db.find(Users => Users.email === req.body.email && Users.password === req.body.password);
        if (matchvalues) {
          //defining token
          const token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.KEY, {
            expiresIn: 86400, // expires in 24 hours
          });
          res.status(200).json({
            status: '200',
            message: 'User is successful login',
            data: {token},
          });
        }
        res.status(404).json({
          status: '404',
          message: 'Email and password does not match',
        });
      }
    }
  
  //Change a user to a mentor.
  static async changeToMentor( req, res){
    const id = parseInt(req.params.userId, 10);
    let dataFound;
    let itemIndex;
    db.map((data, index) => {
      if (data.id === id) {
        dataFound = data;
        itemIndex = index;
      }
    });

    if (!dataFound) {
      return res.status(404).json({
        success: 'false',
        message: 'user not found',
      });
    }else  if (dataFound.role==="mentor"){
      return res.status(404).json({
        success: 'false',
        message: 'user is already a mentor',
      });
    }

    const data = {
      id: id,
      lastName: req.body.lastName || dataFound.lastName,
      firstName: req.body.firstName || dataFound.firstName,
      email: req.body.email || dataFound.email,
      age: req.body.age || dataFound.age,
      sex: req.body.sex || dataFound.sex,
      experience: req.body.experience || dataFound.experience,
      address: req.body.address || dataFound.address,
      bio: req.body.bio || dataFound.bio,
      occupation: req.body.occupation || dataFound.occupation,
      expertise: req.body.expertise || dataFound.expertise,
      role: "mentor"
    };

    db.splice(itemIndex, 1, data);

    return res.status(201).json({
      status: 201,
      message: 'User account changed to mentor',
      data,
    });
  };

  //get all mentors
  static async getAllMentors(req, res) {
    const mentors=[];
    db.forEach((user) => {
      if (user.role === "mentor") {
        mentors.push(user)
      }
    })
    res.status(200).json({
      status: '200',
      data:mentors
    });
  }

  //get all mentors
  static async getUsersOnly(req, res) {
    const mentors=[];
    db.forEach((user) => {
      if (user.role === "mentee") {
        mentors.push(user)
      }
    })
    res.status(200).json({
      status: '200',
      data:mentors
    });
  }
   //get all users
   static async getAllUsers(req, res) {
    try {
      res.status(200).json({
        status: 200,
        data: db
      });
    }catch (error) {
       console.log(error);
    }
   }

  //get a specific mentor
  static async getMentor(req, res) {
    const id = parseInt(req.params.mentorId, 10);
    db.map((data) => {
      /*** revise for enforce logic */
      /*if (data.role==="mentee"){
        return res.status(404).json({
          success: 'false',
          message: 'mentor does not exist',
        });
      }else */
      if (data.id === id) {   
        //defining mentor property
        const specMentor = {
          MentorId: data.id,
          lastName: data.lastName,
          firstName: data.firstName,
          email: data.email,
          password: data.password,
          age: data.age,
          sex: data.sex,
          experience: data.experience,
          address: data.address,
          bio: data.bio,
          occupation: data.occupation,
          expertise: data.expertise,
          role: "mentor"
        };

        return res.status(200).json({
          status: 200,
          message: 'mentor retrieved successfully',
          specMentor,
        });
      } 
  });
   return res.status(404).send({
     success: 'false',
     message: 'mentor does not exist',
    });
  };

  //create a mentorship request session
  static async createMentoshipReq( req, res) {
    //forbdding important fields to be empty
    if(!req.body.mentorId) {
      return res.status(400).json({
        success: 'false',
        message: 'mentorId is mandatory'
      })

    } else if(!req.body.questions) {
      return res.status(400).json({
        success: 'false',
        message: 'questions mandatory'
      })
    }
    
    //Define returning values
    const data = {
      sessionId:sess.length+1,
      mentorId:req.body.mentorId,
      menteeId:req.body.menteeId,
      questions:req.body.questions,
      menteeEmail:req.body.email,
      status:"pending"
    }
    
    //returning values
    return res.status(201).json({
      status:  201,
      message: 'session created successfully',
      data
    })
  };

  //accept mentorship session 
  static async mentorAccept( req, res){
    const id = parseInt(req.params.sessionId, 10);
    let dataFound;
    let itemIndex;
    sess.map((data, index) => {
      if (data.id === id) {
        dataFound = data;
        itemIndex = index;
      }
    });

    if (!dataFound) {
      return res.status(404).json({
        success: 'false',
        message: 'session not found',
      });
    }

    const data = {
      sessionId: id,
      mentorId: req.body.mentorId || dataFound.mentorId,
      questions: req.body.questions || dataFound.questions,
      status: "accept"
    };

    sess.splice(itemIndex, 1, data);

    return res.status(201).json({
      status: 201,
      message: 'mentorship session request accepted',
      data
    });
  };

  //reject mentorship session request
    static async mentorReject( req, res){
      const id = parseInt(req.params.sessionId, 10);
      let dataFound;
      let itemIndex;
      db.map((data, index) => {
        if (data.id === id) {
          dataFound = data;
          itemIndex = index;
        }
      });

      if (!dataFound) {
        return res.status(404).json({
          success: 'false',
          message: 'session not found',
        });
      }

      const data = {
        sessionId: dataFound.id,
        mentorId: req.body.mentorId || dataFound.mentorId,
        questions: req.body.questions || dataFound.questions,
        status: "reject"
      };

      sess.splice(itemIndex, 1, data);

      return res.status(201).json({
        status: 201,
        message: 'mentorship session request rejected',
        token:req.headers.token,
        data,
      });
    };

  //get users sessions
  static async getUserSessions(req, res) {
    try {
      res.status(200).json({
        status: 200,
        data: sess
      });
    }catch (error) {
        console.log(error);
    }
  }

  //get mentors sessions
  static async getMentorSessions(req, res) {
    try {
      res.status(200).json({
        status: 200,
        data: sess
      });
    }catch (error) {
      console.log(error);
    }
  }
 
  //review session
  static async SessionReview( req, res){
    const id = parseInt(req.params.sessionId, 10);
    let dataFound;
    let itemIndex;
    db.map((data, index) => {
      if (data.id === id) {
        dataFound = data;
        itemIndex = index;
      }
    });

    if (!dataFound) {
      return res.status(404).json({
        success: 'false',
        message: 'session not found',
      });
    }

    if(!req.body.score) {
      return res.status(400).json({
        success: 'false',
        message: 'score is required'
      })

    }else if(!req.body.remark) {
      return res.status(400).json({
        success: 'false',
        message: 'remark is required'
      })
    }
    
    const data = {
      sessionId: dataFound.id,
      mentorId: req.body.mentorId || dataFound.mentorId,
      score: req.body.score || dataFound.score,
      remark: req.body.remark || dataFound.remark,
      menteeFullName: req.body.firstName +" "+ req.body.lastName || dataFound.firstName +" "+ dataFound.lastName
    };

    sess.splice(itemIndex, 1, data);

    return res.status(201).json({
      status: 201,
      data,
    });
  };

  // delete sessions
  static async deleteSes(req, res) {
    const id = parseInt(req.params.sessionId, 10);
    db.map((data, index) => {
      if (data.id === id) {
         sess.splice(index, 1);
         return res.status(200).send({
           success: 'true',
           message: 'session deleted successfuly',
         });
      }
    });

      return res.status(404).send({
        success: 'false',
        message: 'session not found',
      });
  }

}
export default UserController;//for external use
