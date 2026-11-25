// Little characters for the shaman and monk scenes (SMIL only). Origin of each figure is its feet.
export type Mood = 'calm' | 'busy' | 'done'

// How big each character is. Bigger numbers, bigger figures.
const SHAMAN_SIZE = 3.2
const MONK_SIZE = 3.2

const rot = (values: string, dur: number, keyTimes?: string) =>
  `<animateTransform attributeName="transform" type="rotate" values="${values}" ${keyTimes ? `keyTimes="${keyTimes}" ` : ''}dur="${dur}s" repeatCount="indefinite"/>`

const move = (values: string, dur: number) =>
  `<animateTransform attributeName="transform" type="translate" values="${values}" dur="${dur}s" repeatCount="indefinite"/>`

// ---- Shaman: leather tunic, feather headdress, a drum, standing by the fire ----
export function shamanChar(mood: Mood): string {
  const X = 480
  const Y = 830
  const feathers = [-52, -26, 0, 26, 52]
    .map((deg, i) => {
      const a = (deg * Math.PI) / 180
      const c = ['#e0823a', '#5fb3a4', '#efe9d6', '#5fb3a4', '#e0823a'][i]
      return `<line x1="0" y1="-98" x2="${(Math.sin(a) * 26).toFixed(1)}" y2="${(-98 - Math.cos(a) * 26).toFixed(1)}" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>`
    })
    .join('')
  const fringe = [-14, -8, -2, 4, 10].map(x => `<line x1="${x}" y1="-6" x2="${x}" y2="2" stroke="#d9c7a0" stroke-width="1.6"/>`).join('')

  const sway = mood === 'busy' ? rot('-5;5;-5', 0.7) : mood === 'done' ? '' : rot('-2;2;-2', 4)
  const hit = mood === 'busy' ? 0.35 : mood === 'done' ? 0.5 : 1.4
  const stickArm =
    mood === 'done'
      ? `<g transform="translate(13 -70)"><g>${rot('-125;-150;-125', 0.5)}<line x1="0" y1="0" x2="22" y2="0" stroke="#9a6a3a" stroke-width="7" stroke-linecap="round"/><circle cx="25" cy="0" r="4.5" fill="#c98f5f"/></g></g><g transform="translate(-13 -70)"><g>${rot('125;150;125', 0.5)}<line x1="0" y1="0" x2="-22" y2="0" stroke="#9a6a3a" stroke-width="7" stroke-linecap="round"/><circle cx="-25" cy="0" r="4.5" fill="#c98f5f"/></g></g>`
      : `<line x1="-13" y1="-70" x2="-7" y2="-52" stroke="#9a6a3a" stroke-width="7" stroke-linecap="round"/>
<circle cx="0" cy="-46" r="13" fill="#a8743f" stroke="#5a3a1e" stroke-width="3"/><ellipse cx="0" cy="-46" rx="8" ry="8" fill="#c99a62"/>
<g transform="translate(13 -70)"><g>${rot('-22;22;-22', hit)}<line x1="0" y1="0" x2="-12" y2="14" stroke="#9a6a3a" stroke-width="7" stroke-linecap="round"/><line x1="-12" y1="14" x2="-20" y2="26" stroke="#5a3a1e" stroke-width="3" stroke-linecap="round"/><circle cx="-21" cy="27" r="4" fill="#e0823a"/></g></g>`

  const figure = `<g transform="scale(-${SHAMAN_SIZE} ${SHAMAN_SIZE})"><g>${sway}
<path d="M-18 0L-14 -62L14 -62L18 0Z" fill="#8a5a30"/><rect x="-18" y="-6" width="36" height="6" fill="#5a3a1e"/>${fringe}
<path d="M-14 -40H14" stroke="#5fb3a4" stroke-width="5"/><path d="M-14 -62L-17 -78Q0 -86 17 -78L14 -62Z" fill="#9a6a3a"/>
<path d="M-9 -92Q-13 -62 -7 -48L-3 -84Z" fill="#1a1410"/><path d="M9 -92Q13 -62 7 -48L3 -84Z" fill="#1a1410"/>
<circle cx="0" cy="-90" r="9" fill="#c98f5f"/><path d="M-6 -90H6" stroke="#5fb3a4" stroke-width="2.2"/><circle cx="3.5" cy="-92" r="1.1" fill="#1a1410"/>
<rect x="-9" y="-99" width="18" height="3.5" fill="#e0823a"/><g>${rot('-3;3;-3', 3)}${feathers}</g>
${stickArm}
</g></g>`

  const hop =
    mood === 'busy'
      ? `<g>${move(`${X - 70} ${Y};${X + 50} ${Y};${X - 70} ${Y}`, 3.2)}<g>${move('0 0;0 -26;0 0', 0.35)}${figure}</g></g>`
      : mood === 'done'
        ? `<g>${move(`${X} ${Y};${X} ${Y - 70};${X} ${Y}`, 0.7)}${figure}</g>`
        : `<g transform="translate(${X} ${Y})">${figure}</g>`

  const shadow =
    mood === 'busy'
      ? `<ellipse cx="0" cy="${Y + 4}" rx="78" ry="10" fill="#000" opacity="0.35"><animateTransform attributeName="transform" type="translate" values="${X - 70} 0;${X + 50} 0;${X - 70} 0" dur="3.2s" repeatCount="indefinite"/></ellipse>`
      : `<ellipse cx="${X}" cy="${Y + 4}" rx="78" ry="10" fill="#000" opacity="0.35"/>`

  return `<g id="shaman-figure">${shadow}${hop}</g>`
}

