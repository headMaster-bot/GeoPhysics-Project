const rules = require("./recommendationRules");

const getRecommendedMethods = ({ surveyObjective, geologicalSetting, minDepth, maxDepth }) => {
  const matchedRule = rules.find(
    (rule) =>
      rule.objective === surveyObjective &&
      rule.geology === geologicalSetting
  );

  if (!matchedRule) {
    return [];
  }

  // const recommendations = matchedRule.methods
  //   .filter((method) => maxDepth >= method.min && minDepth <= method.max)
  //   .map((method) => method.name);
  const recommendations = matchedRule.methods
  .filter(method => 
    method.min >= minDepth && method.max <= maxDepth    
  )

  .map(method => ({
    name: method.name,
    // depthRange: `${method.min} – ${method.max}m`
  }));

  return recommendations;
};

module.exports = getRecommendedMethods;