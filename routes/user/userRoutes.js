const express = require('express');
const {
    userRegisterCtrl, userLoginCtrl,
    usersCtrl, userProfileCtrl, updateUserProfileCtrl,
    deleteUserAccountCtrl,
    deleteAllProjectsCtrl
} = require('../../controllers/user/userCtrl');
const isLogIn = require('../../middlewares/isLogIn');
const userRouter = express.Router()

// register 
userRouter.post("/register", userRegisterCtrl)
// login
userRouter.post("/login", userLoginCtrl)
// get all users
userRouter.get("/", usersCtrl)
// get user profile
userRouter.get("/profile", isLogIn, userProfileCtrl)
// update user profile
userRouter.put("/update/profile/:id", isLogIn, updateUserProfileCtrl)
// delete user account
userRouter.delete("/delete/account", isLogIn, deleteUserAccountCtrl)
userRouter.delete("/delete/all-projects", isLogIn, deleteAllProjectsCtrl)

module.exports = userRouter;