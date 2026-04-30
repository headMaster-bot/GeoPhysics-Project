const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        // required: function () {
        //     return this.status !== "draft"; // ✅ only required if NOT draft
        // },
        required: true,
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
    // stories: [{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: "Story"
    // }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'completed'],
        default: 'active',
    },
    // stories: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Story"
    // }],
    type: {
        type: String,
        enum: ["project"],
        default: "project",
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },   // ✅ IMPORTANT
    toObject: { virtuals: true },
});

module.exports = mongoose.model('Project', projectSchema);
