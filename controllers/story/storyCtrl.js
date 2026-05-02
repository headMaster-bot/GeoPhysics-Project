const mongoose = require("mongoose");
const Epic = require("../../model/EPic/Epic");
const Project = require("../../model/Project/Project");
const Story = require("../../model/Story/Story");
const User = require("../../model/User/user");

// const createStoryCtrl = async (req, res) => {
//     // console.log("req.userAuth:", req.userAuth);
//     const { title, description, epic, priority, points, assigned } = req.body;
//     try {
//         // find user
//         const userFound = await User.findById(req.userAuth);
//         // console.log(userFound, "User");

//         if (!userFound) {
//             return res.status(404).json({
//                 status: "Failed",
//                 message: "User not found"
//             });
//         }
//         const storyExists = await Story.findOne({ title });
//         if (storyExists) {
//             return res.status(400).json({
//                 status: "Failed",
//                 message: "Story with this title already exists"
//             });
//         }
//         const createStory = await Story.create({
//             title, 
//             description, 
//             epic, 
//             priority, 
//             points, 
//             assigned,
//             user: req.userAuth,
//         })
//         // push the story to the user's stories array
//         userFound.stories.push(createStory);
//         await userFound.save();
//         res.status(201).json({ 
//             status: "Success",
//             message: createStory,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// all story

const createStoryCtrl = async (req, res) => {
  // console.log("REQ BODY:", req.body);
  console.log(req.userAuth, "story user");

  try {
    const { title, description, epicId, priority, points, projectId } = req.body;
    const storyExists = await Story.findOne({ title });
    // find user
    // const userFound = await User.findById(req.userAuth)
    // console.log("USER FOUND:", userFound?._id);
    if (storyExists) {
      return res.status(400).json({
        status: "Failed",
        message: "Story with this title already exists",
      });
    }

    // 1. Create story
    const story = await Story.create({
      title,
      description,
      epicId,
      projectId,
      priority,
      points,
      user: req.userAuth,
    });

    // 2. Push story into Epic
    await Epic.findByIdAndUpdate(epicId, {
      $push: { stories: story._id },
    });
    await Project.findByIdAndUpdate(projectId, {
      $push: { stories: story._id },
    });
    // push to user stories array
    // userFound.stories.push(story);

    // console.log( userFound.stories.push(story._id), "push");

    // await userFound.save();
    console.log(story, "story");


    res.json({
      status: "Success",
      data: story,
    });
  } catch (error) {
    console.log("CREATE STORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

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

const getStoriesByEpicCtrl = async (req, res) => {
  try {
    const epicId = req.params.epicId;
    console.log("EPIC ID FROM UI:", epicId);

    const stories = await Story.find({ epic: epicId });
    // console.log(stories, "Stories");


    res.status(200).json({
      status: "Success",
      data: stories,
    });

  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// const getStoriesByProjectCtrl = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     // 1. Get all epics under this project
//     const epics = await Epic.find({ project: projectId }).select("_id");

//     const epicIds = epics.map((epic) => epic._id);

//     // 2. Get all stories that belong to those epics
//     const stories = await Story.find({
//       epicId: { $in: epicIds },
//     })
//       .populate("epicId")
//       .populate("user");

//     res.json({
//       status: "Success",
//       data: stories,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Failed",
//       message: error.message,
//     });
//   }
// };

// update story status

const getStoriesByProjectCtrl = async (req, res) => {
  console.log("PARAMS:", req.params);
  console.log("PROJECT ID:", req.params.projectId);
  try {
    const { projectId } = req.params;

    const stories = await Story.find({ projectId })
      .populate("user")
      .populate("epicId");

    return res.json({
      status: "Success",
      data: stories,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStoryStatusCtrl = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { status } = req.body;

    // validate status (important)
    const validStatus = ["Pending", "In Progress", "Completed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const story = await Story.findByIdAndUpdate(
      storyId,
      { status },
      { returnDocument: "after" }
    );

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    res.json({
      status: "Success",
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjectStoryStatsCtrl = async (req, res) => {
  try {
    const { projectId } = req.params;

    const stats = await Story.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $group: {
          _id: "$projectId",

          // ✅ total stories
          totalStories: { $sum: 1 },

          // ✅ total points
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    return res.json({
      status: "success",
      data: stats[0] || {
        totalStories: 0,
        totalPoints: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createStoryCtrl,
  getAllStoryCtrl,
  getStoryCtrl,
  getStoriesByEpicCtrl,
  getStoriesByProjectCtrl,
  updateStoryStatusCtrl,
  getProjectStoryStatsCtrl,
}       