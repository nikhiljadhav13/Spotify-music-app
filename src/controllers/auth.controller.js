// isme hum api ka logic likhenge, jaise ki login, register, logout, etc.

const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');       

async function registerUser(req,res){

    const {username,email,password,role="user"}= req.body;  // yeh line req.body se username, email, password aur role ko extract kar raha hai. Agar role nahi diya gaya hai toh default value "user" set kar di jayegi.
    const isUserAlreadyExist = await userModel.findOne( 
       { $or:[                              // $or operator MongoDB ka ek logical operator hai jo multiple conditions ko check karta hai. Agar inme se koi bhi condition true hoti hai toh woh document match ho jata hai.
            {email: email},
            {username: username}
        ]}
    ); 
    if (isUserAlreadyExist) {
        return res.status(409).json({message: "User already exists"});
    }
    const hash = await bcrypt.hash(password,10);  // bcrypt.hash method password ko hash karta hai. Isme hum password aur salt rounds (10) pass kar rahe hain. Salt rounds hashing process ko aur secure banata hai.
    const User = await userModel.create({  // create method userModel ka ek static method hai jo ek naya document create karta hai aur usse database me save karta hai. Isme hum username, email, password aur role pass kar rahe hain.
        username,
        email,
        password: hash,
        role
    });


    const token = jwt.sign({
        id: User._id,
        role: User.role

    },process.env.JWT_SECRET);  // jwt.sign method JWT token generate karta hai. Isme hum payload (id aur role) aur secret key pass kar rahe hain.

    res.cookie("token",token); // res.cookie method HTTP response me cookie set karta hai. Isme hum cookie ka naam "token" aur uski value token pass kar rahe hain.

    res.status(201).json({
        message:"user registered successfully",
        User:{
            id: User._id,
            username: User.username,
            email: User.email,
            role: User.role
        }
    })
}

async function loginUser(req,res){

    const { username , email , password } =req.body;  // yeh line req.body se username, email aur password ko extract kar raha hai.

    const user = await userModel.findOne({
        $or:[
            {username: username},
            {email: email}
        ]
    })

    if (!user){
        return res.status(401).json({
            message: "invalid credentials"
        })
    }

    const isPasswordisValid = await bcrypt.compare(password, user.password);  // bcrypt.compare method plaintext password ko hashed password ke sath compare karta hai. Isme hum user se input password aur database me stored hashed password pass kar rahe hain.
    if (!isPasswordisValid){
        return res.status(401).json({
            message: "invalid credentials"
        })
    }

    const token = jwt.sign({
        id : user._id,
        role: user.role
    },process.env.JWT_SECRET);

    res.cookie("token", token);
    res.status(200).json({
        message: "login successful",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}

module.exports ={registerUser, loginUser}