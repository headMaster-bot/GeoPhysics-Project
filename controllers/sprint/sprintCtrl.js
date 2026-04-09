const Project = require("../../model/Project/Project");
const Sprint = require("../../model/Sprint/Sprint");

const createSprintCtrl = async (req, res) => {
  const { title, description, priority, startDate, endDate, project } = req.body;

  try {
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        status: "Failed",
        message: "Project not found"
      });
    }

    const sprintExists = await Sprint.findOne({ title, project });
    if (sprintExists) {
      return res.status(400).json({
        status: "Failed",
        message: "Sprint with this title already exists in this project"
      });
    }

    const createSprint = await Sprint.create({
      title,
      description,
      priority,
      startDate,
      endDate,
      project,
      user: req.userAuth
    });

    // Populate project name for frontend display
    await createSprint.populate('project', 'projectName');

    res.status(201).json({
      status: "Success",
      sprint: createSprint,  // ✅ return the sprint object
    });

  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

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

// Get sprints by project ID
const getSprintsByProjectCtrl = async (req, res) => {
  try {
    const { projectId } = req.params;

    const sprints = await Sprint.find({ project: projectId })
      .populate("project", "projectName");

    if (!sprints || sprints.length === 0) {
      return res.status(200).json({
        status: "Success",
        message: [],
      });
    }

    return res.status(200).json({
      status: "Success",
      message: sprints,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

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
  getSprintsByProjectCtrl,
  getSingleSprintCtrl,
}