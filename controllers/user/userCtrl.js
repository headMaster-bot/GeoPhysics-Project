const User = require("../../model/User/user");
const bcrypt = require('bcryptjs');
const generateToken = require("../../utils/generateToken");
const getTokenFromHeader = require("../../utils/getTokenFromHeader");


// @desc    User registration controller
// @route   POST /api/v1/users/register
// @access  Public

const userRegisterCtrl = async (req, res) => {
    // console.log(req.body, "Register");
    const { fullName, email, password, organisation } = req.body
    try {
        // Check if passwords match

        const emailExists = await User.findOne({ email })
        if (emailExists) {
            return res.json({
                status: "Failed",
                message: "Email already existssss"
            })
        }
        // hash password
        // salt
        const genSalt = await bcrypt.genSalt(10);
        // hash
        const hashedPassword = await bcrypt.hash(password, genSalt);
        const createUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            organisation,
        })

        return res.json({
            status: "success",
            message: createUser,
        })
    } catch (error) {
        res.json(error.message)
    }
}

// @desc    User login controller
// @route   POST /api/v1/users/login
// @access  Public
const userLoginCtrl = async (req, res) => {
    const { email, password } = req.body
    try {
        const userFound = await User.findOne({ email })
        if (!userFound) {
            return res.json({
                status: "Failed",
                message: "Invalid login credentials"
            })
        }
        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, userFound.password);
        if (!isPasswordMatch) {
            return res.json({
                status: "Failed",
                message: "Invalid login credentials"
            })
        }
        res.json({
            status: "success",
            message: {
                firstName: userFound.fullName,
                isAdmin: userFound.isAdmin,
                email: userFound.email,
                token: generateToken(userFound._id)
            }
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

// @desc    All User controller
// @route   GET /api/v1/users
// @access  Public
const usersCtrl = async (req, res) => {
    try {
        const users = await User.find()
        res.json({
            status: "success",
            message: users,
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

// @desc    user profile controller
// @route   GET /api/v1/users/profile/:id
// @access  Public
const userProfileCtrl = async (req, res) => {
    // console.log(req.userAuth, "ctrl");

    try {
        const user = await User.findById(req.userAuth)
        // console.log(user);
        // const token = getTokenFromHeader(req);
        // console.log(token, "123");
        res.json({
            status: "success",
            message: user,
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
}


module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    usersCtrl,
    userProfileCtrl,
}