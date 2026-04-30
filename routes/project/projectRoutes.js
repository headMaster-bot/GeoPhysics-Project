const express = require('express');
const { createProjectCtrl, getProjectsCtrl, getProjectCtrl,
    updateProjectCtrl, deleteProjectCtrl,
    getDraftCtrl,
    saveDraftCtrl,
    DraftsCtrl,
    saveCompletedCtrl,
    draftAndCompleteCtrl
} = require('../../controllers/project/projectCtrl');
const isLogIn = require('../../middlewares/isLogIn');
const projectRouter = express.Router();

// create project
projectRouter.post("/create-project", isLogIn, createProjectCtrl);
// get all projects for user
projectRouter.get("/all-projects", isLogIn, getProjectsCtrl);
// get single project
projectRouter.get("/single-project/:id", isLogIn, getProjectCtrl);
// update project
projectRouter.put("/update/:id", isLogIn, updateProjectCtrl);
// save to draft
projectRouter.post("/save-to-draft", isLogIn, saveDraftCtrl);
// get draft
projectRouter.get("/gets-draft", isLogIn, DraftsCtrl);
// draft by id
projectRouter.get("/draft/:projectId", isLogIn, getDraftCtrl);
// survey completed
projectRouter.put("/completed/:id", isLogIn, saveCompletedCtrl);
// both
projectRouter.get("/", isLogIn, draftAndCompleteCtrl);

// delete project
projectRouter.delete("/delete/:id", isLogIn, deleteProjectCtrl);

module.exports = projectRouter;