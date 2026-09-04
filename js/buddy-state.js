// --- buddy-state.js ---
// Shared state and constants used across all buddy modules

const safeStorage = {
    _memory: {},
    getItem(key) {
        try { return sessionStorage.getItem(key); }
        catch (e) { return this._memory[key] || null; }
    },
    setItem(key, value) {
        try { sessionStorage.setItem(key, value); }
        catch (e) { this._memory[key] = value; }
    }
};

const dancerFrames = [
` (•.•)/
 <)  )
  /  \\`,
` \\(•.•)
  (  (>
   /  \\`
];

const NUM_DANCERS = 3;
const dancers = [];

const GRAVITY = 0.6;
const FRICTION = 0.985;
const BOUNCE = 0.55;
const MIN_VELOCITY = 0.3;
const REST_THRESHOLD = 1;
let GRAVITY_ENABLED = false;
