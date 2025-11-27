const express= require("express")
const router= express.Router();
const User= require("../models/user")
const userController=require("../controllers/user")

router.route("/register").get(userController.registerForm).post(userController.registerUser)
router.route("/login").get(userController.loginForm).post(userController.loginUser)
router.get("/logout", userController.logoutUser)