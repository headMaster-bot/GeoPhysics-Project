const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'project description is required'],
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    sprintDuration: {
        type: Number,
        default: 14,
    },
    linkedSurvey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        default: null,
    },
    teamMembers: [{
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed'],
        default: 'draft',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
