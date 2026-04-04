const Story = require("../../model/Story/Story");

const createStoryCtrl = async (req, res) => {
    const { title, description, epic, priority, points, assigned } = req.body;
    try {
        const storyExists = await Story.findOne({ title });
        if (storyExists) {
            return res.json({
                status: "Failed",
                message: "Story with this title already exists"
            });
        }
        const createStory = await Story.create({
            title, 
            description, 
            epic, 
            priority, 
            points, 
            assigned,
            user: req.userAuth,
        })
        res.json({ 
            status: "Success",
            message: createStory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// all story
const getAllStoryCtrl = async (req, res) => {
    try {
        const stories = await Story.find();
        res.json({
            status: "Success",
            message: stories,
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get single story

const getStoryCtrl = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.json({
                status: "Failed",
                message: "Story not found",
            });
        }
        res.json({
            status: "Success",
            message: story,
        })
    } catch (error) {
        res.json({ message: error.message });
    }
}

module.exports = {
    createStoryCtrl, 
    getAllStoryCtrl,
    getStoryCtrl
}       