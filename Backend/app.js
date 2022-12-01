const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const authRoutes = require('./routes/auth');  //TODO
const driverRoutes = require('./routes/driver');
const riderRoutes = require('./routes/rider');
const guestRoutes = require('./routes/guest');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/asset', express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.json()); // application/json

app.use('/auth', authRoutes);
app.use('/driver', driverRoutes);
app.use('/rider', riderRoutes);
app.use('/guest', guestRoutes);

app.use((error, req, res, next)=>{  //custom error handling function
    const status = error.statusCode || 500;
    const message = error.message;  
    const data = error.data;
    res.status(status).json({message, data});
})

mongoose.connect('mongodb+srv://Shubham:8806166977a@cluster0.pjapwbk.mongodb.net/carpool?retryWrites=true&w=majority')
.then(result=>{
    app.listen(8080);
})
.catch(err=>console.log(err))