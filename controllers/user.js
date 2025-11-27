const User = require("../models/user")
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generateToken")

exports.registerForm = (req, res) => {
    res.render("users/register.ejs")
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({ message: "User Already Existed!" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            email: email,
            username: username,
            password: hashedPassword
        })
        res.status(200).json({ message: "User Created Successfully!" })
        req.flash("success", "Welcome To futMark (BookMark Your Day For Futsal)");
        res.redirect("/listings");
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error!" })
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

exports.loginForm = (req, res) => {
    res.render("users/login.ejs")
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found!" })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid Password!" })
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,           // protects from JS access
            secure: false,            // set true only in production on HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({ message: "User Logged In Successfully!", token })
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error!" })
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "User Logged Out Successfully!" })
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error!" })
    }
}
