// this folder will contain all the routes related to authentication like register, login, logout, etc.

const express = require('express');
const authController = require('../controllers/auth.controller')


const router = express.Router();

// Register route
router.post('/register', authController.registerUser);  // yeh line POST request ke liye /register route define kar rahi hai. Jab bhi koi client /register endpoint par POST request bhejega, toh authController ke registerUser function ko call kiya jayega.

router.post('/login', authController.loginUser);  // yeh line POST request ke liye /login route define kar rahi hai. Jab bhi koi client /login endpoint par POST request bhejega, toh authController ke loginUser function ko call kiya jayega.




module.exports = router;