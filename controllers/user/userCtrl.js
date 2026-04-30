const User = require("../../model/User/user");
const bcrypt = require('bcryptjs');
const generateToken = require("../../utils/generateToken");
const getTokenFromHeader = require("../../utils/getTokenFromHeader");
const Project = require("../../model/Project/Project");
const Epic = require("../../model/EPic/Epic");
const Story = require("../../model/Story/Story");
const Sprint = require("../../model/Sprint/Sprint");
const Survey = require("../../model/Survey/Survey");


// @desc    User registration controller
// @route   POST /api/v1/users/register
// @access  Public

const userRegisterCtrl = async (req, res) => {
    const { fullName, email, password, organisation, role } = req.body;

    try {
        // Check if user exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                status: "Failed",
                message: "Email already exists"
            });
        }

        // Hash password
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);

        // ✅ FIX: normalize role (Title Case)
        const formattedRole =
            role
                ? role.trim().charAt(0).toUpperCase() + role.trim().slice(1).toLowerCase()
                : 'Geophysics';

        // Optional safety check (recommended)
        const allowedRoles = ['Geophysicist', 'Geologist', 'Engineer'];

        if (!allowedRoles.includes(formattedRole)) {
            return res.status(400).json({
                status: "Failed",
                message: "Invalid role selected"
            });
        }

        // Create user
        const createUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            organisation,
            role: formattedRole,
        });

        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            user: createUser
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// @desc    User login controller
// @route   POST /api/v1/users/login
// @access  Public
const userLoginCtrl = async (req, res) => {
    const { email, password } = req.body
    try {
        const userFound = await User.findOne({ email })
        if (!userFound) {
            return res.status(400).json({
                message: "Invalid login credentials"
            })
        }
        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, userFound.password);
        // console.log(userFound, "login");

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid login credentials"
            })
        }
        res.json({
            status: "success",
            message: {
                id: userFound._id,
                firstName: userFound.fullName,
                isAdmin: userFound.isAdmin,
                email: userFound.email,
                token: generateToken(userFound._id)
            }
        })
    } catch (error) {
        res.status(500).json({
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
// const userProfileCtrl = async (req, res) => {
//     // console.log(req.userAuth, "ctrl");

//     try {
//         const user = await User.findById(req.userAuth).populate("stories");
//         // console.log(user);
//         // const token = getTokenFromHeader(req);
//         // console.log(token, "123");
//         const projects = await Project.find({
//             user: req.userAuth,
//         }).sort({ createdAt: -1 });

//         const surveys = await Survey.find({
//             user: req.userAuth,
//         }).sort({ createdAt: -1 });

//         res.json({
//             status: "success",
//             message: {
//                 ...user._doc,
//                 projects,
//                 survey: surveys,
//             },
//         });
//         res.json({
//             status: "success",
//             message: user,
//         },
//             {
//                 new: true,
//             }
//         )
//     } catch (error) {
//         res.json({
//             message: error.message
//         })
//     }
// }

const userProfileCtrl = async (req, res) => {
    try {
        const user = await User.findById(req.userAuth)
            .populate("stories")
            .populate("projects")
            .populate("survey");

        const projects = await Project.find({
            user: req.userAuth,
        }).sort({ createdAt: -1 });

        const surveys = await Survey.find({
            user: req.userAuth,
        }).sort({ createdAt: -1 });

        return res.json({
            status: "success",
            message: {
                // ...user._doc,
                ...user.toObject(),
                projects,
                survey: surveys,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// update user profile controller
// @desc    update user profile controller
// @route   PUT /api/v1/users/profile/:id
const updateUserProfileCtrl = async (req, res) => {
    const { fullName, email, jobTitle, organisation } = req.body;
    try {
        const user = await User.findById(req.userAuth);
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
            });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                fullName,
                email,
                jobTitle,
                organisation
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: "Failed",
                message: "Failed to update user",
            });
        }

        res.json({
            status: "Success",
            message: updatedUser,
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
}
// delete account
const deleteUserAccountCtrl = async (req, res) => {
    try {
        // find the user to  be deleted
        const userToDelete = await User.findById(req.userAuth);
        if (!userToDelete) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
            })
        }
        await Project.deleteMany({ user: req.userAuth });
        await Epic.deleteMany({ user: req.userAuth });
        await Story.deleteMany({ user: req.userAuth });
        await Sprint.deleteMany({ user: req.userAuth });
        await Survey.deleteMany({ user: req.userAuth });

        // delete the user account
        await userToDelete.deleteOne();
        res.status(200).json({
            status: "Success",
            message: "User account deleted successfully",
        })
    } catch (error) {
        res.json(error.message);
    }
}

// delete projects
const deleteAllProjectsCtrl = async (req, res) => {
    try {
        const userId = req.userAuth;

        await Project.deleteMany({ user: userId });
        await Epic.deleteMany({ user: userId });
        await Story.deleteMany({ user: userId });
        await Sprint.deleteMany({ user: userId });
        await Survey.deleteMany({ user: userId });

        res.status(200).json({
            status: "Success",
            message: "All projects and related data deleted",
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
};




module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    usersCtrl,
    userProfileCtrl,
    updateUserProfileCtrl,
    deleteUserAccountCtrl,
    deleteAllProjectsCtrl,
}