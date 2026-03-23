const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
   surveyName: {
    type: String,
    required: [true, 'Survey name is required'], // ✅ correct message
    trim: true,
},
    description: {
        type: String,
        trim: true,
    },
    surveyObjective: {
        type: String,
        required: [true, 'Survey objective is required'],
        enum: ['Environmental Assessment', 'Resource Exploration', 'Engineering Investigation', 'Archaeological Survey'],
    },
    // Survey Area
    // latitude: {
    //     type: String,
    //     required: [true, 'Latitude is required'],
    // },
    // longitude: {
    //     type: String,
    //     required: [true, 'Longitude is required'],
    // },
    // // Site Characterisation
    // vegetationDensity: {
    //     type: String,
    //     enum: ['Low', 'Medium', 'High'],
    // },
    // ambientNoise: {
    //     type: String,
    //     enum: ['Low', 'Medium', 'High'],
    // },
    // targetDepthRange: {
    //     type: String,
    //     enum: ['0-5m', '5-10m', '10-20m', '20-50m', '50m+'],
    // },
    // GIS Data
    // length: {
    //     type: Number,
    //     default: 0,
    // },
    // breadth: {
    //     type: Number,
    //     default: 0,
    // },
    // Client Information
    clientName: {
        type: String,
        trim: true,
    },
    clientEmail: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    targetCompletionDate: {
        type: Date,
    },
    // References
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'in_progress', 'completed'],
        default: 'draft',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Survey', surveySchema);