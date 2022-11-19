const express = require('express');
const {body} = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.put('/signup',
[
    body('email')
    .isEmail()
    .withMessage('Please enter the valid email')
    .custom((email, {req})=>{
        return User.findOne({email})
        .then(user=>{
            if(user)return Promise.reject('E-mail address already exit!!');
        })
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({min:5}),
    body('firstName')
    .trim()
    .not()
    .isEmpty(),
    body('lastName')
    .trim()
    .not()
    .isEmpty(),
    body('gender')
    .not()
    .isEmpty(),
    body('dateOfBirth')
    .not()
    .isEmpty()
],
authController.signup);

router.post('/login', 
[
    body('email')
    .isEmail()
    .withMessage('Please enter the valid email')
    .custom((email, {req})=>{
        return User.findOne({email})
        .then(user=>{
            if(!user)return Promise.reject('E-mail address does not exit!!');
        })
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({min:5})
]
,authController.login)

module.exports = router;