const express= require("express")
const router= express.Router();
const User= require("../models/user")
const userController=require("../controllers/user");
const { saveRedirectUrl } = require("../middleware/auth");

router.route("/register").get(userController.registerForm).post(saveRedirectUrl ,userController.registerUser)
router.route("/login").get(userController.loginForm).post(saveRedirectUrl,userController.loginUser)
router.get("/logout", userController.logoutUser)

module.exports=router;