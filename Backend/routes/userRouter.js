const express = require("express");
const { registerUser,loginUser,getUserProfile,logoutUser } = require("../controller/userController");
const router = express.Router();
const {body} = require("express-validator");
const authUser = require("../middlewares/authMiddleware");


//Register
router.post("/register",
    [
        body('fullName.firstName').isLength({min:3}).withMessage("First name must be at least 3 characters long"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
    ],
    registerUser
);

//Login
router.post("/login",[
    body('email').isEmail().withMessage("Invalid email"),
    body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long")
],loginUser)

//Profile
router.get("/profile", authUser, getUserProfile);

//Logout
router.post("/logout",authUser,logoutUser);


module.exports = router;