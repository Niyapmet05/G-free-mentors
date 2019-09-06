import "@babel/polyfill";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../models/db';
import sess from '../models/sessions';
import sessReview from '../models/review';

dotenv.config();

class UserController {

  static param(){

  }
  //Create user 
  static  signUp(req, res) {
    const bod = req.body;

    //forbidding important fields to be empty
    if(!bod.firstName) {
      return res.status(404).json({
        success: 'false',
        message: 'firstName cannot be empty'
      })
    } else if(!bod.lastName) {
      return res.status(404).json({
        success: 'false',
        message: 'Last name cannot be empty'
      })

    }else if(!bod.email) {
      return res.status(404).json({
        success: 'false',
        message: 'email cannot be empty'
      })

    }else if(!bod.password) {
      return res.status(404).json({
        success: 'false',
        message: 'password cannot be empty'
      })

    }else if(!bod.address) {
      return res.status(404).json({
        success: 'false',
        message: 'address cannot be empty'
      })
    
    }else if(!bod.experience) {
      return res.status(404).json({
        success: 'false',
        message: 'experience cannot be empty'
      })

    }else if(!bod.age) {
      return res.status(404).json({
        success: 'false',
        message: 'age cannot be empty'
      })
 
    }else if(!bod.sex) {
      return res.status(404).json({
        success: 'false',
        message: 'sex cannot be empty'
      })
    }
    let Message='';
      db.forEach((val) => {
        if (val.email === req.body.email) {
          Message = 'Already exist';
        } 
      });
      if(Message){
        res.status(409).json({
          status: '409',
          Message,
        });
      }

      //Defining new user
      const data = {
        Id:db.length+1,
        firstName:bod.firstName,
        lastName:bod.lastName,
        sex:bod.sex,
        age:bod.age,
        email:bod.email,
        password: bod.password,
        Occupation:bod.occupation,
        experience:bod.experience,
        address:bod.address,
        role:bod.role,
        bio:bod.bio
      }
 
      db.push(data);

    //defining token
    const token = jwt.sign({ email: data.email, password: data.password }, process.env.KEY, {
      // expires in 24 hours
      expiresIn: 86400, 
    })
    
    //returning values if success
    return res.status(201).json({
      status:  201,
      message: 'User created successfully', 
      token,
      data : {
        Id:data.Id,
        firstName:data.firstName,
        lastName:data.lastName,
        sex:data.sex,
        age:data.age,
        email:data.email,
        Occupation:data.occupation,
        experience:data.experience,
        address:data.address,
        role:data.role,
        bio:data.bio
      }
 
    })
  //end of signUp
  }
  
  
  //Login a user
  static login( req, res) {
    //forbdding important fields to be empty
    if(!req.body.email) {
      return res.status(404).josn({
        success: 'false',
        message: 'email is required'
      });
    } else if(!req.body.password) {
      return res.status(404).json({
        success: 'false',
        message: 'password is required'
      });
     }else{
      const matchValue = db.find(User=> User.email === req.body.email && User.password === req.body.password);
      if (matchValue) {
        //defining token
        const token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.KEY, {
          // expires in 24 hours
          expiresIn: 86400, 
        });
        res.status(200).json({
        status:  200,
        message: 'User is successfully logged in',
        token: token
        });
      
      }
      res.status(404).json({
        status:  404,
        message: 'email and password does not match',
      });
    }
    
  }
  /*
    // checking admin
    static admin(req, res) {
      db.map((admin)=>{
      if (req.decodedToken.email === admin.email) {
        if(admin.role !== 'admin'){
          res.status(401).json({
            message: 'Access not allowed, Admin Only',
            email:'you are a' + admin.role +' and your email is '+ req.decodedToken.email,
          });
        }
      }
      })
    }*/

  //Change a user to a mentor.
  static changeToMentor( req, res){
    UserController.admin(req, res);
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
    }else  if (dataFound.role!=="mentee"){
      return res.status(409).json({
        success: 'false',
        message: 'You cannot change its role',
      });
    }

    const data = {
      id: id,
      lastName: dataFound.lastName,
      firstName: dataFound.firstName,
      email:  dataFound.email,
      age:  dataFound.age,
      sex:  dataFound.sex,
      experience: dataFound.experience,
      address: dataFound.address,
      bio: dataFound.bio,
      occupation: dataFound.occupation,
      expertise: dataFound.expertise,
      role: "mentor"
    };

    db.splice(itemIndex, 1, data);

    return res.status(201).json({
      status: 201,
      message: 'User account changed to mentor',
      //data,
    });
  };

  //get all mentors
  static  getAllMentors(req, res) {
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

  //get users without mentors
  static  getUsersOnly(req, res) {
    const mentees=[];
    db.forEach((user) => {
      if (user.role === "mentee") {
        mentees.push(user)
      }
    })
    res.status(200).json({
      status: '200',
      data:mentees
    });
    //check response here
    if(mentees==""){
      res.status(404).json({
        status: '404',
        message:"No user found" 
      })
    }
  }

   //get all users
   static  getAllUsers(req, res) {
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
  static  getMentor(req, res) {
    const id = parseInt(req.params.mentorId, 10);
    db.map((data) => {
      if (data.mentorId === id) {   
        //defining mentor property
        const specMentor = {
          MentorId: id,
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
          role: data.role,
        };

        return res.status(200).json({
          status: 200,
          message: 'mentor retrieved successfully',
          mentor: specMentor,
        });
      } 
  });
   return res.status(404).send({
     success: 'false',
     message: 'mentor does not exist',
    });
  };

   // checking mentor
   static mentor(req, res) {
    db.map((mentor)=>{
    if (req.decodedToken.email === mentor.email) {
      if(mentor.role !== 'mentor'){
        res.status(401).json({
          message: 'Access not allowed, mentor Only',
          email:'you are a ' + mentor.role +' and your email is '+ req.decodedToken.email,
        });
      }
    }
    })
  }

  // checking admin
  static admin(req, res) {
    db.map((admin)=>{
    if (req.decodedToken.email === admin.email) {
      if(admin.role !== 'admin'){
        res.status(401).json({
          message: 'Access not allowed, Admin Only',
          email:'you are an ' + admin.role +' and your email is '+ req.decodedToken.email,
        });
      }
    }
    })
  }

   // checking mentee
    static mentee(req, res) {
      db.map((mentee)=>{
      if (req.decodedToken.email === mentee.email) {
        if(mentee.role !== 'mentee'){
          res.status(401).json({
            message: 'Access not allowed, mentee Only',
            email:'you are a ' + mentee.role +' and your email is '+ req.decodedToken.email,
          });
        }
      }
      })
    }

    /* // checking permition
  static perm(req, res) {
    //definition of role
    let perm = this.permit;
    db.map((perm)=>{
      if (req.decodedToken.email === perm.email) {
        if(perm.role !== 'perm'){
          res.status(401).json({
            message: 'Access is not allowed',
            email:'you are a ' + perm.role +' and your email is '+ req.decodedToken.email,
          });
        }
      }
    })
  }

  static mentor(){
    this.permit = 'mentor';
    this.perm(req,res);
  }
  static admin(){
    this.permit = 'admin';
    this.perm(req,res);
  }
  static mentee(){
    this.permit = 'mentee';
    this.perm(req,res);
  }*/


  //create a mentorship request session
  static  createMentoshipReq( req, res) {
    const bod = req.body;
    UserController.mentee(req,res)

    //forbidding important fields to be empty
    if(!bod.mentorId) {
      return res.status(404).json({
        success: 'false',
        message: 'mentorId cannot be empty'
      })
    } else if(!bod.questions) {
      return res.status(404).json({
        success: 'false',
        message: 'questions cannot be empty'
      })

    }
    
    /*const menteeFound = db.find(User=> User.menteeEmail === req.decodedToken.email);
    console.log(menteeFound);
    if(!menteeFound){
      return res.status(404).json({
        success: 'false',
        message: 'You are not a mentee',
      });

    } */
      //Defining new user
      const data = {
        Id:sess.length+1,
        mentorId: bod.mentorId,
        //menteeId:menteeFound.firstName,
        //menteeEmail:menteeFound.email,
        questions:bod.questions,
        status: "pending",
      }
      
      const mentorFound = db.find(User=> User.mentorId === req.body.mentorId);
      if (!mentorFound) {
        return res.status(404).json({
          success: 'false',
          message: 'Mentor not found',
        });
      }

      sess.push(data); 
       
      return res.status(201).json({
        status:  201,
        message: 'User created successfully', 
        data : {
          sessionId:data.Id,
          //menteeId:data.menteeId,
          mentorId: data.mentorId,
          //menteeEmail:data.email,
          questions:data.questions,
          status: data.status,
        }
      });
    };


  //accept mentorship session 
  static  mentorAccept( req, res){
    UserController.mentor(req,res)
    const id = parseInt(req.params.sessionId, 10);
    let dataFound;
    let itemIndex;
    sess.map((data, index) => {
      if (data.sessionId === id) {
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
    const mySessions = sess.find(mySess=> User.mentorId === UserController.mentor.MentorId);
    console.log(mySessions);
    if(!mySessions){
      return res.status(404).json({
        success: 'false',
        message: 'You are not the owner',
      });

    }
      if (dataFound.status==="accept"){
      return res.status(404).json({
        success: 'false',
        message: 'session was already responded',
      });
    }

    const data = {
      sessionId: id,
      mentorId: dataFound.mentorId,
      questions: dataFound.questions,
      status: "accept"
    };

    sess.splice(itemIndex, 1, data);

    return res.status(201).json({
      status: 201,
      message: 'mentorship session request accepted',
      data
    });
  };
  
  //reject mentorship session 
  static  mentorReject( req, res){ 
    UserController.mentor(req,res)
    const id = parseInt(req.params.sessionId, 10);
    let dataFound;
    let itemIndex;
    sess.map((data, index) => {
      if (data.sessionId === id) {
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
    //searching mentor sessions
    const mySessions = sess.find(mySess=> mySess.mentorId === UserController.mentor.MentorId);
    
    if(!mySessions){
      return res.status(404).json({
        success: 'false',
        message: 'You are not the owner',
      });

    }
      if (dataFound.status==="reject"){
      return res.status(404).json({
        success: 'false',
        message: 'session was already responded',
      });
    }

    const data = {
      sessionId: id,
      mentorId: dataFound.mentorId,
      questions: dataFound.questions,
      status: "reject"
    };

    sess.splice(itemIndex, 1, data);

    return res.status(201).json({
      status: 201,
      message: 'mentorship session request rejected',
      data
    });
  };

  //get users sessions
  static  getUserSessions(req, res) {
    UserController.metee(req, res)
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
  static  getMentorSessions(req, res) {
    UserController.mentor(req, res)
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
  static  SessionReview( req, res){
    if(!req.body.score) {
      return res.status(404).json({
        success: 'false',
        message: 'score cannot be empty'
      })

    } else if(!req.body.remark) {
      return res.status(404).json({
        success: 'false',
        message: 'remark cannot be empty'
      })

    }
    //Defining new user
    const data = {
      Id:sessReview.length+1,
      sessionId:req.body.sessionId,
      menteeId:req.body.menteeId,
      mentorId:req.body.mentorId,
      score:req.body.score,
      remark:req.body.remark,
      menteeFullName:req.body.menteeFullName
    }

    //adding review to other reviews
    sessReview.push(data);
    
    //returning values
    return res.status(201).json({
      data
    })
  };
  
  //get users sessions
  static  getSessionsReview(req, res) {
    try {
      res.status(200).json({
        status: 200,
        data: sessReview
      });
    }catch (error) {
        console.log(error);
    }
  }

  // delete review
  static  deleteSes(req, res) {
    UserController.admin(req,res);
    const id = parseInt(req.params.sessionId, 10);
    db.map((data, index) => {
      if (data.id === id) {
        sessReview.splice(index, 1);
         return res.status(200).send({
           success: 'true',
           message: 'session review deleted successfuly',
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
