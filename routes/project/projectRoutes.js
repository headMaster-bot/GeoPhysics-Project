const express = require('express');
const { createProjectCtrl, getProjectsCtrl, getProjectCtrl, updateProjectCtrl, deleteProjectCtrl } = require('../../controllers/project/projectCtrl');
const isLogIn = require('../../middlewares/isLogIn');
const projectRouter = express.Router();

// create project
projectRouter.post("/create-project", isLogIn, createProjectCtrl);
// get all projects for user
projectRouter.get("/all-projects", getProjectsCtrl);
// get single project
projectRouter.get("/single-project/:id", isLogIn, getProjectCtrl);
// update project
projectRouter.put("/update/:id",isLogIn, updateProjectCtrl);
// delete project
projectRouter.delete("/delete/:id", isLogIn, deleteProjectCtrl);

module.exports = projectRouter;