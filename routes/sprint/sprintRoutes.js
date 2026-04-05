const express = require('express');
const { createSprintCtrl, getAllSprintsCtrl, getSingleSprintCtrl } = require('../../controllers/sprint/sprintCtrl');
const isLogIn = require('../../middlewares/isLogIn');
const sprintRouter = express.Router();

sprintRouter.post("/create-sprint", isLogIn, createSprintCtrl);
sprintRouter.get("/all-sprints", getAllSprintsCtrl);
sprintRouter.get("/single-sprint/:id", getSingleSprintCtrl);

module.exports = sprintRouter;