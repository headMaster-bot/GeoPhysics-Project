const express = require('express');
const {
    createSurveyCtrl,
    getUserSurveysCtrl,
    getSurveyCtrl,
    updateSurveyCtrl,
    deleteSurveyCtrl
} = require('../../controllers/survey/surveyCtrl');
const isLogIn = require('../../middlewares/isLogIn');

const surveyRouter = express.Router();

// Create a new survey
surveyRouter.post("/create-survey", isLogIn, createSurveyCtrl);

// Get all surveys for the logged-in user
surveyRouter.get("/", isLogIn, getUserSurveysCtrl);

// Get a single survey
surveyRouter.get("/:id", isLogIn, getSurveyCtrl);

// Update a survey
surveyRouter.put("/:id", isLogIn, updateSurveyCtrl);

// Delete a survey
surveyRouter.delete("/:id", isLogIn, deleteSurveyCtrl);

module.exports = surveyRouter;