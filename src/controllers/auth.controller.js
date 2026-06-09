// isme hum api ka logic likhenge, jaise ki login, register, logout, etc.

const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');        

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
    const User = await userModel.create({  // create method userModel ka ek static method hai jo ek naya document create karta hai aur usse database me save karta hai. Isme hum username, email, password aur role pass kar rahe hain.
        username,
        email,
        password,
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