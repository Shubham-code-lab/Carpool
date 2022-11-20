const User = require('../models/user');
const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');

exports.signup = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email= req.body.email;
    const password = req.body.password;
    const gender = req.body.gender;
    const dateOfBirth = req.body.dateOfBirth;

    bcrypt.hash(password, 12)
    .then(hashedPassword=>{
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            gender,
            dateOfBirth
        });
        return user.save();
    })
    .then(result=>{
        res.status(201).json({message: 'User is created', userId: result._id});
    })
    .catch(err=>{
        if(!err.statusCode){
          err.statusCode = 500; 
        }
        next(err);
      })

    console.log("SignUp");
}

exports.login = (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email})
    .then(user=>{
        if(!user){    //TODO :- reductancy routes already check
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, loadedUser.password);
    })
    .then(areMatch=>{
        if(!areMatch){
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({  
            email: loadedUser.email,   
            userId: loadedUser._id.toString()  
        },
        'stringfortokencreationsecure',   
        { expiresIn: '1h'}   
        );
        res.status(200).json({token, userId: loadedUser._id.toString()})
    })
    .catch(err=>{
        if(!err.statusCode){
          err.statusCode = 500; 
        }
        next(err);
      })
}