function filterBoutique(cat) {
  activeBoutiqueFilter = cat;
  SoundEngine.playSoftClick();
  document.querySelectorAll('.boutique-pill').forEach(btn => {
    if (btn.dataset.bfilter === cat) {
      btn.classList.add('bg-[#3D3834]', 'text-white');
      btn.classList.remove('bg-black/5');
    } else {
      btn.classList.remove('bg-[#3D3834]', 'text-white');
      btn.classList.add('bg-black/5');
    }
  });
  renderBoutique();
}

function renderBoutique() {
  const grid = document.getElementById('boutique-grid');
  document.getElementById('boutique-currency-display').textContent = state.dewdrops;

  const items = activeBoutiqueFilter === 'all'
    ? BOUTIQUE_ITEMS
    : BOUTIQUE_ITEMS.filter(i => i.category === activeBoutiqueFilter);

  grid.innerHTML = items.map(item => {
    const owned = state.ownedItems.includes(item.id);
    const isWearable = item.slot !== 'decor';
    const isEquipped = isWearable && state.equipped[item.slot] === item.id;
    const canAfford = state.dewdrops >= item.cost;

    return `
      <div class="p-4 rounded-2xl border ${owned ? 'border-[#88A88E]/40 bg-[#88A88E]/[0.05]' : 'border-black/10 bg-black/[0.02]'} flex items-start justify-between gap-3">
        <div class="flex items-start gap-3">
          <div class="w-11 h-11 rounded-2xl bg-white/90 dark:bg-black/25 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            ${item.icon}
          </div>
          <div>
            <h4 class="font-cozy font-bold text-sm leading-tight">${item.name}</h4>
            <p class="text-xs opacity-75 mt-1 leading-relaxed">${item.desc}</p>
            <span class="inline-block mt-1.5 text-[10px] font-pixel px-2 py-0.5 rounded-full ${owned ? 'bg-[#88A88E]/20 text-[#5D7F64]' : 'bg-sky-500/15 text-sky-700 dark:text-sky-300'}">
              ${owned ? (item.slot === 'decor' ? 'Placed in Room' : 'Owned') : `💧 ${item.cost} Dewdrops`}
            </span>
          </div>
        </div>

        ${owned ? (
          isWearable ? `
            <button
              onclick="toggleEquipItem('${item.id}')"
              class="px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isEquipped ? 'bg-[#D98A6C] text-white' : 'bg-black/10 hover:bg-black/15'
              }"
            >
              ${isEquipped ? 'Wearing' : 'Wear'}
            </button>
          ` : `<span class="text-xs font-bold text-[#5D7F64] shrink-0">Active</span>`
        ) : `
          <button
            onclick="buyBoutiqueItem('${item.id}')"
            class="px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              canAfford
                ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm'
                : 'bg-black/10 opacity-50 cursor-not-allowed'
            }"
          >
            Buy
          </button>
        `}
      </div>
    `;
  }).join('');
}

function buyBoutiqueItem(itemId) {
  const item = BOUTIQUE_ITEMS.find(i => i.id === itemId);
  if (!item || state.ownedItems.includes(itemId)) return;

  if (state.dewdrops < item.cost) {
    showToast('Complete Deep Quests to earn more 💧 Dewdrops!', 'success');
    return;
  }

  state.dewdrops -= item.cost;
  state.ownedItems.push(item.id);
  if (item.slot !== 'decor') {
    state.equipped[item.slot] = item.id;
  }

  SoundEngine.playComplete();
  spawnParticle(item.icon);
  setDialogue(`"Ooh, look at my new ${item.name}! Thank you so much, ${state.userName}!"`);
  showToast(`Purchased ${item.name}!`, 'level');

  saveState();
  updateUI();
}

function toggleEquipItem(itemId) {
  const item = BOUTIQUE_ITEMS.find(i => i.id === itemId);
  if (!item || item.slot === 'decor') return;

  SoundEngine.playSoftClick();
  state.equipped[item.slot] = state.equipped[item.slot] === itemId ? 'none' : itemId;
  saveState();
  updateUI();
}
