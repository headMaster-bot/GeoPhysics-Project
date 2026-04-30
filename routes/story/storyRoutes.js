const express = require('express');
const isLogIn = require('../../middlewares/isLogIn');
const { createStoryCtrl, getAllStoryCtrl, getStoryCtrl, getStoriesByEpicCtrl, updateStoryStatusCtrl, getStoriesByProjectCtrl } = require('../../controllers/story/storyCtrl');
const storyRoutes = express.Router();

storyRoutes.post('/create-story', isLogIn, createStoryCtrl);
storyRoutes.get('/all-story', getAllStoryCtrl);
storyRoutes.get('/single-story/:id',isLogIn, getStoryCtrl);
storyRoutes.get('/stories-by-epic/:epicId',isLogIn, getStoriesByEpicCtrl);
storyRoutes.get('/project/:projectId',isLogIn, getStoriesByProjectCtrl);
storyRoutes.put("/update-status/:storyId", updateStoryStatusCtrl);


module.exports = storyRoutes;