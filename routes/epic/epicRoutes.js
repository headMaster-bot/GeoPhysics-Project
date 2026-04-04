const express = require("express");
const { createEpicCtrl, getAllEpicsCtrl, getEpicCtrl } = require("../../controllers/epic/epicCtrl");
const isLogIn = require("../../middlewares/isLogIn");
const epicRoutes = express.Router();

epicRoutes.post("/create-epic",isLogIn, createEpicCtrl)
epicRoutes.get("/all-epics", getAllEpicsCtrl)
epicRoutes.get("/single-epic/:id",isLogIn, getEpicCtrl)

module.exports = epicRoutes;