const Epic = require("../../model/EPic/Epic");
const Project = require("../../model/Project/Project");

// const createEpicCtrl = async (req, res) => {
//     const { title, description, priority, project } = req.body
//     try {
//         const projectId = await Project.findById(req.params.id);
//         if (!projectId) {
//             res.json({
//                 status: "Failed",
//                 message: "Project not found",
//             })
//         }
//         const titleExists = await Epic.findOne({ title });
//         if (titleExists) {
//             return res.json({
//                 status: "failed",
//                 message: "Epic already exists"
//             })
//         }
//         const createEpic = await Epic.create({

//             title,
//             description,
//             priority,
//             project,
//             user: req.userAuth
//         });
//         res.json({
//             status: "Success",
//             messsage: createEpic,
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// }

const createEpicCtrl = async (req, res) => {
    const { title, description, priority, project } = req.body;

    try {
        const projectExists = await Project.findById(project);

        if (!projectExists) {
            return res.status(404).json({
                status: "failed",
                message: "Project not found",
            });
        }

        // Check if epic exists in THIS project
        const titleExists = await Epic.findOne({
            title,
            project: projectExists._id,
        });

        if (titleExists) {
            return res.status(400).json({
                status: "failed",
                message: "Epic already exists in this project",
            });
        }

        const epic = await Epic.create({
            title,
            description,
            priority,
            project,// ✅ correct
            user: req.userAuth,
        });

        res.status(201).json({
            status: "success",
            data: epic,
        });

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message,
        });
    }
};

const getAllEpicsCtrl = async (req, res) => {
    try {
        const epics = await Epic.find().populate("stories");
        return res.json({
            status: "Success",
            message: epics,
        })
    } catch (error) {
        res.json(error.message)
    }
}

// const Epic = require("../models/Epic");

// const getAllEpicsCtrl = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     if (!projectId) {
//       return res.status(400).json({
//         status: "Error",
//         message: "projectId is required",
//       });
//     }

//     // const epics = await Epic.find({ project: projectId })
//     const epics = await Epic.find({}).populate("stories")
//     //   .populate("project");

//     return res.status(200).json({
//       status: "Success",
//       data: epics,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       status: "Error",
//       message: error.message,
//     });
//   }
// };

// single-epic
const getEpicCtrl = async (req, res) => {
    try {
        const epic = await Epic.findById(req.params.id);
        if (!epic) {
            return res.json({
                status: "Failed",
                message: "Epic not found",
            })
        }
        return res.json({
            status: "Success",
            message: epic,
        })
    } catch (error) {
        res.json(error.message)
    }
}

// ✅ getEpicsByProject (Main Fix)
// const getEpicsByProjectCtrl = async (req, res) => {
//     try {
//         const { projectId } = req.params;

//         const epics = await Epic.find({ project: projectId })
//             .populate("project") // for project name
//             //.populate("stories"); // optional, if you have a reference

//         if (!epics || epics.length === 0) {
//             return res.json({
//                 status: "Failed",
//                 message: "No epics found for this project",
//             });
//         }

//         return res.json({
//             status: "Success",
//             message: epics,
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: "Error",
//             message: error.message,
//         });
//     }
// };


module.exports = {
    createEpicCtrl,
    getAllEpicsCtrl,
    getEpicCtrl,
    // getEpicsByProjectCtrl,
}