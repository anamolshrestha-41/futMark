const User = require("../models/user")
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generateToken")

exports.registerForm = (req, res) => {
    res.render("users/register.ejs", { currentUser: res.locals.currentUser })
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            req.flash("error", "User Already Exists!");
            return res.redirect("/user/register");
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save();
        
        // Auto-login after registration
        const token = generateToken(newUser);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });
        
        req.flash("success", "Welcome To futMark (BookMark Your Day For Futsal)");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/user/register");
    }
}

exports.loginForm = (req, res) => {
    res.render("users/login.ejs", { currentUser: res.locals.currentUser })
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "User Not Found!");
            return res.redirect("/user/login");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            req.flash("error", "Invalid Password!");
            return res.redirect("/user/login");
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });
        
        req.flash("success", `Welcome back, ${user.username}!`);
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
    catch (err) {
         req.flash("error", err.message);
        res.redirect("/user/login");
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        req.flash("success", "Logged Out Successfully!");
        res.redirect("/user/login");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/user/login");
    }
}
