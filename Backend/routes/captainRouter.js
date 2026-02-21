const express = require("express");
const {registerCaptain,loginCaptain,logoutCaptain} = require("../controller/CaptainController.js");
const {body} = require("express-validator");
const authCaptain = require("../middlewares/authCaptainMiddleware.js");

const router = express.Router();

router.post("/register",[
    body("fullName.firstName").isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").isLength({min:3}).withMessage("Color must be at least 3 characters long"),
    body("vehicle.plateNumber").isLength({min:3}).withMessage("Plate number must be at least 3 characters long"),
    body("vehicle.capacity").isLength({min:1}).withMessage("Capacity must be at least 1"),
    body("vehicle.vehicleType").isLength({min:3}).withMessage("Vehicle type must be at least 3 characters long"),
    body("documents.license").isLength({min:3}).withMessage("License must be at least 3 characters long"),
    body("documents.registration").isLength({min:3}).withMessage("Registration must be at least 3 characters long"),
    body("documents.insurance").isLength({min:3}).withMessage("Insurance must be at least 3 characters long")
],registerCaptain);

router.post("/login",[
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
],loginCaptain)

router.post("/logout",authCaptain,logoutCaptain)

module.exports = router;
