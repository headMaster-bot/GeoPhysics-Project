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
      draft: ['in_progress', 'draft'],
      in_progress: ['draft', 'completed'],
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

// saves project to draft
// saveDraftCtrl.js

const saveDraftCtrl = async (req, res) => {
  try {
    const { projectId, ...data } = req.body;

    let survey;

    if (projectId) {
      // 🔁 UPDATE EXISTING DRAFT
      survey = await Survey.findByIdAndUpdate(
        surveyId,
        { ...data, status: "draft" },
        { new: true, runValidators: false } // ✅ KEY
        // { new: true }
      );
    } else {
      // 🆕 CREATE NEW DRAFT
      survey = await Project.create({
        ...data,
        user: req.userAuth,
        status: "draft",
      });
    }

    res.json({
      status: "success",
      survey,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
// get all draft by query
const DraftsCtrl = async (req, res) => {
  const { status } = req.query;

  const projects = await Project.find({
    user: req.userAuth,
    ...(status && { status }),
  }).sort({ createdAt: -1 });

  res.json(projects);
};

// controllers/survey/getDraftCtrl.js
const getDraftCtrl = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      status: "success",
      project,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// const saveCompletedCtrl = async (req, res) => {
//     console.log("BODY:", req.params.id);

//   try {

//     const projectId = await Project.findById(req.params.id)
//     if (!projectId) {
//         return res.json({
//             status: "Failed",
//             message: "Project Id not found",
//         })
//     }

//     // ✅ Validate ID
//     // if (!surveyId) {
//     //   return res.status(400).json({
//     //     status: "error",
//     //     message: "Survey ID is required",
//     //   });
//     // }

//     // ✅ FIRST: find survey
//     // const existingSurvey = await Survey.findById(surveyId);

//     // if (!existingSurvey) {
//     //   return res.status(404).json({
//     //     status: "error",
//     //     message: "Survey not found",
//     //   });
//     // }

//     // ✅ BLOCK if already completed (CHECK BEFORE UPDATE)
//     if (projectId.status === "completed") {
//       return res.status(400).json({
//         status: "success",
//         message: "Project already completed, you can not edit this project",
//       });
//     }

//     // ✅ NOW update
//     const updatedProject = await Project.findByIdAndUpdate(
//       projectId,
//       { status: "completed" },
//       { returnDocument: "after" } // ✅ IMPORTANT
//     );

//     return res.status(200).json({
//       status: "success",
//       message: "Project completed successfully",
//       project: updatedProject,
//     });

//   } catch (error) {
//     console.error("Save completed error:", error);

//     return res.status(500).json({
//       status: "error",
//       message: "Server error",
//     });
//   }
// };
const saveCompletedCtrl = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("PROJECT ID:", id);

    // ✅ Find project first
    const existingProject = await Project.findById(id);

    if (!existingProject) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    // ✅ Block if already completed
    if (existingProject.status === "completed") {
      return res.status(400).json({
        status: "error",
        message: "Project already completed, you cannot edit it",
      });
    }

    // ✅ Update using ID (NOT document)
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { status: "completed" },
      { returnDocument: "after" } // ✅ correct option
    );

    return res.status(200).json({
      status: "success",
      message: "Project completed successfully",
      project: updatedProject,
    });

  } catch (error) {
    console.error("Save completed error:", error);

    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// get both drafts and complete status once
const draftAndCompleteCtrl = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {
      user: req.userAuth,
    };

    if (status) {
      const statuses = status.split(","); 
      filter.status = { $in: statuses };
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};
// all complete project
// get all draft by query
// const completeProjectDraftsCtrl = async (req, res) => {
//   const { status } = req.query;

//   const projects = await Project.find({
//     user: req.userAuth,
//     ...(status && { status }),
//   }).sort({ createdAt: -1 });

//   res.json(projects);
// };

// delete project
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



// module.exports = saveDraftCtrl;

module.exports = {
  createProjectCtrl,
  getProjectsCtrl,
  getProjectCtrl,
  updateProjectCtrl,
  deleteProjectCtrl,
  saveDraftCtrl,
  DraftsCtrl,
  getDraftCtrl,
  saveCompletedCtrl,
  draftAndCompleteCtrl,
};
