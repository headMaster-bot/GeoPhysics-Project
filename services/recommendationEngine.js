const rules = require("./recommendationRules");

const getRecommendedMethods = ({ surveyObjective, geologicalSetting, minDepth, maxDepth }) => {
  // ✅ DEBUG: Log input parameters
  console.log('=== RECOMMENDATION ENGINE ===');
  console.log('Input parameters:', {
    surveyObjective: `"${surveyObjective}"`,
    geologicalSetting: `"${geologicalSetting}"`,
    minDepth,
    maxDepth
  });

  const matchedRule = rules.find(
    (rule) => {
      const objectiveMatch = rule.objective === surveyObjective;
      const geologyMatch = rule.geology === geologicalSetting;
      console.log(`Rule check: objective="${rule.objective}" (match: ${objectiveMatch}), geology="${rule.geology}" (match: ${geologyMatch})`);
      return objectiveMatch && geologyMatch;
    }
  );

  console.log('Matched rule:', matchedRule ? `${matchedRule.objective} + ${matchedRule.geology}` : 'NO MATCH');

  if (!matchedRule) {
    console.log('❌ No matching rule found!');
    return [];
  }

  const recommendations = matchedRule.methods
    .filter((method) => {
      const minCheck = maxDepth >= method.min;
      const maxCheck = minDepth <= method.max;
      const passes = minCheck && maxCheck;
      console.log(`  ${method.name} (${method.min}-${method.max}m): maxDepth(${maxDepth}) >= min(${method.min})? ${minCheck}, minDepth(${minDepth}) <= max(${method.max})? ${maxCheck} => ${passes ? '✅' : '❌'}`);
      return passes;
    })
    .map((method) => method.name);

  console.log('Depth-matched recommendations:', recommendations);

  // ✅ FALLBACK: If no methods match depth, recommend the best options anyway
  if (recommendations.length === 0) {
    console.log('⚠️ No methods matched the depth range. Recommending first 3 methods anyway...');
    const fallbackRecommendations = matchedRule.methods
      .slice(0, 3)  // Get first 3 methods
      .map(method => method.name);
    console.log('Fallback recommendations:', fallbackRecommendations);
    return fallbackRecommendations;
  }

  console.log('Final recommendations:', recommendations);
  return recommendations;
};

module.exports = getRecommendedMethods;