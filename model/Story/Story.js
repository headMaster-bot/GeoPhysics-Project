const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    epicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Epic',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    priority: {
        type: String,
    },
    points: {
        type: Number,
    },
    epic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Epic',
    },
    // projectId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Project",
    //     required: true,
    // },

    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    }
},
    {
        timestamps: true,
    }
);

// compile 
const Story = mongoose.model("Story", storySchema);
// export
module.exports = Story;