const Project = require('../model/Project/Project');

const createProject = async (req, res) => {
    try {
        const { projectName, description, startDate, endDate, sprintDuration, linkedSurvey, teamMembers, status } = req.body;
        const user = req.userAuth;

        const project = new Project({
            projectName,
            description,
            startDate,
            endDate,
            sprintDuration,
            linkedSurvey,
            teamMembers,
            user,
            status,
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.userAuth }).populate('linkedSurvey');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('linkedSurvey');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};
