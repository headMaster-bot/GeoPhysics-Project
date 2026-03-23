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

        // ✅ Increment totalProjects in User
        const updatedUser = await User.findByIdAndUpdate(
            req.userAuth,
            { $inc: { totalProjects: 1 } },
            { returnDocument: "after" }
        );

        res.status(201).json({
            status: "Success",
            data: project,
            totalProjects: updatedUser.totalProjects, // ✅ from DB
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
        const userFound = await User.findById(req.userAuth);
        if (!userFound) {
            res.json({
                status: "Failed",
                data: "User not found"
            })
        }
        const projects = await Project.find()
        res.json({
            status: "Success",
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
    const { projectName } = req.body
    try {
        const projectExists = await Project.findOne({ projectName })
        if (projectExists) {
            return res.json({
                status: "Failed",
                data: "Project already exists"
            });
        }
        if (!projectName) {
            return res.json({
                msg: "Project not found"
            })
        }
        if (projectName) {

            const updateProject = await Project.findByIdAndUpdate({ _id: req.params.id, user: req.userAuth }, {
                projectName,
            },
                {
                    returnDocument: 'after'
                }
            );
            return res.json({
                status: "Success",
                data: updateProject,
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const updateProjectCtrl = async (req, res) => {
//     const { projectName } = req.body;

//     try {

//         const project = await Project.findOneAndUpdate(
//             { _id: req.params.id, user: req.userAuth }, // ✅ filter
//             { projectName }, // ✅ update
//             { new: true } // ✅ correct place
//         );
//         if (!project) {
//             return res.status(404).json({
//                 status: "Failed",
//                 message: "Project not found or not authorized",
//             });
//         }

//         res.json({
//             status: "Success",
//             data: project,
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
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