// ---- Monk: saffron robe. Meditating when calm, ringing a temple bell while Claude works ----
export function monkChar(mood: Mood): string {
  const robe = '#d9772b'
  const dark = '#a9471f'
  const skin = '#e3b78c'

  if (mood === 'calm') {
    const X = 330
    const Y = 810
    return `<g id="monk-figure"><ellipse cx="${X}" cy="${Y + 4}" rx="105" ry="10" fill="#000" opacity="0.3"/><g transform="translate(${X} ${Y}) scale(${MONK_SIZE})">
<circle cx="0" cy="-52" r="64" fill="none" stroke="${robe}" stroke-width="2" opacity="0.3"><animate attributeName="opacity" values="0.15;0.5;0.15" dur="6s" repeatCount="indefinite"/><animate attributeName="r" values="60;68;60" dur="6s" repeatCount="indefinite"/></circle>
<path d="M-36 0Q0 -18 36 0Q0 9 -36 0Z" fill="${dark}"/>
<g><animateTransform attributeName="transform" type="scale" values="1 1;1 1.03;1 1" dur="6s" repeatCount="indefinite"/>
<path d="M-21 -4L-14 -64Q0 -70 14 -64L21 -4Z" fill="${robe}"/><path d="M-14 -64L10 -8L17 -12L-2 -66Z" fill="${dark}"/>
<line x1="-13" y1="-62" x2="-8" y2="-28" stroke="${robe}" stroke-width="7" stroke-linecap="round"/><line x1="13" y1="-62" x2="8" y2="-28" stroke="${robe}" stroke-width="7" stroke-linecap="round"/><ellipse cx="0" cy="-26" rx="8" ry="4.5" fill="${skin}"/>
<circle cx="0" cy="-80" r="9" fill="${skin}"/><path d="M-5 -80Q-3 -78 -1 -80M1 -80Q3 -78 5 -80" stroke="#3a2a1f" stroke-width="1.2" fill="none"/>
</g></g></g>`
  }

  const BX = 200 // where the bell hangs
  const K = MONK_SIZE / 2 // the bell frame grows with the monk
  const X = mood === 'busy' ? BX + 78 * MONK_SIZE : 330
  const Y = 810
  const arm =
    mood === 'busy'
      ? `<g transform="translate(9 -68)"><g>${rot('-50;-50;0;-45;-50', 2.2, '0;0.5;0.62;0.8;1')}<line x1="0" y1="0" x2="26" y2="0" stroke="${robe}" stroke-width="8" stroke-linecap="round"/><line x1="26" y1="0" x2="48" y2="0" stroke="#5a3a1e" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="0" r="6" fill="#7a5a30"/><circle cx="29" cy="0" r="4.5" fill="${skin}"/></g></g><line x1="-9" y1="-66" x2="-4" y2="-48" stroke="${robe}" stroke-width="7" stroke-linecap="round"/><circle cx="-4" cy="-47" r="4" fill="${skin}"/>`
      : `<g transform="translate(9 -68)"><g>${rot('-120;-140;-120', 0.7)}<line x1="0" y1="0" x2="24" y2="0" stroke="${robe}" stroke-width="8" stroke-linecap="round"/><circle cx="27" cy="0" r="4.5" fill="${skin}"/></g></g><g transform="translate(-9 -68)"><g>${rot('120;140;120', 0.7)}<line x1="0" y1="0" x2="-24" y2="0" stroke="${robe}" stroke-width="8" stroke-linecap="round"/><circle cx="-27" cy="0" r="4.5" fill="${skin}"/></g></g>`

  const body = `<g transform="scale(-${MONK_SIZE} ${MONK_SIZE})">
<path d="M-18 0L-14 -66Q0 -72 14 -66L18 0Z" fill="${robe}"/><path d="M-14 -66L12 -6L18 -10L-1 -68Z" fill="${dark}"/><rect x="-16" y="-34" width="32" height="4" fill="#3a2a1f"/>
<circle cx="0" cy="-82" r="9" fill="${skin}"/><path d="M-3 -84Q0 -82 3 -84" stroke="#3a2a1f" stroke-width="1.2" fill="none"/>
${arm}
</g>`

  const ground = `<ellipse cx="${X}" cy="${Y + 4}" rx="80" ry="10" fill="#000" opacity="0.3"/>`

  if (mood === 'done') {
    return `<g id="monk-figure">${ground}<g>${move(`${X} ${Y};${X} ${Y - 54};${X} ${Y}`, 0.9)}${body}</g></g>`
  }

  // busy: the bell frame and its ring
  const bell = `<g id="bell" transform="translate(${BX} 810) scale(${K}) translate(-250 -810)"><rect x="196" y="594" width="10" height="216" fill="#5a3a1e"/><rect x="294" y="594" width="10" height="216" fill="#5a3a1e"/><rect x="186" y="584" width="128" height="14" rx="3" fill="#6b4a2b"/>
<g transform="translate(250 598)"><g>${rot('0;0;-6;5;-3;0', 2.2, '0;0.6;0.66;0.78;0.9;1')}<line x1="0" y1="0" x2="0" y2="30" stroke="#3a2a1f" stroke-width="3"/><path d="M-12 30H12L28 96H-28Z" fill="#b08a45" stroke="#7a5a28" stroke-width="3"/><rect x="-30" y="94" width="60" height="8" rx="3" fill="#8a6a30"/></g></g>
<circle cx="250" cy="672" r="30" fill="none" stroke="#b08a45" stroke-width="3" opacity="0"><animate attributeName="r" values="30;150" dur="2.2s" begin="1.36s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0" dur="2.2s" begin="1.36s" repeatCount="indefinite"/></circle></g>`

  return `<g id="monk-figure">${bell}${ground}<g transform="translate(${X} ${Y})">${body}</g></g>`
}

