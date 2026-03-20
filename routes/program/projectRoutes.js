const express = require('express');
const { createProject, getProjects, getProject, updateProject, deleteProject } = require('../../controllers/project/projectCtrl');
const isLogIn = require('../../middlewares/isLogIn');
const projectRouter = express.Router();

// create project
projectRouter.post("/", isLogIn, createProject);
// get all projects for user
projectRouter.get("/", isLogIn, getProjects);
// get single project
projectRouter.get("/:id", isLogIn, getProject);
// update project
projectRouter.put("/:id", isLogIn, updateProject);
// delete project
projectRouter.delete("/:id", isLogIn, deleteProject);

module.exports = projectRouter;