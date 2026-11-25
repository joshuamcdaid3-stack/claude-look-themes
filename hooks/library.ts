// The wizard's library, redrawn as animated vector art (SMIL only), in three moods.
export type Mood = 'calm' | 'busy' | 'done'
export type Day = 'dawn' | 'day' | 'dusk' | 'night'

const n = (v: number) => String(Math.round(v * 100) / 100)

// Small seeded random so the books are the same every time.
function rng(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SPINES = ['#6b4a35', '#8a5a3a', '#5a3b2c', '#a06a3c', '#7a3f33', '#b88a3e', '#4e3a2e', '#93603f', '#6e2f2a', '#3f4a3a']

function shelf(x0: number, x1: number, boards: number[], top: number, seed: number): string {
  const r = rng(seed)
  let out = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${(boards[boards.length - 1] ?? top) - top + 12}" fill="#1c1510"/>`
  let rowTop = top

  for (const board of boards) {
    let x = x0 + 6

    while (x < x1 - 12) {
      const w = 9 + Math.floor(r() * 12)
      const h = Math.min(board - rowTop - 8, 52 + Math.floor(r() * 30))
      const c = SPINES[Math.floor(r() * SPINES.length)] ?? '#6b4a35'
      out += `<rect x="${x}" y="${board - h}" width="${w}" height="${h}" fill="${c}"/>`

      if (r() > 0.55) {
        out += `<rect x="${x}" y="${board - h + 10}" width="${w}" height="3" fill="#d9b56a" opacity="0.7"/>`
      }
      x += w + 1

      if (r() > 0.93) {
        x += 14
      }
    }
    out += `<rect x="${x0}" y="${board}" width="${x1 - x0}" height="12" fill="#4a3526"/>`
    rowTop = board + 12
  }

  return out
}

const flame = (x: number, y: number, h: number, dur: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="${n(h * 0.32)}" ry="${n(h * 0.55)}" fill="#ffd36b"><animate attributeName="ry" values="${n(h * 0.5)};${n(h * 0.72)};${n(h * 0.5)}" dur="${n(dur)}s" repeatCount="indefinite"/></ellipse><circle cx="${x}" cy="${y}" r="${h * 1.6}" fill="url(#cg)" opacity="0.7"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="${n(dur * 1.3)}s" repeatCount="indefinite"/></circle>`

const candle = (x: number, base: number, h: number, dur: number) =>
  `<rect x="${x - 7}" y="${base - 6}" width="14" height="6" rx="2" fill="#c49a45"/><rect x="${x - 1.5}" y="${base - 6 - 14}" width="3" height="14" fill="#c49a45"/><rect x="${x - 4}" y="${base - h - 20}" width="8" height="${h}" fill="#f1e6c8"/>${flame(x, base - h - 30, 12, dur)}`

const sparkle = (x: number, y: number, color: string, dur: number, begin: number) =>
  `<circle cx="${x}" cy="${y}" r="3" fill="${color}" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="r" values="1;4;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`

const star = (x: number, y: number, r: number, d: number, t: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#dbe6ff" opacity="0.5"><animate attributeName="opacity" values="0.15;1;0.15" dur="${d}s" begin="${t}s" repeatCount="indefinite"/></circle>`

// How big the wizard is. Everything below follows from it.
const SIZE = 1.9

// The books he reaches for. He hovers where his shoulder meets the book: his arm reaches 38 units, his shoulder sits 68 up.
const BOOKS = [
  { bx: 250, by: 257 },
  { bx: 200, by: 432 },
  { bx: 300, by: 335 },
  { bx: 160, by: 180 },
]
const HOME = { x: 290, y: 870 }
const LOOP = 26 // seconds for all four books
const SEG = 0.23 // share of the loop spent on each book
const f4 = (v: number) => String(Math.round(v * 10000) / 10000)

// Per book, as fractions of the loop. He arrives, reaches out, takes the book, draws it to his chest,
// opens it and reads, closes it, reaches back to the shelf, puts it away and floats on.
const STOPS = BOOKS.map((k, i) => {
  const s = 0.04 + SEG * i
  return {
    ...k,
    fx: Math.round(k.bx + 38 * SIZE),
    fy: Math.round(k.by + 68 * SIZE),
    arrive: s + 0.04,
    reachOut: s + 0.06,
    grab: s + 0.085,
    pull: s + 0.105,
    open: s + 0.12,
    close: s + 0.17,
    reachBack: s + 0.19,
    release: s + 0.205,
    fold: s + 0.215,
    leave: s + 0.22,
  }
})

const HAND = { x: 38, y: -68 } // where his hand is when he reaches, in his own coordinates
const CHEST = { x: 24, y: -50 } // where he holds the book to read

function wizard(mood: Mood): string {
  let move = ''
  let arm = '<animateTransform attributeName="transform" type="rotate" values="55;50;55" dur="5s" repeatCount="indefinite"/>'
  let heldBook = ''
  let books = ''
  let shadow = `<ellipse cx="${HOME.x}" cy="${HOME.y + 3}" rx="54" ry="9" fill="#000" opacity="0.35"/>`

  if (mood === 'busy') {
    const T = LOOP
    const pts: { t: number; x: number; y: number }[] = [{ t: 0, x: HOME.x, y: HOME.y }]

    for (const st of STOPS) {
      pts.push({ t: st.arrive, x: st.fx, y: st.fy }, { t: st.leave, x: st.fx, y: st.fy })
    }
    pts.push({ t: 1, x: HOME.x, y: HOME.y })
    move = `<animateTransform attributeName="transform" type="translate" values="${pts.map(p => `${p.x} ${p.y}`).join(';')}" keyTimes="${pts.map(p => f4(p.t)).join(';')}" dur="${T}s" repeatCount="indefinite"/>`

    // His shadow stays on the floor and fades while he floats up.
    shadow = `<ellipse cx="${HOME.x}" cy="${HOME.y + 3}" rx="54" ry="9" fill="#000" opacity="0.35"><animate attributeName="opacity" values="${pts.map((p, i) => (i === 0 || i === pts.length - 1 ? 0.35 : 0.12)).join(';')}" keyTimes="${pts.map(p => f4(p.t)).join(';')}" dur="${T}s" repeatCount="indefinite"/></ellipse>`

    // The arm: folded, out to the shelf, back to his chest with the book, out again to put it away.
    const arms: { t: number; v: number }[] = [{ t: 0, v: 55 }]

    for (const st of STOPS) {
      arms.push(
        { t: st.arrive, v: 55 },
        { t: st.reachOut, v: -6 },
        { t: st.grab, v: -6 },
        { t: st.pull, v: 40 },
        { t: st.close, v: 40 },
        { t: st.reachBack, v: -6 },
        { t: st.release, v: -6 },
        { t: st.fold, v: 55 },
      )
    }
    arms.push({ t: 1, v: 55 })
    arm = `<animateTransform attributeName="transform" type="rotate" values="${arms.map(a => a.v).join(';')}" keyTimes="${arms.map(a => f4(a.t)).join(';')}" dur="${T}s" repeatCount="indefinite"/>`

    // The book he holds: in his hand as he takes it, drawn to his chest, opened to read, closed, handed back.
    const E = 0.0004
    const held: { t: number; o: number; p: { x: number; y: number } }[] = [{ t: 0, o: 0, p: HAND }]

    for (const st of STOPS) {
      held.push(
        { t: st.grab - E, o: 0, p: HAND },
        { t: st.grab, o: 1, p: HAND },
        { t: st.pull, o: 1, p: CHEST },
        { t: st.close, o: 1, p: CHEST },
        { t: st.reachBack, o: 1, p: HAND },
        { t: st.release, o: 1, p: HAND },
        { t: st.release + E, o: 0, p: HAND },
      )
    }
    held.push({ t: 1, o: 0, p: HAND })
    const heldKeys = held.map(h => f4(h.t)).join(';')

    // Closed cover and open pages swap over while he reads.
    const swap: { t: number; closed: number }[] = [{ t: 0, closed: 1 }]

    for (const st of STOPS) {
      swap.push({ t: st.open - 0.006, closed: 1 }, { t: st.open + 0.006, closed: 0 }, { t: st.close - 0.006, closed: 0 }, { t: st.close + 0.006, closed: 1 })
    }
    swap.push({ t: 1, closed: 1 })
    const swapKeys = swap.map(w => f4(w.t)).join(';')

    heldBook = `<g opacity="0"><animate attributeName="opacity" values="${held.map(h => h.o).join(';')}" keyTimes="${heldKeys}" dur="${T}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="${held.map(h => `${h.p.x} ${h.p.y}`).join(';')}" keyTimes="${heldKeys}" dur="${T}s" repeatCount="indefinite"/>
<g><animate attributeName="opacity" values="${swap.map(w => w.closed).join(';')}" keyTimes="${swapKeys}" dur="${T}s" repeatCount="indefinite"/><rect x="-8" y="-12" width="16" height="24" rx="1.5" fill="#c4903f" stroke="#7a5a28" stroke-width="1.5"/><rect x="-8" y="-12" width="3" height="24" fill="#8a6a30"/><rect x="-3" y="-6" width="9" height="2" fill="#e8c878"/></g>
<g opacity="0"><animate attributeName="opacity" values="${swap.map(w => 1 - w.closed).join(';')}" keyTimes="${swapKeys}" dur="${T}s" repeatCount="indefinite"/><path d="M-19 -8L0 -4L0 15L-19 11Z" fill="#c4903f"/><path d="M19 -8L0 -4L0 15L19 11Z" fill="#b88436"/><path d="M-17 -11L0 -7L0 11L-17 8Z" fill="#f4ecd8"/><path d="M17 -11L0 -7L0 11L17 8Z" fill="#efe5cc"/><path d="M-13 -6L-3 -3.5M-13 -2L-3 0.5M-13 2L-3 4.5M13 -6L3 -3.5M13 -2L3 0.5M13 2L3 4.5" stroke="#8a7a5a" stroke-width="1" opacity="0.7"/><line x1="0" y1="-7" x2="0" y2="11" stroke="#8a6a30" stroke-width="1.5"/></g></g>`

    // A dark gap on the shelf for as long as he has the book.
    books = STOPS.map(st => {
      const k = [0, st.grab - E, st.grab, st.release, st.release + E, 1].map(f4).join(';')
      return `<rect x="${st.bx - 10}" y="${st.by - 25}" width="20" height="48" fill="#120c08" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${k}" dur="${T}s" repeatCount="indefinite"/></rect>`
    }).join('')
  } else if (mood === 'done') {
    move = `<animateTransform attributeName="transform" type="translate" values="${HOME.x} ${HOME.y};${HOME.x} ${HOME.y - 40};${HOME.x} ${HOME.y}" dur="0.9s" repeatCount="indefinite"/>`
    arm = '<animateTransform attributeName="transform" type="rotate" values="-70;-95;-70" dur="0.9s" repeatCount="indefinite"/>'
  } else {
    move = `<animateTransform attributeName="transform" type="translate" values="${HOME.x} ${HOME.y};${HOME.x} ${HOME.y - 4};${HOME.x} ${HOME.y}" dur="4s" repeatCount="indefinite"/>`
  }

  const robeStars = [[-8, -30], [6, -58], [-4, -14], [10, -36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#f6d77a"/>`).join('')

  return `${shadow}${books}<g id="wizard" transform="translate(${HOME.x} ${HOME.y})">${move}<g transform="scale(-${SIZE} ${SIZE})">
<path d="M-22 0L-15 -74Q0 -80 15 -74L22 0Z" fill="#3d2f8f"/><rect x="-22" y="-5" width="44" height="5" fill="#2d2270"/><rect x="-16" y="-50" width="32" height="4" fill="#d9b56a"/>${robeStars}
<g transform="translate(-9 -66)"><line x1="0" y1="0" x2="-12" y2="12" stroke="#3d2f8f" stroke-width="8" stroke-linecap="round"/><line x1="-12" y1="12" x2="-30" y2="-14" stroke="#6b4a2b" stroke-width="3" stroke-linecap="round"/><circle cx="-30" cy="-14" r="4" fill="#ffe29a"><animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="-12" cy="12" r="4.5" fill="#e9c9a6"/></g>
<circle cx="2" cy="-86" r="9" fill="#e9c9a6"/><path d="M-7 -82Q2 -56 11 -82Q2 -75 -7 -82Z" fill="#f2efe8"/>
<path d="M-17 -92L2 -140Q10 -150 24 -146Q12 -140 17 -92Z" fill="#3d2f8f"/><ellipse cx="0" cy="-92" rx="24" ry="5.5" fill="#2d2270"/><rect x="-15" y="-100" width="30" height="5" fill="#d9b56a"/>
<g transform="translate(9 -68)"><g>${arm}<line x1="0" y1="0" x2="26" y2="0" stroke="#3d2f8f" stroke-width="8" stroke-linecap="round"/><circle cx="29" cy="0" r="4.5" fill="#e9c9a6"/></g></g>${heldBook}
</g></g>`
}

const SKY: Record<Day, { top: string; bottom: string; stars: number }> = {
  night: { top: '#0d1738', bottom: '#1a2c5a', stars: 1 },
  dawn: { top: '#27315f', bottom: '#c58a78', stars: 0.3 },
  day: { top: '#4f78a6', bottom: '#8fb6d4', stars: 0 },
  dusk: { top: '#2c2552', bottom: '#b5635a', stars: 0.3 },
}

// The sun or moon in the window.
const CELESTIAL: Record<Day, string> = {
  night: '<circle cx="690" cy="190" r="17" fill="#e9e4cf" opacity="0.8"/><circle cx="698" cy="184" r="15" fill="#0f1b40"/>',
  dawn: '<circle cx="930" cy="430" r="28" fill="#f4c08a" opacity="0.8"/>',
  day: '<circle cx="900" cy="170" r="28" fill="#fff0c0" opacity="0.7"/>',
  dusk: '<circle cx="700" cy="440" r="30" fill="#f09a6a" opacity="0.8"/>',
}

// A faint thread of candle smoke, rising slowly. It never speeds up.
const wisp = (x: number, y: number, d: number, begin: number) =>
  `<path d="M${x} ${y}C${x - 8} ${y - 20} ${x + 8} ${y - 40} ${x} ${y - 70}" fill="none" stroke="#d8cdb6" stroke-width="2" stroke-linecap="round" opacity="0.14"><animate attributeName="d" values="M${x} ${y}C${x - 8} ${y - 20} ${x + 8} ${y - 40} ${x} ${y - 70};M${x} ${y}C${x + 9} ${y - 20} ${x - 9} ${y - 42} ${x + 5} ${y - 72};M${x} ${y}C${x - 8} ${y - 20} ${x + 8} ${y - 40} ${x} ${y - 70}" dur="${d}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.06;0.2;0.06" dur="${d * 0.8}s" begin="${begin}s" repeatCount="indefinite"/></path>`

// A ginger cat asleep on the books. It only breathes, and now and then flicks its tail.
const CAT = `<g transform="translate(1030 590) scale(1.7)"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1.05;1 1" dur="4.5s" repeatCount="indefinite"/>
<ellipse cx="0" cy="-10" rx="19" ry="10" fill="#c07a3a"/><path d="M-10 -18Q-8 -12 -10 -4M-2 -19Q0 -12 -2 -3M6 -18Q8 -12 6 -4" stroke="#9a5a28" stroke-width="2" fill="none"/>
<circle cx="17" cy="-9" r="8" fill="#c07a3a"/><path d="M11 -15L12 -22L17 -16ZM23 -15L22 -22L17 -16Z" fill="#c07a3a"/><path d="M13 -9Q15 -7 17 -9M19 -9Q21 -7 23 -9" stroke="#3a2418" stroke-width="1.2" fill="none"/><circle cx="20" cy="-6" r="1.2" fill="#d98a8a"/>
<g><animateTransform attributeName="transform" type="rotate" values="0;0;0;10;-6;0;0" keyTimes="0;0.7;0.8;0.85;0.9;0.95;1" dur="14s" repeatCount="indefinite"/><path d="M-17 -6Q-30 -4 -28 -14" stroke="#c07a3a" stroke-width="5" stroke-linecap="round" fill="none"/></g>
</g></g>`

export function library(mood: Mood, day: Day = 'night'): string {
  const k = mood === 'busy' ? 0.5 : 1 // flames and notes flicker faster while he works
  const left = shelf(20, 400, [165, 260, 355, 450, 545, 640], 70, 11)
  const right = shelf(1200, 1580, [165, 260], 70, 29) + shelf(1200, 1250, [355, 450, 545, 640], 305, 47)
  const stars = [
    [660, 140, 1.6, 4, 0], [730, 260, 1.4, 5, 1], [800, 190, 1.8, 3.6, 2], [880, 300, 1.4, 4.4, 0.6], [940, 160, 1.6, 5.2, 1.4],
    [700, 400, 1.4, 3.8, 2.2], [860, 430, 1.6, 4.6, 0.3], [980, 380, 1.4, 4, 1.8], [620, 320, 1.4, 5, 0.9], [770, 90, 1.4, 4.2, 2.6],
  ]
    .map(([x, y, r, d, t]) => star(x ?? 0, y ?? 0, r ?? 1.5, d ?? 4, t ?? 0))
    .join('')

  const diamonds = Array.from({ length: 33 }, (_v, i) => `<path d="M${25 + i * 50} 872l6 6l-6 6l-6 -6z" fill="#d9b56a" opacity="0.7"/>`).join('')
  const planks = [800, 830, 858].map(y => `<rect x="0" y="${y}" width="1600" height="2" fill="#4b331f"/>`).join('')
  const note = (x: number, y: number, c: string, rot: number, d: number) =>
    `<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 0" dur="${n(d * k)}s" repeatCount="indefinite"/><rect x="-26" y="-13" width="52" height="26" fill="${c}" transform="rotate(${rot})"><animateTransform attributeName="transform" type="rotate" values="${rot};${rot + 6};${rot}" dur="${n(d * 1.4 * k)}s" repeatCount="indefinite"/></rect></g></g>`

  let extra = ''

  if (mood === 'busy') {
    extra =
      `<ellipse cx="290" cy="520" rx="260" ry="420" fill="url(#cg)" opacity="0"><animate attributeName="opacity" values="0.1;0.45;0.1" dur="1.8s" repeatCount="indefinite"/></ellipse>` +
      [[130, 760], [350, 720], [250, 640], [420, 780], [1320, 520], [1500, 600]].map(([x, y], i) => sparkle(x ?? 0, y ?? 0, '#ffe29a', 1.4 + (i % 3) * 0.3, i * 0.35)).join('')
  } else if (mood === 'done') {
    const rays = (x: number, y: number, c: string, begin: number) => {
      const r = Array.from({ length: 10 }, (_v, i) => {
        const a = (i / 10) * Math.PI * 2
        return `<line x1="${n(Math.cos(a) * 28)}" y1="${n(Math.sin(a) * 28)}" x2="${n(Math.cos(a) * 90)}" y2="${n(Math.sin(a) * 90)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
      }).join('')
      return `<g transform="translate(${x} ${y})" opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.25;1" dur="2.2s" begin="${begin}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="0.2;1.5" dur="2.2s" begin="${begin}s" repeatCount="indefinite"/>${r}<circle r="14" fill="${c}"/></g></g>`
    }
    const shooter = (x: number, y: number, begin: number) =>
      `<g opacity="0"><animateTransform attributeName="transform" type="translate" values="${x} ${y};${x + 420} ${y + 220}" dur="2.4s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.7;1" dur="2.4s" begin="${begin}s" repeatCount="indefinite"/><line x1="-110" y1="-58" x2="0" y2="0" stroke="#fff4d6" stroke-width="4" stroke-linecap="round" opacity="0.6"/><circle r="6" fill="#fff4d6"/></g>`
    extra = shooter(580, 60, 0) + shooter(700, 40, 0.9) + shooter(560, 180, 1.6) + rays(150, 220, '#ffd36b', 0.2) + rays(1480, 200, '#cbb4ff', 1) + rays(740, 560, '#ffd36b', 1.5) + sparkle(290, 700, '#ffe29a', 0.9, 0) + sparkle(330, 650, '#cbb4ff', 1.1, 0.4)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
<pattern id="brick" width="96" height="48" patternUnits="userSpaceOnUse"><rect width="96" height="48" fill="#2c241e"/><rect x="2" y="2" width="44" height="20" fill="#352c25"/><rect x="50" y="2" width="44" height="20" fill="#30281f"/><rect x="-22" y="26" width="44" height="20" fill="#30281f"/><rect x="26" y="26" width="44" height="20" fill="#352c25"/><rect x="74" y="26" width="44" height="20" fill="#30281f"/></pattern>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY[day].top}"/><stop offset="1" stop-color="${SKY[day].bottom}"/></linearGradient>
<radialGradient id="cg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffcf6b" stop-opacity="0.9"/><stop offset="1" stop-color="#ffcf6b" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#brick)"/>
<rect width="1600" height="64" fill="#1a1410"/><rect y="56" width="1600" height="10" fill="#2a2018"/>
<g id="shelves">${left}${right}</g>
<g id="pillars"><rect x="405" y="62" width="64" height="710" fill="#3a3028"/><rect x="398" y="58" width="78" height="14" fill="#4a3d33"/><rect x="1129" y="62" width="64" height="710" fill="#3a3028"/><rect x="1122" y="58" width="78" height="14" fill="#4a3d33"/></g>
<g id="window">
<path d="M570 533V220Q570 13 800 13Q1033 13 1033 220V533Z" fill="url(#glass)" stroke="#4a3d33" stroke-width="16"/>
<g opacity="${SKY[day].stars}">${stars}</g>${CELESTIAL[day]}
<path d="M731 533V160M867 533V160M570 400H1033" stroke="#2a211b" stroke-width="7" fill="none"/>
<path d="M600 330Q620 150 731 130M1003 330Q980 150 867 130" stroke="#2a211b" stroke-width="6" fill="none"/>
<circle cx="800" cy="85" r="27" fill="none" stroke="#2a211b" stroke-width="6"/><circle cx="741" cy="144" r="19" fill="none" stroke="#2a211b" stroke-width="5"/><circle cx="859" cy="144" r="19" fill="none" stroke="#2a211b" stroke-width="5"/>
</g>
${note(520, 300, '#c9a23e', -10, 5)}${note(1070, 300, '#b24a52', 8, 6)}
<g id="fireplace">
<rect x="1235" y="305" width="315" height="26" fill="#8e887c"/><rect x="1250" y="331" width="290" height="320" fill="#7d776c"/>
<path d="M1288 650V420L1392 370L1496 420V650Z" fill="#17100c"/>
<ellipse cx="1392" cy="600" rx="150" ry="120" fill="url(#cg)" opacity="0.5"><animate attributeName="opacity" values="${n(0.35)};0.75;0.35" dur="${n(2.2 * k)}s" repeatCount="indefinite"/></ellipse>
<rect x="1340" y="632" width="150" height="14" rx="6" fill="#3a2414"/>
<path d="M1345 640C1325 590 1355 560 1368 500C1388 545 1425 575 1410 640Z" fill="#e8662a"><animate attributeName="d" values="M1345 640C1325 590 1355 560 1368 500C1388 545 1425 575 1410 640Z;M1345 640C1335 585 1350 545 1380 485C1396 540 1425 580 1410 640Z;M1345 640C1325 590 1355 560 1368 500C1388 545 1425 575 1410 640Z" dur="${n(1.8 * k)}s" repeatCount="indefinite"/></path>
<path d="M1360 640C1352 610 1368 595 1374 560C1388 590 1402 610 1396 640Z" fill="#ffc15a"><animate attributeName="d" values="M1360 640C1352 610 1368 595 1374 560C1388 590 1402 610 1396 640Z;M1360 640C1356 604 1372 585 1380 548C1392 590 1402 612 1396 640Z;M1360 640C1352 610 1368 595 1374 560C1388 590 1402 610 1396 640Z" dur="${n(1.3 * k)}s" repeatCount="indefinite"/></path>
${candle(1300, 330, 40, 1.4 * k)}${candle(1555, 330, 40, 1.7 * k)}
</g>
<rect x="89" y="650" width="1371" height="112" fill="#3a2a1f"/><rect x="89" y="650" width="1371" height="14" fill="#5a4030"/>
<g id="desk-things">
<rect x="220" y="560" width="230" height="30" fill="#6b3a33"/><rect x="226" y="590" width="218" height="30" fill="#8a5a4a"/><rect x="220" y="620" width="230" height="30" fill="#5c2f2a"/>
<rect x="980" y="590" width="190" height="30" fill="#6b3a33"/><rect x="986" y="620" width="178" height="30" fill="#5c2f2a"/>
<path d="M590 650Q640 612 700 622V650ZM820 650Q770 612 710 622V650Z" fill="#f1e6c8"/>
<circle cx="1090" cy="636" r="12" fill="#1a1410"/><path d="M1096 628Q1130 580 1150 560" stroke="#f1e6c8" stroke-width="2" fill="none"><animate attributeName="d" values="M1096 628Q1130 580 1150 560;M1096 628Q1124 586 1138 566;M1096 628Q1130 580 1150 560" dur="5s" repeatCount="indefinite"/></path>
<rect x="479" y="510" width="27" height="46" fill="#f4eede"/><rect x="491" y="556" width="4" height="62" fill="#c49a45"/><ellipse cx="493" cy="624" rx="20" ry="6" fill="#c49a45"/>
${candle(560, 565, 36, 1.5 * k)}${candle(1040, 565, 36, 1.3 * k)}
</g>
<g id="floor"><rect y="762" width="1600" height="138" fill="#6a4a2f"/>${planks}<rect y="862" width="1600" height="38" fill="#5c1f2a"/><rect y="862" width="1600" height="3" fill="#d9b56a"/>${diamonds}</g>
${CAT}<g id="smoke">${wisp(560, 485, 7, 0)}${wisp(1040, 485, 8, 2)}${wisp(1300, 246, 9, 1)}${wisp(1555, 246, 7.5, 3)}</g>
${wizard(mood)}
<g id="effects">${extra}</g>
</svg>`
}
