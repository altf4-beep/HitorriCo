function getActiveCelebration() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (state.celebrationOverride && state.celebrationOverride !== 'auto') {
    if (state.celebrationOverride === 'none') return { type: 'none' };
    return buildCelebrationInfo(state.celebrationOverride);
  }

  if (state.profileCompleted && month === Number(state.birthdayMonth) && day === Number(state.birthdayDay)) {
    return buildCelebrationInfo('birthday');
  }

  if ((month === 12 && day >= 29) || (month === 1 && day <= 3)) {
    return buildCelebrationInfo('newyear');
  }
  if (month === 2 && day >= 7 && day <= 15) {
    return buildCelebrationInfo('valentine');
  }
  if ((month === 6 && day >= 28) || (month === 7 && day <= 6)) {
    return buildCelebrationInfo('july4');
  }
  if ((month === 10 && day >= 20) || (month === 11 && day === 1)) {
    return buildCelebrationInfo('halloween');
  }
  if (month === 11 && day >= 15 && day <= 30) {
    return buildCelebrationInfo('thanksgiving');
  }
  if (month === 12 && day >= 10 && day <= 28) {
    return buildCelebrationInfo('christmas');
  }

  return { type: 'none' };
}

function buildCelebrationInfo(type) {
  const uName = state.userName || 'Friend';
  const configs = {
    birthday: {
      type: 'birthday',
      pill: `🎂 Happy Birthday, ${uName}!`,
      banner: `🎉 HAPPY BIRTHDAY, ${uName.toUpperCase()}! Make a wish with ${state.petName}! 🎂`,
      screenClass: 'screen-holiday-birthday',
      greeting: `"HAPPY BIRTHDAY, ${uName}!! 🎂✨ I put on my party hat just for you! Check out your special Birthday tasks today!"`
    },
    newyear: {
      type: 'newyear',
      pill: '🎆 Happy New Year!',
      banner: `✨ Wishing you a gentle, joyful New Year, ${uName}! 🥂`,
      screenClass: 'screen-holiday-newyear',
      greeting: `"Happy New Year, ${uName}! 🎆 No harsh resolutions needed—just small, kind steps together this year."`
    },
    valentine: {
      type: 'valentine',
      pill: '💖 Valentine Season',
      banner: `💕 Sending warm love & self-compassion to ${uName}! 🌹`,
      screenClass: 'screen-holiday-valentine',
      greeting: `"Happy Valentine's season, ${uName}! 💖 Remember that loving and caring for yourself is the sweetest gift."`
    },
    july4: {
      type: 'july4',
      pill: '🎇 4th of July',
      banner: `🇺🇸 Sparkling Independence Day vibes for ${uName}! 🎆`,
      screenClass: 'screen-holiday-july4',
      greeting: `"Happy 4th of July, ${uName}! 🎇 Let's enjoy some summer sunshine, good music, and evening fireworks!"`
    },
    halloween: {
      type: 'halloween',
      pill: '🎃 Spooky Cozy',
      banner: `👻 Happy Halloween Season, ${uName}! Cozy treats & autumn magic 🕯️`,
      screenClass: 'screen-holiday-halloween',
      greeting: `"Boo! Just kidding, ${uName}~ 🎃 Let's watch a cozy spooky movie and enjoy some sweet autumn treats!"`
    },
    thanksgiving: {
      type: 'thanksgiving',
      pill: '🦃 Thanksgiving Gratitude',
      banner: `🍂 Grateful for you every single day, ${uName}! 🥧`,
      screenClass: 'screen-holiday-thanksgiving',
      greeting: `"Happy Thanksgiving season, ${uName}! 🦃 I'm so thankful we get to share this cozy little sanctuary together."`
    },
    christmas: {
      type: 'christmas',
      pill: '🎄 Winter Holidays',
      banner: `❄️ Merry Christmas & Warm Winter Wishes, ${uName}! 🎁`,
      screenClass: 'screen-holiday-christmas',
      greeting: `"Merry Christmas & happy holidays, ${uName}! 🎄 Snuggle up by the twinkling tree and stay warm!"`
    }
  };
  return configs[type] || { type: 'none' };
}

