const Survey = require("../../model/Survey/Survey");
const User = require("../../model/User/user");
const getRecommendedMethods = require("../../services/recommendationEngine");

// @desc    Create a new survey
// @route   POST /api/v1/surveys
// @access  Private
const createSurveyCtrl = async (req, res) => {
    const {
        surveyName,
        description,
        surveyObjective,
        clientName,
        clientEmail,
        targetCompletionDate,
    } = req.body;

    try {
        // console.log(req.body); 
        const surveyExits = await Survey.findOne({ surveyName })
        if (surveyExits) {
            return res.json({
                status: "failed",
                message: "Survey already exist"
            })
        }

        const userFound = await User.findById(req.userAuth);

        if (!userFound) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }
        const surveyCreated = await Survey.create({
            surveyName,
            description,
            surveyObjective,
            clientName,
            clientEmail,
            targetCompletionDate,
            user: userFound._id
        });

        userFound.survey.push(surveyCreated._id);
        await userFound.save();

        res.status(201).json({
            status: "success",
            message: "Survey created successfully",
            surveyCreated
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// @desc    Get all surveys for a user
// @route   GET /api/v1/surveys
// @access  Private
const getUserSurveysCtrl = async (req, res) => {
    try {
        // const userId = req.userAuth;
        const surveys = await Survey.find()
        // const surveys = await Survey.find({ user: userId }).sort({ createdAt: -1 });

        res.json({
            status: "success",
            message: surveys
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// @desc    Get a single survey
// @route   GET /api/v1/surveys/:id
// @access  Private
const getSurveyCtrl = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id).populate('user', 'fullName email');

        if (!survey) {
            return res.status(404).json({
                status: "error",
                message: "Survey not found"
            });
        }

        // Check if user owns the survey
        if (survey.user._id.toString() !== req.userAuth) {
            return res.status(403).json({
                status: "error",
                message: "Not authorized to view this survey"
            });
        }

        res.json({
            status: "success",
            message: survey
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// @desc    Update a survey
// @route   PUT /api/v1/surveys/:id
// @access  Private
// const updateSurveyCtrl = async (req, res) => {
//     const { surveyName, latitude, longitude, vegetationDensity, ambientNoise, targetDepthRange,
//         layoutPattern, stationSpacing, lineSpacing, miniDepth, maxDepth
//     } = req.body
//     let recommendedMethods = [];
//     try {
//         const survey = await Survey.findById(req.params.id);

//         if (!survey) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "Survey not found"
//             });
//         }

//         // Check if user owns the survey
//         if (survey.user.toString() !== req.userAuth) {
//             return res.status(403).json({
//                 status: "error",
//                 message: "Not authorized to update this survey"
//             });
//         }

//         const updatedSurvey = await Survey.findByIdAndUpdate(req.params.id,
//             {
//                 surveyName,
//                 surveyObjective,
//                 latitude,
//                 longitude,
//                 vegetationDensity,
//                 ambientNoise,
//                 targetDepthRange,
//                 layoutPattern,
//                 stationSpacing,
//                 lineSpacing,
//                 miniDepth,
//                 maxDepth,
//                 // length, 
//                 // breadth
//             },

//              if (
//             surveyObjective === "Environmental Assessment" &&
//             geologicalSetting === "Nigerian Sedimentary Basin"
//         ) {
//             if (maxDepth >= 0.5 && minDepth <= 150) {
//                 recommendedMethods.push("Electrical Resistivity Tomography (ERT)");
//             }
//             if (maxDepth >= 13 && minDepth <= 300) {
//                 recommendedMethods.push("Time-Domain Electromagnetic");
//             }
//             if (maxDepth >= 1 && minDepth <= 60) {
//                 recommendedMethods.push("Frequency-Domain Electromagnetic");
//             }
//             if (maxDepth >= 3 && minDepth <= 50) {
//                 recommendedMethods.push("Seismic Refraction");
//             }
//             if (maxDepth >= 30 && minDepth <= 4000) {
//                 recommendedMethods.push("Seismic Reflection");
//             }
//             if (maxDepth >= 0.05 && minDepth <= 8) {
//                 recommendedMethods.push("Ground Penetrating Radar (GPR)");
//             }
//             if (maxDepth >= 0 && minDepth <= 500) {
//                 recommendedMethods.push("Magnetic Survey");
//             }
//         } else {
//             return "No recommendation available for the selected survey objective and geological setting.";
//         }

//         if (recommendedMethods.length > 0) {
//             return `Recommended method(s): ${ recommendedMethods.join(", ") }`;
//         } else {
//             return "No geophysical method matches the given depth range.";
//         }
//         {
//             returnDocument: "after",
//                 runValidators: true
//         }
//         );

// if (!updatedSurvey) {
//     return res.status(404).json({
//         status: "error",
//         message: "Survey not found or update failed"
//     });
// }

// res.json({
//     status: "success",
//     message: "Survey updated successfully",
//     survey: updatedSurvey
// });
//     } catch (error) {
//     res.status(500).json({
//         status: "error",
//         message: error.message
//     });
// }
// };

// const getRecommendedMethods = require("../services/recommendationEngine");

const updateSurveyCtrl = async (req, res) => {
    try {
        const {
            surveyName,
            surveyObjective, // env_ass, gw_ex, eng_inv, arc_sur
            geologicalSetting,
            minDepth,
            maxDepth,
            ...rest
        } = req.body;

        const survey = await Survey.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({ message: "Survey not found" });
        }

        if (survey.user.toString() !== req.userAuth) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const recommendedMethods = getRecommendedMethods({
            surveyObjective,
            geologicalSetting,
            minDepth,
            maxDepth
        });

        const updatedSurvey = await Survey.findByIdAndUpdate(
            req.params.id,
            {
                surveyName,
                surveyObjective,
                geologicalSetting,
                minDepth,
                maxDepth,
                ...rest,
                recommendedMethods
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        res.json({
            status: "success",
            survey: updatedSurvey,
            recommendedMethods: recommendedMethods.length
                ? recommendedMethods
                : ["No method matches the selected depth"]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a survey
// @route   DELETE /api/v1/surveys/:id
// @access  Private
const deleteSurveyCtrl = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({
                status: "error",
                message: "Survey not found"
            });
        }

        // Check if user owns the survey
        if (survey.user.toString() !== req.userAuth) {
            return res.status(403).json({
                status: "error",
                message: "Not authorized to delete this survey"
            });
        }

        await Survey.findByIdAndDelete(req.params.id);

        // Remove survey from user's surveys array
        await User.findByIdAndUpdate(req.userAuth, {
            $pull: { survey: req.params.id }
        });

        res.json({
            status: "success",
            message: "Survey deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

module.exports = {
    createSurveyCtrl,
    getUserSurveysCtrl,
    getSurveyCtrl,
    updateSurveyCtrl,
    deleteSurveyCtrl,
};