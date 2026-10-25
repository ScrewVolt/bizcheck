// Picks the rules that apply to one business.
// A rule applies when every condition in its applies_if matches the profile.
// An empty applies_if ({}) has no conditions, so that rule applies to everyone.

// profile: { city, hasEmployees, filingFrequency }
// rules: the list from src/data/rules.json
// Returns the matching rules, in the same order as rules.json.
export function matchRules(profile, rules) {
  return rules.filter((rule) =>
    Object.entries(rule.applies_if).every(
      ([key, value]) => profile[key] === value
    )
  );
}
