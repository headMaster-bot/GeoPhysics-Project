const express = require('express');
const {
    createSurveyCtrl,
    getUserSurveysCtrl,
    getSurveyCtrl,
    updateSurveyCtrl,
    deleteSurveyCtrl,
    updateSurveyStatusCtrl,
    saveDraftCtrl,
    getSurveysDraftCtrl,
    DraftsCtrl,
    getDraftCtrl,
    saveCompletedtrl,
    saveCompletedCtrl,
    completesCtrl,
} = require('../../controllers/survey/surveyCtrl');
const isLogIn = require('../../middlewares/isLogIn');

const surveyRouter = express.Router();

// Create a new survey
surveyRouter.post("/create-survey", isLogIn, createSurveyCtrl);

// Get all surveys for the logged-in user
surveyRouter.get("/all-surveys", getUserSurveysCtrl);

// Get a single survey
// surveyRouter.get("/:id", isLogIn, getSurveyCtrl);

// Update a survey
surveyRouter.put("/update/:id", isLogIn, updateSurveyCtrl);
// update status
surveyRouter.put("/update-status", updateSurveyStatusCtrl);
// save to draft
surveyRouter.post("/save-to-draft", isLogIn, saveDraftCtrl);
// survey completed
surveyRouter.put("/completed/:id", isLogIn, saveCompletedCtrl);
// get draft
surveyRouter.get("/gets-status", isLogIn, DraftsCtrl);
// draft by id
surveyRouter.get("/draft/:surveyId", isLogIn, getDraftCtrl);
// both
surveyRouter.get("/", isLogIn, completesCtrl);

// Delete a survey
surveyRouter.delete("/:id", isLogIn, deleteSurveyCtrl);

module.exports = surveyRouter;