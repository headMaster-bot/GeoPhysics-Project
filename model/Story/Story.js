const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

// compile 
const Story = mongoose.model("Story", storySchema);
// export
module.exports = Story;