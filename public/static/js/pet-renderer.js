function renderPetSVG() {
  const wrapper = document.getElementById('pet-avatar-wrapper');
  const avgStat = (state.vitality + state.mind + state.joy) / 3;
  const celebration = getActiveCelebration();
  const isBirthday = celebration.type === 'birthday';
  const isHappy = isBirthday || avgStat >= 75 || state.currentMood === 'happy' || state.currentMood === 'cozy';
  const isTired = !isBirthday && (avgStat < 50 || state.currentMood === 'tired' || state.currentMood === 'overwhelmed');

  let eyesSVG = '';
  if (isHappy) {
    eyesSVG = `
      <path d="M54 76 Q60 69 66 76" stroke="#3D3834" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M94 76 Q100 69 106 76" stroke="#3D3834" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    `;
  } else if (isTired) {
    eyesSVG = `
      <path d="M54 75 L66 75" stroke="#3D3834" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M94 75 L106 75" stroke="#3D3834" stroke-width="3.5" stroke-linecap="round"/>
    `;
  } else {
    eyesSVG = `
      <circle cx="60" cy="74" r="4.5" fill="#3D3834"/>
      <circle cx="58.5" cy="72.5" r="1.5" fill="#FFFFFF"/>
      <circle cx="100" cy="74" r="4.5" fill="#3D3834"/>
      <circle cx="98.5" cy="72.5" r="1.5" fill="#FFFFFF"/>
    `;
  }

  const mouthSVG = isHappy
    ? `<path d="M74 84 Q80 91 86 84" stroke="#3D3834" stroke-width="3" stroke-linecap="round" fill="none"/>`
    : `<path d="M76 85 Q80 88 84 85" stroke="#3D3834" stroke-width="2.8" stroke-linecap="round" fill="none"/>`;

  const cheeksSVG = `
    <ellipse cx="49" cy="82" rx="6" ry="3.5" fill="#E88D8D" fill-opacity="0.55"/>
    <ellipse cx="111" cy="82" rx="6" ry="3.5" fill="#E88D8D" fill-opacity="0.55"/>
  `;

  let bodySVG = '';
  if (state.species === 'sprout') {
    bodySVG = `
      <path d="M80 34 C80 20 64 14 58 22 C66 28 75 29 80 34 Z" fill="#779B7E"/>
      <path d="M80 34 C80 18 96 12 103 20 C95 27 86 29 80 34 Z" fill="#9BB8A0"/>
      <path d="M80 42 L80 31" stroke="#6B8E72" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M40 92 C40 56 56 40 80 40 C104 40 120 56 120 92 C120 116 104 124 80 124 C56 124 40 116 40 92 Z" fill="#DCEAD9" stroke="#88A88E" stroke-width="3"/>
      <ellipse cx="64" cy="123" rx="9" ry="5" fill="#B5CEB8"/>
      <ellipse cx="96" cy="123" rx="9" ry="5" fill="#B5CEB8"/>
    `;
  } else if (state.species === 'cloud') {
    bodySVG = `
      <path d="M46 56 L42 32 L66 46 Z" fill="#EFEBF7" stroke="#A59AC9" stroke-width="3" stroke-linejoin="round"/>
      <path d="M114 56 L118 32 L94 46 Z" fill="#EFEBF7" stroke="#A59AC9" stroke-width="3" stroke-linejoin="round"/>
      <path d="M44 95 C34 90 34 74 46 68 C45 50 62 40 80 42 C98 40 115 50 114 68 C126 74 126 90 116 95 C120 112 104 124 80 124 C56 124 40 112 44 95 Z" fill="#F7F5FC" stroke="#A59AC9" stroke-width="3"/>
      <path d="M116 106 Q134 96 128 84" stroke="#A59AC9" stroke-width="5" stroke-linecap="round" fill="none"/>
    `;
  } else {
    bodySVG = `
      <path d="M46 58 L38 28 L68 46 Z" fill="#E89D7E" stroke="#C77454" stroke-width="3" stroke-linejoin="round"/>
      <path d="M48 52 L44 35 L60 46 Z" fill="#FAF0E6"/>
      <path d="M114 58 L122 28 L92 46 Z" fill="#E89D7E" stroke="#C77454" stroke-width="3" stroke-linejoin="round"/>
      <path d="M112 52 L116 35 L100 46 Z" fill="#FAF0E6"/>
      <path d="M42 92 C42 58 58 42 80 42 C102 42 118 58 118 92 C118 116 102 124 80 124 C58 124 42 116 42 92 Z" fill="#E89D7E" stroke="#C77454" stroke-width="3"/>
      <path d="M54 96 C54 84 66 80 80 80 C94 80 106 84 106 96 C106 114 94 122 80 122 C66 122 54 114 54 96 Z" fill="#FAF3EB"/>
      <path d="M114 108 C134 108 138 86 124 82 C116 80 112 92 114 108 Z" fill="#E89D7E" stroke="#C77454" stroke-width="2.5"/>
    `;
  }

  let auraSVG = '';
  if (state.equipped.aura === 'star_halo') {
    auraSVG = `
      <ellipse cx="80" cy="20" rx="22" ry="5.5" stroke="#E6B86A" stroke-width="2.8" fill="none"/>
      <circle cx="56" cy="20" r="2.2" fill="#FFF3B0"/>
      <circle cx="104" cy="20" r="2.2" fill="#FFF3B0"/>
    `;
  }

  let headwearSVG = '';
  const hw = state.equipped.headwear;
  if (isBirthday && hw === 'none') {
    headwearSVG = `
      <polygon points="80,14 66,44 94,44" fill="#F28FB0" stroke="#D96B90" stroke-width="2"/>
      <line x1="72" y1="32" x2="88" y2="32" stroke="#F2C97D" stroke-width="2.5"/>
      <circle cx="80" cy="12" r="4.5" fill="#F2C97D"/>
    `;
  } else if (hw === 'frog_hat') {
    headwearSVG = `
      <path d="M50 48 Q80 28 110 48 Z" fill="#77B27B" stroke="#538757" stroke-width="2.2"/>
      <ellipse cx="80" cy="48" rx="34" ry="5" fill="#88C48C" stroke="#538757" stroke-width="2"/>
      <circle cx="66" cy="34" r="6" fill="#77B27B" stroke="#538757" stroke-width="2"/>
      <circle cx="66" cy="34" r="2.5" fill="#2D2A32"/>
      <circle cx="94" cy="34" r="6" fill="#77B27B" stroke="#538757" stroke-width="2"/>
      <circle cx="94" cy="34" r="2.5" fill="#2D2A32"/>
    `;
  } else if (hw === 'strawberry_beret') {
    headwearSVG = `
      <ellipse cx="84" cy="41" rx="25" ry="11" transform="rotate(-10 84 41)" fill="#F08A9D" stroke="#C96478" stroke-width="2.2"/>
      <path d="M84 30 L86 24" stroke="#6B8E72" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="76" cy="41" r="1.2" fill="#FFF3B0"/>
      <circle cx="85" cy="44" r="1.2" fill="#FFF3B0"/>
      <circle cx="93" cy="39" r="1.2" fill="#FFF3B0"/>
    `;
  } else if (hw === 'wizard_hat') {
    headwearSVG = `
      <ellipse cx="80" cy="45" rx="35" ry="6" fill="#4A3F6B" stroke="#2F2747" stroke-width="2"/>
      <polygon points="82,12 58,45 102,45" fill="#5D4F85" stroke="#2F2747" stroke-width="2"/>
      <circle cx="80" cy="31" r="3" fill="#F2C97D"/>
    `;
  } else if (hw === 'sprout_crown') {
    headwearSVG = `
      <circle cx="64" cy="43" r="5" fill="#F4A4B8"/>
      <circle cx="64" cy="43" r="2" fill="#F2C97D"/>
      <circle cx="80" cy="40" r="6" fill="#FFFFFF"/>
      <circle cx="80" cy="40" r="2.2" fill="#F2C97D"/>
      <circle cx="96" cy="43" r="5" fill="#C4B7E8"/>
      <circle cx="96" cy="43" r="2" fill="#F2C97D"/>
    `;
  } else if (hw === 'bunny_ears') {
    headwearSVG = `
      <ellipse cx="67" cy="24" rx="5.5" ry="16" transform="rotate(-10 67 24)" fill="#FFFFFF" stroke="#D1C7D8" stroke-width="2"/>
      <ellipse cx="67" cy="25" rx="2.5" ry="11" transform="rotate(-10 67 25)" fill="#F7C5D0"/>
      <ellipse cx="93" cy="24" rx="5.5" ry="16" transform="rotate(10 93 24)" fill="#FFFFFF" stroke="#D1C7D8" stroke-width="2"/>
      <ellipse cx="93" cy="25" rx="2.5" ry="11" transform="rotate(10 93 25)" fill="#F7C5D0"/>
    `;
  } else if (hw === 'chef_hat') {
    headwearSVG = `
      <rect x="64" y="33" width="32" height="11" rx="3" fill="#FFFFFF" stroke="#D4CFC7" stroke-width="2"/>
      <circle cx="67" cy="27" r="9" fill="#FFFFFF" stroke="#D4CFC7" stroke-width="2"/>
      <circle cx="80" cy="24" r="10" fill="#FFFFFF" stroke="#D4CFC7" stroke-width="2"/>
      <circle cx="93" cy="27" r="9" fill="#FFFFFF" stroke="#D4CFC7" stroke-width="2"/>
    `;
  }

  let eyewearSVG = '';
  const ew = state.equipped.eyewear;
  if (ew === 'glasses') {
    eyewearSVG = `
      <circle cx="60" cy="74" r="10" stroke="#5C534E" stroke-width="2.2" fill="rgba(255,255,255,0.2)"/>
      <circle cx="100" cy="74" r="10" stroke="#5C534E" stroke-width="2.2" fill="rgba(255,255,255,0.2)"/>
      <line x1="70" y1="74" x2="90" y2="74" stroke="#5C534E" stroke-width="2.2"/>
    `;
  } else if (ew === 'heart_shades') {
    eyewearSVG = `
      <path d="M51 71 C51 67 57 67 60 71 C63 67 69 67 69 71 C69 76 60 82 60 82 C60 82 51 76 51 71 Z" fill="#F279A6" stroke="#B84B74" stroke-width="1.5"/>
      <path d="M91 71 C91 67 97 67 100 71 C103 67 109 67 109 71 C109 76 100 82 100 82 C100 82 91 76 91 71 Z" fill="#F279A6" stroke="#B84B74" stroke-width="1.5"/>
      <line x1="69" y1="72" x2="91" y2="72" stroke="#B84B74" stroke-width="2"/>
    `;
  } else if (ew === 'monocle') {
    eyewearSVG = `
      <circle cx="100" cy="74" r="10" stroke="#D9A74A" stroke-width="2.3" fill="rgba(255,248,214,0.22)"/>
      <path d="M110 74 Q116 86 112 98" stroke="#D9A74A" stroke-width="1.5" fill="none" stroke-dasharray="2 2"/>
    `;
  } else if (ew === 'star_stickers') {
    eyewearSVG = `
      <polygon points="48,80 49.5,83 53,83 50.2,85 51.2,88 48,86 44.8,88 45.8,85 43,83 46.5,83" fill="#F2C97D"/>
      <polygon points="112,80 113.5,83 117,83 114.2,85 115.2,88 112,86 108.8,88 109.8,85 107,83 110.5,83" fill="#F2C97D"/>
    `;
  }

  let propSVG = '';
  const pr = state.equipped.prop;
  if (pr === 'scarf') {
    propSVG = `
      <path d="M47 96 Q80 106 113 96" stroke="#D98A6C" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path d="M94 99 L98 117" stroke="#D98A6C" stroke-width="8" stroke-linecap="round"/>
      <path d="M94 99 L98 117" stroke="#E6B86A" stroke-width="2" stroke-dasharray="3 3"/>
    `;
  } else if (pr === 'bell_collar') {
    propSVG = `
      <path d="M49 95 Q80 104 111 95" stroke="#D9534F" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      <circle cx="80" cy="102" r="5" fill="#F2C97D" stroke="#B8862D" stroke-width="1.5"/>
      <circle cx="80" cy="103" r="1.2" fill="#7A5618"/>
    `;
  } else if (pr === 'mini_guitar') {
    propSVG = `
      <g transform="rotate(-22 80 102)">
        <ellipse cx="74" cy="103" rx="12" ry="9" fill="#D99B66" stroke="#8C582E" stroke-width="2"/>
        <circle cx="74" cy="103" r="3" fill="#593518"/>
        <rect x="85" y="101" width="22" height="4" rx="1.5" fill="#8C582E"/>
      </g>
    `;
  } else if (pr === 'boba_cup') {
    propSVG = `
      <g transform="translate(108, 86)">
        <polygon points="4,8 20,8 18,26 6,26" fill="#E8C6A0" stroke="#9C7650" stroke-width="1.8"/>
        <rect x="3" y="6" width="18" height="3" rx="1.5" fill="#FFFFFF"/>
        <line x1="13" y1="0" x2="11" y2="14" stroke="#D96B90" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="9" cy="22" r="1.5" fill="#4A321F"/>
        <circle cx="14" cy="23" r="1.5" fill="#4A321F"/>
      </g>
    `;
  } else if (pr === 'art_palette') {
    propSVG = `
      <g transform="translate(30, 88)">
        <ellipse cx="14" cy="14" rx="13" ry="10" fill="#E6C79C" stroke="#9C7A4C" stroke-width="1.8"/>
        <circle cx="9" cy="10" r="2.2" fill="#E07A5F"/>
        <circle cx="16" cy="9" r="2.2" fill="#88A88E"/>
        <circle cx="20" cy="15" r="2.2" fill="#A59AC9"/>
        <line x1="2" y1="22" x2="24" y2="4" stroke="#6B4E31" stroke-width="2" stroke-linecap="round"/>
      </g>
    `;
  }

  wrapper.innerHTML = `
    <svg width="164" height="138" viewBox="0 0 160 135" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-sm">
      ${auraSVG}
      ${bodySVG}
      ${cheeksSVG}
      ${eyesSVG}
      ${mouthSVG}
      ${headwearSVG}
      ${eyewearSVG}
      ${propSVG}
    </svg>
  `;

  document.getElementById('decor-plant').classList.toggle('hidden', !state.ownedItems.includes('plant'));
  document.getElementById('decor-mushroom').classList.toggle('hidden', !state.ownedItems.includes('mushroom_lamp'));
  document.getElementById('decor-vinyl').classList.toggle('hidden', !state.ownedItems.includes('vinyl_player'));
  document.getElementById('decor-lamp').classList.toggle('hidden', !state.ownedItems.includes('lamp'));
}
