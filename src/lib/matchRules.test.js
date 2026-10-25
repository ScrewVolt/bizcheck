import { test } from 'node:test'
import assert from 'node:assert/strict'
import { matchRules } from './matchRules.js'
import rules from '../data/rules.json' with { type: 'json' }

// Compare ids only, so the tests do not break when rule wording changes.
function matchedIds(profile) {
  return matchRules(profile, rules).map((rule) => rule.id)
}

const STATE_RULES = [
  'register-business-tax-id',
  'file-grt-return',
  'confirm-filing-frequency',
  'find-location-code-and-rate',
]

test('no employees, outside Alamogordo: only statewide rules', () => {
  const profile = { city: 'other', hasEmployees: false, filingFrequency: 'monthly' }
  assert.deepEqual(matchedIds(profile), STATE_RULES)
})

test('has employees: adds wage withholding', () => {
  const profile = { city: 'other', hasEmployees: true, filingFrequency: 'quarterly' }
  assert.deepEqual(matchedIds(profile), [...STATE_RULES, 'wage-withholding'])
})

test('has employees in Alamogordo: every rule applies', () => {
  const profile = { city: 'alamogordo', hasEmployees: true, filingFrequency: 'unknown' }
  assert.deepEqual(matchedIds(profile), rules.map((rule) => rule.id))
})
