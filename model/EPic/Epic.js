const mongoose = require("mongoose");

const epicShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    stories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
{
    timestamps: true,
}
);

// compile

const Epic = mongoose.model('Epic', epicShema);
// export
module.exports = Epic;