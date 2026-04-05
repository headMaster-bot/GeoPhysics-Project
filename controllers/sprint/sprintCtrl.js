const Sprint = require("../../model/Sprint/Sprint");

const createSprintCtrl = async (req, res) => {
    const { title, description, priority, startDate, endDate } = req.body;
    try {
        const sprintExists = await Sprint.findOne({ title });
        if (sprintExists) {
           return res.status(400).json({
                status: "Failed",
                message: "Sprint with this title already exists"
            });
            return;
        }
        const createSprint = await Sprint.create({
            title,
            description,
            priority,
            startDate,
            endDate,
            user: req.userAuth,
        })
        res.status(201).json({
            status: "Success",
            message: createSprint,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all sprints
const getAllSprintsCtrl = async (req, res) => {
    try {
        const sprints = await Sprint.find();
        res.status(200).json({
            status: "Success",
            message: sprints,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Single sprint details
const getSingleSprintCtrl = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);
        if (!sprint) {
            return res.status(404).json({
                status: "Failed",
                message: "Sprint not found"
            });
        }
        res.status(200).json({
            status: "Success",
            message: sprint,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createSprintCtrl,
    getAllSprintsCtrl,
    getSingleSprintCtrl,
}