const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    surveyName: {
        type: String,
        // required: [true, 'Survey name is required'], // ✅ correct message
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    surveyObjective: {
        type: String,
        // required: [true, 'Survey objective is required'],
        enum: ['Environmental Assessment', 'Groundwater Exploration', 'Engineering Investigation', 'Archaeological Survey'],
    },
    // Survey Area
    latitude: {
        type: String,
        required: false,
    },
    longitude: {
        type: String,
        required: false,
    },
    // Site Characterisation
    vegetationDensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
    },
    ambientNoise: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
    },
    // targetDepthRange: {
    //     type: String,
    //     // enum: ['0-5m', '5-10m', '10-20m', '20-50m', '50m+'],
    // },
    // GIS Data
    length: {
        type: Number,
        default: 0,
    },
    breadth: {
        type: Number,
        default: 0,
    },
    layoutPattern: {
        type: String,
        enum: ['grid', 'linear', 'random'],
    },
    stationSpacing: {
        type: Number,
    },
    lineSpacing: {
        type: Number,
    },
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
    minDepth: {
        type: Number,
    },
    maxDepth: {
        type: Number,
    },
    geologicalSetting: {
        type: String,
        enum: ['Nigeria Sedimentary Basin', 'Nigeria Basement Complex'],
    },
    // siteConstraints: {
    //     type: [String],
    //     default: [],
    // },
    recommendedMethods: {
        type: Array,
        default: [],
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