// ---- Extras: small living details that stay calm, even while Claude works ----
const blink = (begin: number) =>
  `<animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 0.1;1 1" keyTimes="0;0.94;0.97;1" dur="7s" begin="${begin}s" repeatCount="indefinite"/>`

// An owl on the dead tree: it blinks and slowly turns its head.
const owl = () => {
  const eye = (x: number, b: number) =>
    `<g transform="translate(${x} -31)"><g>${blink(b)}<circle r="4.2" fill="#f2c14e"/><circle r="1.8" fill="#1a1410"/></g></g>`
  return `<g id="owl" transform="translate(1450 372) scale(1.7)">
<ellipse cx="0" cy="-12" rx="12" ry="16" fill="#7a6a52"/><ellipse cx="0" cy="-8" rx="7" ry="10" fill="#a89878"/>
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 0;-3 0;-3 0;0 0;3 0;3 0;0 0" keyTimes="0;0.2;0.3;0.45;0.55;0.7;0.8;1" dur="22s" repeatCount="indefinite"/>
<circle cx="0" cy="-30" r="11" fill="#7a6a52"/><path d="M-9 -38L-11 -47L-3 -40ZM9 -38L11 -47L3 -40Z" fill="#6a5a44"/>${eye(-4.5, 0)}${eye(4.5, 0.1)}<path d="M-1.6 -27L0 -23L1.6 -27Z" fill="#c98f3a"/></g>
<path d="M-5 4V0M5 4V0" stroke="#c98f3a" stroke-width="2"/></g>`
}

