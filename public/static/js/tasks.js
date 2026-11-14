function filterTasks(category) {
  activeFilter = category;
  SoundEngine.playSoftClick();

  document.querySelectorAll('.filter-pill').forEach(btn => {
    if (btn.dataset.filter === category) {
      btn.classList.add('bg-[#3D3834]', 'text-white');
    } else {
      btn.classList.remove('bg-[#3D3834]', 'text-white');
    }
  });

  renderTasks();
}

function renderBirthdayTasks() {
  const list = document.getElementById('birthday-tasks-list');
  list.innerHTML = state.birthdayTasks.map(bt => `
    <div class="p-3 rounded-2xl bg-white/80 dark:bg-black/25 border border-[#E6B86A]/40 flex items-center justify-between gap-2.5">
      <div class="flex items-start gap-2.5 min-w-0">
        <span class="text-xl shrink-0">${bt.icon}</span>
        <div class="min-w-0">
          <p class="text-xs font-bold leading-snug ${bt.completed ? 'line-through opacity-70' : ''}">${escapeHTML(bt.title)}</p>
          <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300">+${bt.dewdrops} 💧 • +${bt.xp} XP</span>
        </div>
      </div>
      <button
        onclick="completeBirthdayTask('${bt.id}')"
        class="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold ${
          bt.completed ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200' : 'bg-[#E6B86A] text-white shadow-sm'
        }"
      >
        ${bt.completed ? 'Celebrated!' : 'Celebrate'}
      </button>
    </div>
  `).join('');
}

function renderTasks() {
  const container = document.getElementById('tasks-container');
  const categories = [
    { key: 'body', title: 'Body — Movement & Physical Care', icon: '🌿', color: 'text-[#5D7F64]', badge: 'bg-[#88A88E]/20 text-[#5D7F64]' },
    { key: 'mind', title: 'Mind — Reading, Focus & Reflection', icon: '📖', color: 'text-[#6F629E]', badge: 'bg-[#A59AC9]/20 text-[#6F629E]' },
    { key: 'joy',  title: 'Joy — Restful Leisure & Hobbies', icon: '🎬', color: 'text-[#B5684B]', badge: 'bg-[#D98A6C]/20 text-[#B5684B]' }
  ];

  const visibleCategories = activeFilter === 'all'
    ? categories
    : categories.filter(c => c.key === activeFilter);

  container.innerHTML = visibleCategories.map(cat => {
    const catTasks = state.tasks.filter(t => t.category === cat.key);
    return `
      <div>
        <h3 class="font-cozy text-sm font-bold ${cat.color} flex items-center gap-1.5 mb-2.5">
          <span>${cat.icon}</span> ${cat.title}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${catTasks.map(task => `
            <div class="p-3.5 rounded-2xl border border-black/5 bg-black/[0.02] hover:bg-black/[0.04] transition-all flex items-center justify-between gap-3 ${task.completedToday ? 'opacity-70' : ''}">
              <div class="flex items-start gap-2.5 min-w-0">
                <span class="text-xl shrink-0 mt-0.5">${task.icon}</span>
                <div class="min-w-0">
                  <p class="text-xs sm:text-sm font-semibold leading-snug ${task.completedToday ? 'line-through opacity-75' : ''}">
                    ${escapeHTML(task.title)}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.badge}">+${task.boost}%</span>
                    <span class="text-[10px] opacity-65 font-medium">+${task.xp} XP</span>
                    ${task.custom ? `<button onclick="deleteCustomTask('${task.id}')" class="text-[10px] text-rose-500 hover:underline ml-1">Delete</button>` : ''}
                  </div>
                </div>
              </div>
              <button
                onclick="completeTask('${task.id}')"
                class="shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  task.completedToday
                    ? 'bg-[#88A88E]/20 text-[#5D7F64] hover:bg-[#88A88E]/30'
                    : 'bg-[#88A88E] hover:bg-[#77987D] text-white shadow-sm'
                }"
              >
                ${task.completedToday ? '<i class="fa-solid fa-check mr-1"></i>Done' : 'Do'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}
