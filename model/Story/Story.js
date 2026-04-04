const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    epic: {
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
    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

// compile 
const Story = mongoose.model("Story", storySchema);
// export
module.exports = Story;