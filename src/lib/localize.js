// Returns rule[field] in Spanish when a "_es" version exists, otherwise the English text.
// Example: pick(rule, "title", "es") reads rule.title_es.
export function pick(rule, field, lang) {
  return (lang === 'es' && rule[`${field}_es`]) || rule[field]
}
