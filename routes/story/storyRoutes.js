const express = require('express');
const isLogIn = require('../../middlewares/isLogIn');
const { createStoryCtrl, getAllStoryCtrl, getStoryCtrl } = require('../../controllers/story/storyCtrl');
const storyRoutes = express.Router();

storyRoutes.post('/create-story', isLogIn, createStoryCtrl);
storyRoutes.get('/all-story', getAllStoryCtrl);
storyRoutes.get('/single-story/:id',isLogIn, getStoryCtrl);

module.exports = storyRoutes;