function renderCelebrationDecor(celebration) {
  const screen = document.getElementById('lcd-screen');
  const pill = document.getElementById('celebration-pill');
  const banner = document.getElementById('celebration-banner');
  const bannerText = document.getElementById('celebration-banner-text');
  const decorLayer = document.getElementById('holiday-decor-layer');
  const bdayCard = document.getElementById('birthday-tasks-card');

  screen.classList.remove(
    'screen-holiday-birthday',
    'screen-holiday-newyear',
    'screen-holiday-valentine',
    'screen-holiday-july4',
    'screen-holiday-halloween',
    'screen-holiday-thanksgiving',
    'screen-holiday-christmas'
  );

  if (celebration.type === 'none') {
    pill.classList.add('hidden');
    banner.classList.add('hidden');
    decorLayer.innerHTML = '';
    bdayCard.classList.add('hidden');
    return;
  }

  screen.classList.add(celebration.screenClass);
  pill.textContent = celebration.pill;
  pill.classList.remove('hidden');
  bannerText.textContent = celebration.banner;
  banner.classList.remove('hidden');

  if (celebration.type === 'birthday') {
    bdayCard.classList.remove('hidden');
    document.getElementById('bday-section-name').textContent = state.userName;
    renderBirthdayTasks();
  } else {
    bdayCard.classList.add('hidden');
  }

  if (celebration.type === 'birthday') {
    decorLayer.innerHTML = `
      <span class="absolute top-8 left-4 text-2xl animate-balloon">🎈</span>
      <span class="absolute top-10 right-5 text-2xl animate-balloon" style="animation-delay:0.8s">🎈</span>
      <span class="absolute top-20 left-10 text-sm animate-twinkle">🎊</span>
      <span class="absolute top-16 right-12 text-sm animate-twinkle" style="animation-delay:0.5s">✨</span>
      <span class="absolute bottom-7 right-6 text-2xl" title="Birthday Cake">🎂</span>
    `;
  } else if (celebration.type === 'christmas') {
    decorLayer.innerHTML = `
      <div class="absolute top-1 left-0 right-0 flex justify-around text-xs opacity-90">
        <span>🔴</span><span>🟡</span><span>🟢</span><span>🔵</span><span>🟡</span><span>🔴</span>
      </div>
      <span class="absolute bottom-7 right-5 text-3xl">🎄</span>
      <span class="absolute bottom-7 left-5 text-xl">🎁</span>
      ${Array.from({ length: 10 }).map((_, i) => `
        <span class="absolute w-1.5 h-1.5 bg-white/80 rounded-full" style="left:${8 + i * 9}%; animation: snowFall ${2.2 + (i % 3) * 0.5}s linear infinite; animation-delay:${i * 0.3}s"></span>
      `).join('')}
    `;
  } else if (celebration.type === 'halloween') {
    decorLayer.innerHTML = `
      <span class="absolute top-9 left-5 text-lg animate-balloon">🦇</span>
      <span class="absolute top-12 right-7 text-sm animate-balloon" style="animation-delay:0.7s">🦇</span>
      <span class="absolute top-8 right-16 text-xl opacity-80">🌕</span>
      <span class="absolute bottom-7 left-5 text-2xl">🎃</span>
      <span class="absolute bottom-7 right-6 text-xl">🕯️</span>
    `;
  } else if (celebration.type === 'thanksgiving') {
    decorLayer.innerHTML = `
      <span class="absolute top-9 left-5 text-lg animate-balloon">🍂</span>
      <span class="absolute top-12 right-6 text-lg animate-balloon" style="animation-delay:0.6s">🍁</span>
      <span class="absolute bottom-7 left-5 text-2xl">🦃</span>
      <span class="absolute bottom-7 right-5 text-2xl">🥧</span>
    `;
  } else if (celebration.type === 'july4') {
    decorLayer.innerHTML = `
      <span class="absolute top-9 left-5 text-xl animate-twinkle">🎆</span>
      <span class="absolute top-10 right-5 text-xl animate-twinkle" style="animation-delay:0.6s">🎇</span>
      <span class="absolute bottom-7 left-5 text-xl">🇺🇸</span>
      <span class="absolute bottom-7 right-6 text-xl">⭐</span>
    `;
  } else if (celebration.type === 'valentine') {
    decorLayer.innerHTML = `
      <span class="absolute top-9 left-6 text-lg animate-balloon">💕</span>
      <span class="absolute top-11 right-6 text-lg animate-balloon" style="animation-delay:0.5s">💖</span>
      <span class="absolute bottom-7 left-5 text-xl">🌹</span>
      <span class="absolute bottom-7 right-6 text-xl">💌</span>
    `;
  } else if (celebration.type === 'newyear') {
    decorLayer.innerHTML = `
      <span class="absolute top-9 left-5 text-xl animate-twinkle">🎆</span>
      <span class="absolute top-9 right-5 text-xl animate-twinkle" style="animation-delay:0.4s">✨</span>
      <span class="absolute bottom-7 left-5 text-xl">🥂</span>
      <span class="absolute bottom-7 right-6 text-xl">🎊</span>
    `;
  }
}
