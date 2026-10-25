// All saved data lives only in this browser's localStorage. Nothing is sent anywhere.
const PROFILE_KEY = "bizcheck-profile";
const DONE_KEY = "bizcheck-done";
const FILED_KEY = 'bizcheck-filed'

function readJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    // Storage can be blocked (some private windows) or hold broken data. Start fresh either way.
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If storage is blocked, the data is just not remembered next visit.
  }
}

export function loadProfile() {
  return readJson(PROFILE_KEY, null);
}

export function saveProfile(profile) {
  writeJson(PROFILE_KEY, profile);
}

// Done items are stored as a list of rule ids, like ["file-grt-return"].
export function loadDoneIds() {
  return readJson(DONE_KEY, []);
}

export function saveDoneIds(ids) {
  writeJson(DONE_KEY, ids);
}

// Filed deadlines are stored by the last day of the period, like ["2026-09-30"].
export function loadFiledPeriods() {
  return readJson(FILED_KEY, [])
}

export function saveFiledPeriods(periods) {
  writeJson(FILED_KEY, periods)
}
