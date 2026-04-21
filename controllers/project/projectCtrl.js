const Project = require("../../model/Project/Project");
const User = require("../../model/User/user");

const createProjectCtrl = async (req, res) => {
  const { projectName, description, startDate, endDate } = req.body;

  try {
    const userFound = await User.findById(req.userAuth);

    if (!userFound) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found"
      });
    }

    const projectExists = await Project.findOne({ projectName });

    if (projectExists) {
      return res.status(400).json({
        status: "Failed",
        message: "Project already exists"
      });
    }

    // ✅ Create project
    const project = await Project.create({
      projectName,
      description,
      startDate,
      endDate,
      user: userFound._id,
    });

    // push project to user's projects array
    userFound.projects.push(project);
    await userFound.save();

    // ✅ Increment totalProjects in User
    const updatedUser = await User.findByIdAndUpdate(
      req.userAuth,
      { $inc: { totalProjects: 1 } },
      { returnDocument: "after" }
    );

    res.status(201).json({
      status: "Success",
      message: "Project created successfully",
      data: project,
      totalProjects: updatedUser.totalProjects,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProjectsCtrl = async (req, res) => {
  // console.log(req.userAuth, "user");
  try {
    const projects = await Project.find()
    res.json({
      status: "Success",
      message: projects,
      data: projects,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('linkedSurvey');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateProjectCtrl = async (req, res) => {
  const { projectName, description, startDate, endDate, status } = req.body;

  try {
    // 1. Find project by ID
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: "Failed",
        message: "Project not found"
      });
    }

    // 2. Check ownership
    if (project.user.toString() !== req.userAuth) {
      return res.status(403).json({
        status: "Failed",
        message: "Not authorized"
      });
    }

    // 3. Prevent editing after completion
    if (project.status === "completed") {
      return res.status(400).json({
        status: "Failed",
        message: "Completed project cannot be modified"
      });
    }

    // 4. Prevent duplicate project name (excluding current project)
    if (projectName) {
      const projectExists = await Project.findOne({
        projectName,
        _id: { $ne: project._id }
      });

      if (projectExists) {
        return res.status(400).json({
          status: "Failed",
          message: "Project name already exists"
        });
      }
    }

    // 5. STATUS TRANSITION RULES
    const validTransitions = {
      draft: ['draft', 'in_progress'],
      in_progress: ['in_progress', 'completed'],
      completed: []
    };

    // if (status) {
    //   const currentStatus = project.status;

    //   if (!validTransitions[currentStatus].includes(status)) {
    //     return res.status(400).json({
    //       status: "Failed",
    //       message: `Cannot change status from ${currentStatus} to ${status}`
    //     });
    //   }
    // }

    // 6. VALIDATE BEFORE COMPLETING
    if (status === "completed") {
      if (!projectName && !project.projectName) {
        return res.status(400).json({
          status: "Failed",
          message: "Project name is required before completing"
        });
      }

      if (!description && !project.description) {
        return res.status(400).json({
          status: "Failed",
          message: "Description is required before completing"
        });
      }
    }

    // 7. UPDATE PROJECT
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectName,
        description,
        startDate,
        endDate,
        status: status || project.status
      },
      {
        returnDocument: 'after',
        runValidators: true
      }
    );

    return res.json({
      status: "Success",
      message: "Project updated successfully",
      data: updatedProject
    });

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message
    });
  }
};

const deleteProjectCtrl = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({
        status: "Failed",
        message: 'Project not found'
      });
    }
    res.json({
      status: "Success",
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createProjectCtrl,
  getProjectsCtrl,
  getProjectCtrl,
  updateProjectCtrl,
  deleteProjectCtrl,
};
