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

// const updateSurveyCtrl = async (req, res) => {
//     try {
//         const {
//             surveyName,
//             surveyObjective,
//             geologicalSetting,
//             minDepth,
//             maxDepth,
//             ...rest
//         } = req.body;

//         // Debug logging
//         console.log('=== Update Survey Controller ===');
//         console.log('Request body:', req.body);
//         console.log('Parsed values:');
//         console.log('  surveyObjective:', `"${surveyObjective}"`, `(length: ${surveyObjective?.length})`);
//         console.log('  geologicalSetting:', `"${geologicalSetting}"`, `(length: ${geologicalSetting?.length})`);
//         console.log('  minDepth:', minDepth);
//         console.log('  maxDepth:', maxDepth);

//         const survey = await Survey.findById(req.params.id);

//         if (!survey) {
//             return res.status(404).json({ message: "Survey not found" });
//         }

//         if (survey.user.toString() !== req.userAuth) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         // Use provided surveyObjective or fallback to existing survey objective
//         const objectiveForRecommendation = surveyObjective || survey.surveyObjective;

//         console.log('Objective for recommendation:', objectiveForRecommendation);

//         const recommendedMethods = getRecommendedMethods({
//             surveyObjective: objectiveForRecommendation,
//             geologicalSetting,
//             minDepth: minDepth,
//             maxDepth: maxDepth
//         });

//         const updatedSurvey = await Survey.findByIdAndUpdate(
//             req.params.id,
//             {
//                 surveyName,
//                 surveyObjective,
//                 geologicalSetting,
//                 minDepth,
//                 maxDepth,
//                 ...rest,
//                 recommendedMethods
//             },
//             {
//                 returnDocument: "after",
//                 runValidators: true
//             }
//         );

//         res.json({
//             status: "success",
//             survey: updatedSurvey,
//             recommendedMethods: recommendedMethods.length
//                 ? recommendedMethods
//                 : ["No method matches the selected depth"]
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// @desc    Delete a survey
// @route   DELETE /api/v1/surveys/:id
// @access  Private

// const getRecommendedMethods = require("../services/recommendationEngine");

// const updateSurveyCtrl = async (req, res) => {
//   try {
//     const {
//       surveyName,
//       surveyObjective,
//       geologicalSetting,
//       latitude,
//       longitude,
//       vegetationDensity,
//       ambientNoise,
//       targetDepthRange,
//       layoutPattern,
//       stationSpacing,
//       lineSpacing,
//       minDepth,
//       maxDepth
//     } = req.body;

//     const survey = await Survey.findById(req.params.id);

//     if (!survey) {
//       return res.status(404).json({
//         status: "error",
//         message: "Survey not found"
//       });
//     }

//     if (survey.user.toString() !== req.userAuth) {
//       return res.status(403).json({
//         status: "error",
//         message: "Not authorized"
//       });
//     }

//     // 🔥 Engine Call (THIS IS THE MAGIC)
//     const recommendedMethods = getRecommendedMethods({
//       surveyObjective,
//       geologicalSetting,
//       minDepth,
//       maxDepth
//     });

//     const updatedSurvey = await Survey.findByIdAndUpdate(
//       req.params.id,
//       {
//         surveyName,
//         surveyObjective,
//         geologicalSetting,
//         latitude,
//         longitude,
//         vegetationDensity,
//         ambientNoise,
//         targetDepthRange,
//         layoutPattern,
//         stationSpacing,
//         lineSpacing,
//         minDepth,
//         maxDepth,
//         recommendedMethods
//       },
//       {
//         returnDocument: "after",
//         runValidators: true
//       }
//     );

//     res.json({
//       status: "success",
//       survey: updatedSurvey,
//       recommendedMethods: recommendedMethods.length
//         ? recommendedMethods
//         : ["No method matches the depth range"]
//     });

//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };

// const getRecommendedMethods = require("../services/recommendationEngine");

const updateSurveyCtrl = async (req, res) => {
  try {
    const {
   surveyObjective,
  geologicalSetting,
  minDepth,
  maxDepth,
  latitude,
  longitude,
  vegetationDensity,
  ambientNoise,
  layoutPattern,
  stationSpacing,
  lineSpacing
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
        // surveyName,
        surveyObjective,
    geologicalSetting,
    minDepth,
    maxDepth,
    latitude,
    longitude,
    vegetationDensity,
    ambientNoise,
    layoutPattern,
    stationSpacing,
    lineSpacing,
    recommendedMethods  
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedSurvey) {
      return res.status(404).json({
        status: "error",
        message: "Survey not found or update failed"
      });
    }

    res.json({
      status: "success",
      survey: updatedSurvey,
      recommendedMethods: recommendedMethods && recommendedMethods.length
        ? recommendedMethods
        : ["No method matches the selected depth"]
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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