// Smoke from the campfire: faint, slow, rising and spreading.
const fireSmoke = () =>
  [0, 1, 2]
    .map(
      i =>
        `<ellipse cx="250" cy="684" rx="14" ry="9" fill="#cfd8cf" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${i === 1 ? -26 : 30} -300" dur="${14 + i * 3}s" begin="${i * 4}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.12;0" dur="${14 + i * 3}s" begin="${i * 4}s" repeatCount="indefinite"/><animate attributeName="rx" values="14;44" dur="${14 + i * 3}s" begin="${i * 4}s" repeatCount="indefinite"/></ellipse>`,
    )
    .join('')

export const shamanExtras = () => `<g id="shaman-extras">${fireSmoke()}${owl()}</g>`

// A little bird on the pagoda roof: mostly still, tilts its head, hops now and then.
const bird = () =>
  `<g id="bird" transform="translate(1380 442) scale(1.9)"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -8;0 0;0 0" keyTimes="0;0.6;0.64;0.68;1" dur="13s" repeatCount="indefinite"/>
<path d="M-7 -8L-17 -4L-15 -10Z" fill="#4a5c6a"/><ellipse cx="0" cy="-7" rx="8" ry="6" fill="#5a6f7f"/><ellipse cx="1" cy="-5" rx="5" ry="4" fill="#e8e2d2"/>
<g><animateTransform attributeName="transform" type="rotate" values="0;0;-14;-14;0;8;8;0" keyTimes="0;0.2;0.28;0.45;0.55;0.7;0.8;1" dur="16s" repeatCount="indefinite"/><circle cx="6" cy="-12" r="4.5" fill="#5a6f7f"/><circle cx="7.6" cy="-12.6" r="0.9" fill="#1a1410"/><path d="M10 -12L14 -11L10 -10Z" fill="#d9a441"/></g>
<path d="M-1 -1V2M2 -1V2" stroke="#d9a441" stroke-width="1"/></g></g>`

// An incense burner beside the monk, its smoke curling slowly.
const incense = () =>
  `<g id="incense" transform="translate(600 808) scale(1.6)"><path d="M-20 0Q0 18 20 0Z" fill="#7a5a30"/><ellipse cx="0" cy="0" rx="20" ry="3" fill="#8a6a3c"/><line x1="0" y1="0" x2="2" y2="-46" stroke="#5a3a1e" stroke-width="2"/><circle cx="2" cy="-46" r="2" fill="#e8743a" opacity="0.8"><animate attributeName="opacity" values="0.6;0.9;0.6" dur="5s" repeatCount="indefinite"/></circle>
<path d="M2 -48C-10 -70 14 -90 0 -120" fill="none" stroke="#8f887a" stroke-width="2.5" stroke-linecap="round" opacity="0.35"><animate attributeName="d" values="M2 -48C-10 -70 14 -90 0 -120;M2 -48C12 -70 -12 -92 6 -126;M2 -48C-10 -70 14 -90 0 -120" dur="9s" repeatCount="indefinite"/></path></g>`

export const monkExtras = () => `<g id="monk-extras">${bird()}${incense()}</g>`
