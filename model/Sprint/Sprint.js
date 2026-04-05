const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
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
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
    {
        timestamps: true,
    }
);

// compile
const Sprint = mongoose.model('Sprint', sprintSchema);

module.exports = Sprint;