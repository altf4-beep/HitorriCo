let state = {
  profileCompleted: false,
  userName: 'Friend',
  birthdayMonth: 11,
  birthdayDay: 14,
  celebrationOverride: 'auto',
  petName: 'Mochi',
  species: 'sprout',
  equipped: {
    headwear: 'none',
    eyewear: 'none',
    prop: 'scarf',
    aura: 'none'
  },
  ownedItems: ['scarf'],
  dewdrops: 80,
  isPremium: false,
  level: 1,
  xp: 20,
  vitality: 65,
  mind: 65,
  joy: 65,
  lastCategory: null,
  consecutiveCategoryCount: 0,
  theme: 'morning',
  muted: false,
  currentMood: 'peaceful',
  dialogue: '"Take a deep breath. Balancing your Body, Mind, and Joy helps us both bloom!"',
  tasks: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
  birthdayTasks: JSON.parse(JSON.stringify(BIRTHDAY_TASKS)),
  questProgress: {},
  lastActiveDate: new Date().toDateString()
};

let activeFilter = 'all';
let activeBoutiqueFilter = 'all';
let selectedPremiumPlan = 'monthly';
let tempSelectedSpecies = 'sprout';
let tempEquipped = { headwear: 'none', eyewear: 'none', prop: 'scarf', aura: 'none' };
let resetConfirmPending = false;
let breathInterval = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = {
        ...state,
        ...parsed,
        equipped: { ...state.equipped, ...(parsed.equipped || {}) }
      };
      const today = new Date().toDateString();
      if (state.lastActiveDate !== today) {
        state.tasks = state.tasks.map(t => ({ ...t, completedToday: false }));
        state.birthdayTasks = BIRTHDAY_TASKS.map(t => ({ ...t, completed: false }));
        state.vitality = Math.max(45, state.vitality - 10);
        state.mind = Math.max(45, state.mind - 10);
        state.joy = Math.max(45, state.joy - 10);
        state.consecutiveCategoryCount = 0;
        state.lastCategory = null;
        state.lastActiveDate = today;
        saveState();
      }
    }
  } catch (e) {
    console.warn('Could not load saved state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}
