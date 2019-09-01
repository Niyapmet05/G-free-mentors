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
    
    //Defining values to display confirming their entry
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
 
    //registering
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
    //forbdding important fields to be empty
    if(!req.body.email) {
      return res.status(400).josn({
        success: 'false',
        message: 'email is required'
      });
    } else if(!req.body.password) {
      return res.status(400).json({
        success: 'false',
        message: 'password is required'
      });
    }
    const data = {
    }
    db.push(data);

    //defining token
    const token = jwt.sign({ email: data.email, password: data.password }, process.env.KEY, {
      // expires in 24 hours
      expiresIn: 86400, 
    })
    return res.status(200).json({
      status:  200,
      message: 'User is successfully logged in',
      token
    })
  };
  
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
    }

    const data = {
      id: dataFound.id,
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
      token:req.headers.token,
      data,
    });
  };

  //get all mentors
  static async getAllMentors(req, res) {
    db.forEach((user) => {
      if (user.role === "mentor") {
        res.status(200).json({
          status: '200',
          user
        });
      }
    })
 }

   //get all users
   static async getAllUsers(req, res) {
    try {
      res.status(200).json({
        status: 200,
        token:req.headers.token,
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
      if (data.id === id) {
        return res.status(200).json({
          status: 200,
          message: 'mentor retrieved successfully',
          data,
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
        message: 'mentorId name field cannot be empty'
      })

    } else if(!req.body.questions) {
      return res.status(400).json({
        success: 'false',
        message: 'questions name field cannot be empty'
      })

    }
    
    //Defining values to display confirming their entry
    const data = {
      sessionId:sess.length+1,
      mentorId:req.body.mentorId,
      menteeId:req.body.menteeId,
      questions:req.body.questions,
      menteeEmail:req.body.email,
      status:req.body.status
    }
    
    //returning values
    return res.status(201).json({
      status:  201,
      message: 'User created successfully', 
      token:req.headers.token,
      data
    })
  };

  //accept mentorship session request
  static async mentorAccept( req, res){
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
      status: "accept"
    };

    sess.splice(itemIndex, 1, data);

    return res.status(201).json({
      status: 201,
      message: 'mentorship session request accepted',
      token:req.headers.token,
      data,
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
    /*try {
      res.status(200).json({
        status: 200,
        data: sess
      });
    }catch (error) {
      console.log(error);
    }*/
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
