const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Fullname name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },

    organisation: {
        type: String,
        // required: true,
        default: null
    },
    jobTitle: {
        type: String,
        // required: true,
        default: null
    },
    totalProjects: {
        type: Number,
        default: 0
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'geophysic', 'geologist', 'engineer'],
        default: 'user',
    },
    // geophysics-specific profile (optional)
    //   affiliation: String,         // e.g. university or company
    //   expertise: [String],         // areas of geophysics interest
    survey: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

// ✅ Virtual for initials
userSchema.virtual("initials").get(function () {
    if (!this.fullName) return "";

    const names = this.fullName.trim().split(" ");

    const firstInitial = names[0]?.charAt(0).toUpperCase() || "";
    const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : "";

    return `${firstInitial}${lastInitial}`; // or `${firstInitial} ${lastInitial}`
});

const User = mongoose.model('User', userSchema);

module.exports = User;
