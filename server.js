const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user/userRoutes');
const cors = require("cors")
dotenv.config();

const app = express();
require("./config/connectDb");

// middleware
app.use(express.json());
app.use(cors())

// routes
app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`))