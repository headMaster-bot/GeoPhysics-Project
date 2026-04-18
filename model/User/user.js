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
        enum: [ 'Geophysic', 'Geologist', 'Engineer'],
        default: 'Geophysic',
        // required: true,
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
    stories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
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

// ✅ Virtual for project count
userSchema.virtual("projectCount").get(function () {
    return this.projects ? this.projects.length : 0;
});
// virtual for story count
userSchema.virtual("storyCount").get(function () {
    return this.stories ? this.stories.length : 0;
});

// ✅ Virtual for isActive
// userSchema.virtual("isActive").get(function () {
//     // A user is considered active if they have at least one project
//     return this.projectCount && this.projects.length > 0;
// })

// userSchema.virtual("isActive").get(function () {
//     return this.projects && this.projects.length > 0;
// });

userSchema.virtual("isActive").get(function () {
    return this.projects ? this.projects.length : 0;
});


const User = mongoose.model('User', userSchema);

module.exports = User;
