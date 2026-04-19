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
        enum: [ 'Geophysics', 'Geologist', 'Engineer'],
        default: 'Geophysics',
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
// story total points
userSchema.virtual("totalPoints").get(function () {
    if (!this.stories || this.stories.length === 0) return 0;

    return this.stories.reduce((total, story) => total + (story.points || 0), 0);
});

// projects duration virtual
// userSchema.virtual("totalProjectDuration").get(function () {
//     if (!Array.isArray(this.projects) || this.projects.length === 0) {
//         return 0;
//     }

//     return this.projects.reduce((total, project) => {
//         return total + (project?.sprintDuration ?? 0);
//     }, 0);
// });

// userSchema.virtual("totalProjectDuration").get(function () {
//     if (!Array.isArray(this.projects) || this.projects.length === 0) {
//         return "0 days";
//     }

//     const totalDays = this.projects.reduce((total, project) => {
//         if (!project?.startDate || !project?.endDate) return total;

//         const ms = new Date(project.endDate) - new Date(project.startDate);
//         const days = ms / (1000 * 60 * 60 * 24);

//         return total + days;
//     }, 0);

//     const roundedDays = Math.floor(totalDays);

//     // 🔥 Your logic here
//     if (roundedDays < 7) {
//         return `${roundedDays} day${roundedDays !== 1 ? "s" : ""}`;
//     }

//     const weeks = Math.floor(roundedDays / 7);

//     return `${weeks} week${weeks !== 1 ? "s" : ""}`;
// });

userSchema.virtual("totalProjectDuration").get(function () {
    if (!Array.isArray(this.projects) || this.projects.length === 0) {
        return "0 days";
    }

    const project = this.projects[this.projects.length - 1]; // latest project

    if (!project?.startDate || !project?.endDate) {
        return "0 days";
    }

    const ms = new Date(project.endDate) - new Date(project.startDate);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days < 7) {
        return `${days} day${days !== 1 ? "s" : ""}`;
    }

    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
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
