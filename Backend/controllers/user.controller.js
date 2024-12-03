const userModel = require('../models/user.model');
const userService = require('../services/user.service')
const {validationResult} = require('express-validator')

module.exports.registerUser = async (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : error.array()})
    }

    const { fullname , email , password } = req.body;

    const hashedpassword = await userModel.hashpassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname ,
        lastname: fullname.lastname ,
        email,
        password: hashedpassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({token , user});

}

module.exports.loginUser = async(req,res,next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : error.array()})
    }

    const {email , password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message: 'Invalid email or Password'});
    }
    const isMatch = await user.comparePassword(password);
    
    if(!isMatch){
        return res.status(401).json({message: 'Invalid email or Password'});
    }

    const token = user.generateAuthToken();
    

    res.cookie('token',token);
    res.status(200).json({token , user});
}

module.exports.getUserProfile = async (req, res , next) => {   
    res.status(200).json(req.user);
}