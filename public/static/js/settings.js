function switchTab(tabName) {
  SoundEngine.playSoftClick();
  const views = ['tasks', 'quests', 'boutique'];
  views.forEach(v => {
    document.getElementById(`view-${v}`).classList.toggle('hidden', v !== tabName);
    const btn = document.getElementById(`tab-btn-${v}`);
    if (v === tabName) {
      btn.classList.add('bg-[#88A88E]', 'text-white', 'shadow-sm');
      btn.classList.remove('opacity-75');
    } else {
      btn.classList.remove('bg-[#88A88E]', 'text-white', 'shadow-sm');
      btn.classList.add('opacity-75');
    }
  });
}

function setTheme(themeName) {
  SoundEngine.playSoftClick();
  state.theme = themeName;
  document.body.className = `theme-${themeName} min-h-screen flex flex-col selection:bg-[#88A88E]/30`;

  ['morning', 'rainy', 'evening'].forEach(t => {
    const btn = document.getElementById(`btn-theme-${t}`);
    if (t === themeName) {
      btn.classList.add('bg-[#88A88E]/20', 'font-bold');
    } else {
      btn.classList.remove('bg-[#88A88E]/20', 'font-bold');
    }
  });

  const weatherOverlay = document.getElementById('weather-overlay');
  if (themeName === 'rainy') {
    weatherOverlay.classList.remove('hidden');
    weatherOverlay.innerHTML = Array.from({ length: 14 }).map((_, i) => `
      <span class="absolute w-0.5 h-3 bg-sky-400/50 rounded-full" style="left: ${(i * 7) + 4}%; animation: rainFall ${1.1 + (i % 4) * 0.25}s linear infinite; animation-delay: ${(i % 5) * 0.2}s;"></span>
    `).join('');
  } else {
    weatherOverlay.classList.add('hidden');
    weatherOverlay.innerHTML = '';
  }

  saveState();
}

function toggleSound() {
  state.muted = !state.muted;
  SoundEngine.muted = state.muted;
  const icon = document.getElementById('icon-sound');
  icon.className = state.muted
    ? 'fa-solid fa-volume-xmark opacity-50'
    : 'fa-solid fa-volume-high text-[#88A88E]';
  if (!state.muted) SoundEngine.playSoftClick();
  saveState();
}

function triggerBreathingPause() {
  SoundEngine.playSoftClick();
  document.getElementById('breathing-modal').classList.remove('hidden');

  const circle = document.getElementById('breath-circle');
  const instr = document.getElementById('breath-instruction');
  let inhale = true;

  const runCycle = () => {
    if (inhale) {
      circle.style.transform = 'scale(1.45)';
      instr.textContent = 'Inhale slowly...';
    } else {
      circle.style.transform = 'scale(0.95)';
      instr.textContent = 'Exhale softly...';
    }
    inhale = !inhale;
  };

  runCycle();
  breathInterval = setInterval(runCycle, 4000);
}

function closeBreathingModal() {
  document.getElementById('breathing-modal').classList.add('hidden');
  if (breathInterval) clearInterval(breathInterval);
}

function completeBreathingPause() {
  closeBreathingModal();
  SoundEngine.playComplete();
  state.mind = Math.min(100, state.mind + 8);
  state.joy = Math.min(100, state.joy + 6);
  gainXP(12);
  spawnParticle('🍃');
  setDialogue(`"That slow breath felt like a gentle breeze through the sanctuary, ${state.userName}."`);
  showToast('Completed a mindful breathing pause!', 'success');
  saveState();
  updateUI();
}

function openCustomizeModal() {
  SoundEngine.playSoftClick();
  tempSelectedSpecies = state.species;
  tempEquipped = { ...state.equipped };
  resetConfirmPending = false;
  document.getElementById('btn-reset-confirm').textContent = 'Reset Progress';
  document.getElementById('input-pet-name').value = state.petName;

  updateCustomizeModalSelection();
  document.getElementById('customize-modal').classList.remove('hidden');
}

function closeCustomizeModal() {
  document.getElementById('customize-modal').classList.add('hidden');
}

function selectSpecies(sp) {
  SoundEngine.playSoftClick();
  tempSelectedSpecies = sp;
  updateCustomizeModalSelection();
}

function toggleModalWearable(itemId) {
  const item = BOUTIQUE_ITEMS.find(i => i.id === itemId);
  if (!item || item.slot === 'decor') return;
  SoundEngine.playSoftClick();
  tempEquipped[item.slot] = tempEquipped[item.slot] === itemId ? 'none' : itemId;
  updateCustomizeModalSelection();
}

function updateCustomizeModalSelection() {
  document.querySelectorAll('.species-option').forEach(btn => {
    if (btn.dataset.species === tempSelectedSpecies) {
      btn.classList.add('border-[#88A88E]', 'bg-[#88A88E]/15');
    } else {
      btn.classList.remove('border-[#88A88E]', 'bg-[#88A88E]/15');
    }
  });

  const accContainer = document.getElementById('accessory-selector');
  const ownedWearables = BOUTIQUE_ITEMS.filter(i => i.slot !== 'decor' && state.ownedItems.includes(i.id));

  accContainer.innerHTML = ownedWearables.map(acc => {
    const selected = tempEquipped[acc.slot] === acc.id;
    return `
      <button
        type="button"
        onclick="toggleModalWearable('${acc.id}')"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          selected ? 'border-[#D98A6C] bg-[#D98A6C]/20' : 'border-black/10 hover:bg-black/5'
        }"
      >
        ${acc.icon} ${acc.name}
      </button>
    `;
  }).join('');
}

function saveCustomization() {
  const newName = document.getElementById('input-pet-name').value.trim();
  if (newName) state.petName = newName;
  state.species = tempSelectedSpecies;
  state.equipped = { ...tempEquipped };

  SoundEngine.playComplete();
  closeCustomizeModal();
  saveState();
  updateUI();
  showToast(`${state.petName}'s look has been updated!`, 'success');
}

function confirmResetSanctuary() {
  const btn = document.getElementById('btn-reset-confirm');
  if (!resetConfirmPending) {
    resetConfirmPending = true;
    btn.textContent = 'Click again to confirm reset';
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
