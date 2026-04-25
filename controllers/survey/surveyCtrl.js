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
        const surveyExists = await Survey.findOne({
            surveyName: surveyName.trim()
        });

        if (surveyExists) {
            return res.status(401).json({
                status: "failed",
                message: "Survey already exists"
            });
        } const surveyExits = await Survey.findOne({ surveyName })
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
            surveyName,
            description,
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
            siteConstraints
        } = req.body;

        // ✅ DEBUG: Log incoming data
        console.log('=== BACKEND: updateSurveyCtrl ===');
        console.log('Incoming data:', {
            surveyObjective: `"${surveyObjective}"`,
            geologicalSetting: `"${geologicalSetting}"`,
            minDepth: `${minDepth} (type: ${typeof minDepth})`,
            maxDepth: `${maxDepth} (type: ${typeof maxDepth})`,
            siteConstraints: siteConstraints
        });

        const survey = await Survey.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({ message: "Survey not found" });
        }

        if (survey.user.toString() !== req.userAuth) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // ✅ Parse depth to numbers if they're strings
        const minDepthNum = typeof minDepth === 'string' ? parseFloat(minDepth) : minDepth;
        const maxDepthNum = typeof maxDepth === 'string' ? parseFloat(maxDepth) : maxDepth;

        console.log('After parsing:', {
            minDepthNum: `${minDepthNum} (type: ${typeof minDepthNum})`,
            maxDepthNum: `${maxDepthNum} (type: ${typeof maxDepthNum})`
        });

        const recommendedMethods = getRecommendedMethods({
            surveyObjective,
            geologicalSetting,
            minDepth: minDepthNum,
            maxDepth: maxDepthNum
        });

        // console.log('Recommended Methods Result:', recommendedMethods);

        const updatedSurvey = await Survey.findByIdAndUpdate(
            req.params.id,
            {
                // surveyName,
                surveyObjective,
                geologicalSetting,
                minDepth: minDepthNum,
                maxDepth: maxDepthNum,
                latitude,
                longitude,
                vegetationDensity,
                ambientNoise,
                layoutPattern,
                stationSpacing,
                lineSpacing,
                siteConstraints,
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
            //   recommendedMethods: recommendedMethods && recommendedMethods.length
            //     ? recommendedMethods
            //     : ["No method matches the selected depth"]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// status update
const updateSurveyStatusCtrl = async (req, res) => {
    try {
        const { surveyId, status } = req.body;

        const validStatuses = ["in_progress", "draft", "completed"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            });
        }

        const survey = await Survey.findByIdAndUpdate(
            surveyId,
            { status },
            { returnDocument: "after" }
        );

        res.json({
            status: "Success",
            data: survey,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// save to draft
const saveDraftCtrl = async (req, res) => {
    console.log(req.userAuth, "save");

    const { surveyId, ...rest } = req.body;

    let survey;

    if (surveyId) {
        survey = await Survey.findByIdAndUpdate(
            surveyId,
            { ...rest, status: "draft" },
            { new: true }
        );
    } else {
        survey = await Survey.create({
            ...rest,
            status: "draft",
            user: req.userAuth,
        });
    }

    res.json(survey);
};

// const saveDraftCtrl = async (req, res) => {
//   try {
//     console.log(req.userAuth, "save");

//     const { surveyId, status = "draft", ...rest } = req.body;

//     // ✅ Allow 3 statuses now
//     const allowedStatus = ["active", "draft", "completed"];

//     if (!allowedStatus.includes(status)) {
//       return res.status(400).json({
//         message: "Invalid status value",
//       });
//     }

//     let survey;

//     if (surveyId) {
//       survey = await Survey.findByIdAndUpdate(
//         surveyId,
//         {
//           ...rest,
//           status, // dynamic: draft | active | completed
//         },
//         { new: true }
//       );
//     } else {
//       survey = await Survey.create({
//         ...rest,
//         status,
//         user: req.userAuth,
//       });
//     }

//     res.json(survey);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// get status
const DraftsCtrl = async (req, res) => {
    const { status } = req.query;

    const surveys = await Survey.find({
        user: req.userAuth,
        ...(status && { status }),
    }).sort({ createdAt: -1 });

    res.json(surveys);
};

// controllers/survey/getDraftCtrl.js
const getDraftCtrl = async (req, res) => {
    try {
        const { surveyId } = req.params;

        const survey = await Survey.findById(surveyId);

        if (!survey) {
            return res.status(404).json({ message: "Survey not found" });
        }

        res.json({
            status: "success",
            survey,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// complete survey
// const saveCompletedCtrl = async (req, res) => {
//     console.log("BODY:", req.params.id);

//   try {

//     const surveyId = await Survey.findById(req.params.id)
//     if (!surveyId) {
//         return res.json({
//             status: "Failed",
//             message: "Survey Id not found",
//         })
//     }

//     // ✅ Validate ID
//     // if (!surveyId) {
//     //   return res.status(400).json({
//     //     status: "error",
//     //     message: "Survey ID is required",
//     //   });
//     // }

//     // ✅ FIRST: find survey
//     // const existingSurvey = await Survey.findById(surveyId);

//     // if (!existingSurvey) {
//     //   return res.status(404).json({
//     //     status: "error",
//     //     message: "Survey not found",
//     //   });
//     // }

//     // ✅ BLOCK if already completed (CHECK BEFORE UPDATE)
//     if (surveyId.status === "completed") {
//       return res.status(400).json({
//         status: "success",
//         message: "Survey already completed, you can not edit this survey",
//       });
//     }

//     // ✅ NOW update
//     const updatedSurvey = await Survey.findByIdAndUpdate(
//       surveyId,
//       { status: "completed" },
//       { returnDocument: "after" } // ✅ IMPORTANT
//     );

//     return res.status(200).json({
//       status: "success",
//       message: "Survey completed successfully",
//       survey: updatedSurvey,
//     });

//   } catch (error) {
//     console.error("Save completed error:", error);

//     return res.status(500).json({
//       status: "error",
//       message: "Server error",
//     });
//   }
// };

const saveCompletedCtrl = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Survey ID:", id);

    // ✅ Find Survey first
    const existingSurvey = await Survey.findById(id);

    if (!existingSurvey) {
      return res.status(404).json({
        status: "error",
        message: "Survey not found",
      });
    }

    // ✅ Block if already completed
    if (existingSurvey.status === "completed") {
      return res.status(400).json({
        status: "error",
        message: "Survey already completed, you cannot edit it",
      });
    }

    // ✅ Update using ID (NOT document)
    const updatedSurvey = await Survey.findByIdAndUpdate(
      id,
      { status: "completed" },
      { returnDocument: "after" } // ✅ correct option
    );

    return res.status(200).json({
      status: "success",
      message: "Survey completed successfully",
      survey: updatedSurvey,
    });

  } catch (error) {
    console.error("Save completed error:", error);

    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// get both drafts and complete status once
const completesCtrl = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {
      user: req.userAuth,
    };

    if (status) {
      const statuses = status.split(","); 
      filter.status = { $in: statuses };
    }

    const surveys = await Survey.find(filter).sort({ createdAt: -1 });

    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// module.exports = getDraftCtrl;

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
    updateSurveyStatusCtrl,
    saveDraftCtrl,
    DraftsCtrl,
    getDraftCtrl,
    saveCompletedCtrl,
    completesCtrl,
};