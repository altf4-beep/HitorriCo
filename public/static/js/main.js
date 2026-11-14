window.addEventListener('DOMContentLoaded', () => {
  loadState();
  SoundEngine.muted = state.muted;
  if (state.muted) {
    document.getElementById('icon-sound').className = 'fa-solid fa-volume-xmark opacity-50';
  }
  setTheme(state.theme);

  const celeb = getActiveCelebration();
  if (state.profileCompleted && celeb.greeting) {
    state.dialogue = celeb.greeting;
  }

  updateUI();

  if (!state.profileCompleted) {
    openProfileModal(true);
  }
});
