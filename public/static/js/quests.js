function advanceQuestStep(questId) {
  const quest = DEEP_QUESTS.find(q => q.id === questId);
  if (!quest) return;

  if (!state.questProgress[questId]) {
    state.questProgress[questId] = { step: 0, completions: 0 };
  }
  const prog = state.questProgress[questId];

  if (prog.step < 2) {
    prog.step += 1;
    SoundEngine.playSoftClick();
    spawnParticle('✨');
    setDialogue(`"Great progress on '${quest.title}', ${state.userName}! Step ${prog.step + 1} of 3 is ready whenever you are."`);
    showToast(`Step ${prog.step}/3 logged! Keep going!`, 'success');
  } else {
    const bonus = state.isPremium ? 25 : 0;
    const totalDewdrops = quest.reward + bonus;
    prog.step = 0;
    prog.completions += 1;
    state.dewdrops += totalDewdrops;

    if (quest.category === 'body') state.vitality = Math.min(100, state.vitality + 20);
    if (quest.category === 'mind') state.mind = Math.min(100, state.mind + 20);
    if (quest.category === 'joy') state.joy = Math.min(100, state.joy + 20);

    SoundEngine.playLevelUp();
    spawnParticle('💧');
    setTimeout(() => spawnParticle(quest.icon), 180);
    setDialogue(`"Whoa, ${state.userName}! You dedicated real time to '${quest.title}' and earned +${totalDewdrops} 💧 Dewdrops!"`);
    gainXP(quest.xp);
    showToast(`Quest Complete! +${totalDewdrops} 💧 Dewdrops`, 'level');
  }

  saveState();
  updateUI();
}

function renderDeepQuests() {
  const list = document.getElementById('quests-list');
  document.getElementById('quest-currency-display').textContent = state.dewdrops;

  list.innerHTML = DEEP_QUESTS.map(q => {
    const prog = state.questProgress[q.id] || { step: 0, completions: 0 };
    const currentStepIndex = prog.step;
    const pct = Math.round((currentStepIndex / 3) * 100);
    const totalReward = q.reward + (state.isPremium ? 25 : 0);

    return `
      <div class="p-4 rounded-2xl border border-black/10 bg-black/[0.02] flex flex-col justify-between gap-3">
        <div>
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-10 h-10 rounded-2xl bg-white/80 dark:bg-black/25 flex items-center justify-center text-xl shadow-sm shrink-0">${q.icon}</span>
              <div>
                <h4 class="font-cozy font-bold text-sm leading-snug">${q.title}</h4>
                <span class="text-[10px] font-semibold opacity-65"><i class="fa-regular fa-clock mr-1"></i>${q.duration}</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 font-pixel text-[10px] font-bold shrink-0">
              +${totalReward} 💧
            </span>
          </div>

          <p class="text-xs opacity-75 mt-2 leading-relaxed">${q.desc}</p>

          <div class="mt-3 p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-black/5">
            <div class="flex items-center justify-between text-[10px] font-bold mb-1">
              <span class="text-[#8679B5]">Stage ${currentStepIndex + 1} of 3</span>
              ${prog.completions > 0 ? `<span class="text-[#5D7F64]">Completed ${prog.completions}x</span>` : '<span>In Progress</span>'}
            </div>
            <p class="text-xs font-semibold">${q.steps[currentStepIndex]}</p>
            <div class="w-full h-1.5 rounded-full bg-black/10 overflow-hidden mt-2">
              <div class="h-full rounded-full bg-sky-500 transition-all duration-300" style="width: ${pct === 0 ? 12 : pct}%"></div>
            </div>
          </div>
        </div>

        <button
          onclick="advanceQuestStep('${q.id}')"
          class="w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
            currentStepIndex === 2
              ? 'bg-gradient-to-r from-sky-500 to-[#88A88E] text-white shadow-sm'
              : 'bg-[#88A88E] hover:bg-[#77987D] text-white'
          }"
        >
          ${currentStepIndex === 2 ? `Finish Quest & Claim +${totalReward} 💧` : `Log Stage ${currentStepIndex + 1} Complete →`}
        </button>
      </div>
    `;
  }).join('');
}
