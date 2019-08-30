import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../models/db';

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
      message: "User created successfully",
      FirstName:req.body.firstName,
      LastName:req.body.lastName,
      Sex:req.body.sex,
      Age:req.body.age,
      Email:req.body.email,
      Occupation:req.body.occupation,
      Experience:req.body.experience,
      Address:req.body.address,
      Expertise:req.body.expertise,
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
}
export default UserController;//for external use
