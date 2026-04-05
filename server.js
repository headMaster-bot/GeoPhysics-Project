const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user/userRoutes');
const projectRouter = require('./routes/project/projectRoutes');
const surveyRouter = require('./routes/survey/surveyRoutes');
const cors = require("cors");
const epicRoutes = require('./routes/epic/epicRoutes');
const storyRoutes = require('./routes/story/storyRoutes');
const sprintRouter = require('./routes/sprint/sprintRoutes');
dotenv.config();

const app = express();
require("./config/connectDb");

// middleware
app.use(express.json());
app.use(cors())

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/surveys", surveyRouter);
app.use("/api/v1/epics", epicRoutes);
app.use("/api/v1/stories", storyRoutes);
app.use("/api/v1/sprints", sprintRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`))