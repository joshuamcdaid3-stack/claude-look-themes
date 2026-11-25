import { monkChar, monkExtras, shamanChar, shamanExtras } from './characters.js'
import { type Day, library, type Mood } from './library.js'

// Animated SVG backdrops, SMIL only. Art hugs the left and right edges; the middle stays open.

const stars = (pts: number[][], fill: string) =>
  pts
    .map(
      ([x = 0, y = 0, r = 1, d = 4, t = 0]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="0.5"><animate attributeName="opacity" values="0.15;0.95;0.15" dur="${d}s" begin="${t}s" repeatCount="indefinite"/></circle>`,
    )
    .join('')

// rising motes: x, start y, drift, duration, delay, radius
const motes = (pts: number[][], fill: string) =>
  pts
    .map(
      ([x = 0, y = 0, dx = 0, d = 8, t = 0, r = 2]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="0"><animateTransform attributeName="transform" type="translate" values="0 0;${dx} -320" dur="${d}s" begin="${t}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.9;0" dur="${d}s" begin="${t}s" repeatCount="indefinite"/></circle>`,
    )
    .join('')


// A shooting star that streaks across now and then: visible for a moment, then a long quiet gap.
const occasionalStar = (x: number, y: number, period: number, begin: number) =>
  `<g opacity="0"><animateTransform attributeName="transform" type="translate" values="${x} ${y};${x} ${y};${x + 560} ${y + 270};${x + 560} ${y + 270}" keyTimes="0;0.85;0.93;1" dur="${period}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.85;0.87;0.93;1" dur="${period}s" begin="${begin}s" repeatCount="indefinite"/><line x1="-140" y1="-68" x2="0" y2="0" stroke="#e8f3d8" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/><circle r="5" fill="#fffbe8"/></g>`

const WIZARD_STARS: number[][] = [
  [60, 80, 2, 3, 0], [180, 140, 1.6, 4, 1], [300, 60, 2.2, 5, 2], [380, 220, 1.4, 3.5, 0.5],
  [120, 260, 1.8, 4.5, 1.5], [1240, 90, 1.8, 3.8, 0.3], [1330, 200, 2.2, 5, 2.2], [1500, 60, 1.6, 4, 1.1],
  [1560, 300, 1.8, 3.2, 0.7], [1180, 280, 1.4, 4.2, 2.5], [250, 340, 1.5, 3.6, 1.8], [1420, 380, 1.6, 4.4, 0.9],
]

export const WIZARD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0922"/><stop offset="0.6" stop-color="#1c1240"/><stop offset="1" stop-color="#2d1b57"/></linearGradient>
<radialGradient id="wmoon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f6dc8f" stop-opacity="0.55"/><stop offset="1" stop-color="#f6dc8f" stop-opacity="0"/></radialGradient>
<radialGradient id="wglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd36b" stop-opacity="0.9"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#wsky)"/>
<g id="stars">${stars(WIZARD_STARS, '#fff4d6')}</g>
<g id="moon">
<circle cx="1440" cy="150" r="150" fill="url(#wmoon)"><animate attributeName="opacity" values="0.6;1;0.6" dur="9s" repeatCount="indefinite"/></circle>
<circle cx="1440" cy="150" r="52" fill="#f6dc8f"/>
<circle cx="1462" cy="138" r="46" fill="#1a1138"/>
</g>
<g id="runes" transform="translate(1480 690)" opacity="0.5" fill="none" stroke="#a98bff" stroke-width="2">
<g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="80s" repeatCount="indefinite"/>
<circle r="130"/><circle r="104" stroke-dasharray="6 10"/>
<path d="M0 -130L113 65L-113 65Z"/><path d="M0 130L113 -65L-113 -65Z"/></g>
<g><animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="55s" repeatCount="indefinite"/>
<circle r="70" stroke="#e0b44c" stroke-dasharray="3 9"/></g>
<animate attributeName="opacity" values="0.35;0.65;0.35" dur="7s" repeatCount="indefinite"/>
</g>
<g id="hills">
<path d="M0 760 C140 700 260 720 380 780 L380 900 L0 900Z" fill="#150d2e"/>
<path d="M1600 740 C1480 690 1340 720 1230 790 L1230 900 L1600 900Z" fill="#150d2e"/>
</g>
<g id="tower">
<rect x="70" y="420" width="130" height="400" fill="#0f0a22"/>
<rect x="55" y="400" width="160" height="26" fill="#150d2e"/>
<path d="M50 400L135 190L220 400Z" fill="#120b28"/>
<path d="M135 190L150 150L120 150Z" fill="#120b28"/>
<circle cx="135" cy="160" r="10" fill="#ffd36b"><animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/></circle>
<rect x="115" y="470" width="40" height="64" rx="20" fill="#ffd36b"><animate attributeName="opacity" values="0.75;1;0.65;1;0.8" dur="5s" repeatCount="indefinite"/></rect>
<rect x="115" y="620" width="40" height="64" rx="20" fill="#e0b44c"><animate attributeName="opacity" values="0.6;0.95;0.7" dur="6s" repeatCount="indefinite"/></rect>
<rect x="120" y="740" width="30" height="80" rx="15" fill="#2a1a52"/>
</g>
<g id="candles">
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -16;0 0" dur="6s" repeatCount="indefinite"/>
<rect x="270" y="360" width="8" height="30" fill="#efe3c2"/><circle cx="274" cy="350" r="20" fill="url(#wglow)"/><ellipse cx="274" cy="352" rx="4" ry="8" fill="#ffd36b"><animate attributeName="ry" values="7;10;7" dur="1.4s" repeatCount="indefinite"/></ellipse></g>
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -22;0 0" dur="8s" begin="1s" repeatCount="indefinite"/>
<rect x="330" y="470" width="8" height="26" fill="#efe3c2"/><circle cx="334" cy="460" r="18" fill="url(#wglow)"/><ellipse cx="334" cy="462" rx="4" ry="7" fill="#ffd36b"><animate attributeName="ry" values="6;9;6" dur="1.2s" repeatCount="indefinite"/></ellipse></g>
<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 0" dur="7s" begin="2s" repeatCount="indefinite"/>
<rect x="1180" y="520" width="8" height="28" fill="#efe3c2"/><circle cx="1184" cy="510" r="18" fill="url(#wglow)"/><ellipse cx="1184" cy="512" rx="4" ry="7" fill="#ffd36b"><animate attributeName="ry" values="6;9;6" dur="1.6s" repeatCount="indefinite"/></ellipse></g>
</g>
<g id="motes">${motes(
  [[260, 820, 30, 9, 0, 3], [340, 800, -20, 11, 3, 2.4], [420, 840, 24, 10, 6, 2.8], [1250, 830, -30, 10, 1, 3], [1340, 810, 24, 12, 4, 2.4], [1420, 850, -18, 9, 7, 2.6], [1520, 820, 20, 11, 2, 3]],
  '#ffd36b',
)}</g>
</svg>`

const SHAMAN_FIRE = `<g id="fire" transform="translate(250 800)">
<ellipse cx="0" cy="40" rx="120" ry="18" fill="#000" opacity="0.4"/>
<rect x="-70" y="22" width="140" height="16" rx="8" fill="#3a2414" transform="rotate(-8)"/>
<rect x="-70" y="22" width="140" height="16" rx="8" fill="#2c1b10" transform="rotate(10)"/>
<ellipse cx="0" cy="-30" rx="150" ry="110" fill="url(#sglow)"><animate attributeName="opacity" values="0.55;0.9;0.6" dur="2.4s" repeatCount="indefinite"/></ellipse>
<path d="M-40 28C-60-20-20-50-8-110C20-60 60-40 40 28Z" fill="#e0662a"><animate attributeName="d" values="M-40 28C-60-20-20-50-8-110C20-60 60-40 40 28Z;M-40 28C-52-30-30-60 4-124C26-64 56-30 40 28Z;M-40 28C-60-20-20-50-8-110C20-60 60-40 40 28Z" dur="1.8s" repeatCount="indefinite"/></path>
<path d="M-22 28C-32-10-6-30 0-70C16-34 34-14 22 28Z" fill="#ffb347"><animate attributeName="d" values="M-22 28C-32-10-6-30 0-70C16-34 34-14 22 28Z;M-22 28C-28-16-10-36 6-84C20-40 32-10 22 28Z;M-22 28C-32-10-6-30 0-70C16-34 34-14 22 28Z" dur="1.3s" repeatCount="indefinite"/></path>
</g>`

export const SHAMAN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a110d"/><stop offset="0.55" stop-color="#14221a"/><stop offset="1" stop-color="#2a1c10"/></linearGradient>
<radialGradient id="sglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ff8a3d" stop-opacity="0.55"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>
<radialGradient id="swisp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#7fe7d2" stop-opacity="0.8"/><stop offset="1" stop-color="#7fe7d2" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#ssky)"/>
<g id="stars">${stars([[90, 90, 1.8, 4, 0], [210, 170, 1.4, 3.4, 1], [330, 70, 2, 5, 2], [1260, 110, 1.6, 4.2, 0.4], [1380, 60, 2, 3.8, 1.6], [1510, 190, 1.6, 4.6, 2.4], [1180, 230, 1.4, 3.6, 0.9]], '#e8f3d8')}</g>
<g id="shooting-stars">${occasionalStar(300, 80, 17, 5)}${occasionalStar(900, 40, 26, 14)}${occasionalStar(1100, 120, 21, 9)}</g>
<g id="ridges">
<path d="M0 700 C120 640 230 660 340 720 L340 900 L0 900Z" fill="#0d1610"/>
<path d="M1600 690 C1470 630 1360 660 1250 730 L1250 900 L1600 900Z" fill="#0d1610"/>
</g>
<g id="tipi">
<path d="M60 760L170 470L280 760Z" fill="#241811"/>
<path d="M170 470L150 430M170 470L190 430" stroke="#3a2a1b" stroke-width="5" stroke-linecap="round"/>
<path d="M170 760L170 640L205 760Z" fill="#0c0805"/>
</g>
${SHAMAN_FIRE}
<g id="embers">${motes([[225, 700, 30, 7, 0, 3], [265, 700, -24, 9, 2, 2.4], [250, 690, 40, 8, 4, 2.8], [235, 700, -38, 10, 1, 2.2], [270, 700, 20, 6, 5, 3]], '#ffb347')}</g>
<g id="stag" fill="none" stroke="#06100a" stroke-width="10" stroke-linecap="round">
<path d="M1480 880L1480 520C1480 470 1500 430 1520 400"/>
<path d="M1480 560C1440 540 1410 500 1400 450M1440 530C1420 500 1410 470 1380 450M1480 520C1470 470 1440 420 1450 370"/>
<path d="M1520 400C1550 370 1560 330 1545 290M1530 380C1500 350 1490 320 1500 280"/>
<path d="M1380 450L1360 420M1400 450L1385 400M1450 370L1430 330M1545 290L1560 250M1500 280L1490 240" stroke-width="7"/>
</g>
<g id="catcher" transform="translate(1250 190)">
<g><animateTransform attributeName="transform" type="rotate" values="-4;4;-4" dur="7s" repeatCount="indefinite"/>
<path d="M0 -70L0 -20" stroke="#6b4a2b" stroke-width="3"/>
<circle cy="40" r="60" fill="none" stroke="#a9794a" stroke-width="5"/>
<g stroke="#d9c7a0" stroke-width="1.5" opacity="0.8"><path d="M-60 40L60 40M0 -20L0 100M-42 -2L42 82M42 -2L-42 82"/><circle cy="40" r="34" fill="none"/><circle cy="40" r="16" fill="none"/></g>
<path d="M0 100L0 150M-18 98L-26 140M18 98L26 140" stroke="#a9794a" stroke-width="3"/>
<circle cy="40" r="5" fill="#7fe7d2"/>
</g></g>
<g id="wisps">
<circle cx="1360" cy="640" r="26" fill="url(#swisp)"><animateTransform attributeName="transform" type="translate" values="0 0;-30 -50;20 -90;0 0" dur="14s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;1;0.4" dur="5s" repeatCount="indefinite"/></circle>
<circle cx="1540" cy="720" r="20" fill="url(#swisp)"><animateTransform attributeName="transform" type="translate" values="0 0;24 -60;-12 -110;0 0" dur="17s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.9;0.3" dur="6s" repeatCount="indefinite"/></circle>
<circle cx="380" cy="560" r="16" fill="url(#swisp)"><animateTransform attributeName="transform" type="translate" values="0 0;16 -40;-10 -80;0 0" dur="12s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.9;0.3" dur="4.5s" repeatCount="indefinite"/></circle>
</g>
<g id="fireflies">${motes([[1300, 800, 20, 12, 0, 2.4], [1420, 780, -24, 14, 3, 2], [1540, 810, 16, 11, 6, 2.6], [380, 760, 18, 13, 2, 2.2]], '#d6f27a')}</g>
</svg>`

const mountain = (d: string, op: number) => `<path d="${d}" class="ink" opacity="${op}"/>`

const MONK_PETALS = [
  [90, 14, 0, 9], [220, 18, 3, 12], [330, 12, 6, 10], [1280, 16, 1, 11], [1400, 14, 4, 13], [1520, 18, 7, 9],
]
  .map(
    ([x = 0, r = 12, t = 0, d = 10]) =>
      `<g><animateTransform attributeName="transform" type="translate" values="${x} -40;${x + 40} 460;${x - 20} 940" dur="${d * 2}s" begin="${t}s" repeatCount="indefinite"/><ellipse rx="${r}" ry="${r / 2.4}" class="petal"><animateTransform attributeName="transform" type="rotate" values="0;180;360" dur="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.8;0.8;0" dur="${d * 2}s" begin="${t}s" repeatCount="indefinite"/></ellipse></g>`,
  )
  .join('')

export const MONK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.paper-a{stop-color:#f1eadb}.paper-b{stop-color:#e2d9c6}
.ink{fill:#2b2822}.mist{fill:#f1eadb}.sun{fill:#b4442c}.enso{stroke:#2b2822}.petal{fill:#c97b6b}.tile{fill:#2b2822}
@media (prefers-color-scheme: dark){
.paper-a{stop-color:#1f1d1a}.paper-b{stop-color:#13120f}
.ink{fill:#d8d0bf}.mist{fill:#1f1d1a}.sun{fill:#c9573b}.enso{stroke:#d8d0bf}.petal{fill:#b86a5c}.tile{fill:#d8d0bf}
}
</style>
<defs><linearGradient id="mbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="paper-a"/><stop offset="1" class="paper-b"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#mbg)"/>
<circle id="sun" cx="210" cy="190" r="70" class="sun" opacity="0.7"><animate attributeName="opacity" values="0.55;0.8;0.55" dur="12s" repeatCount="indefinite"/></circle>
<g id="enso" transform="translate(1400 170) rotate(-30)" fill="none" stroke-linecap="round">
<circle r="80" class="enso" stroke-width="14" stroke-dasharray="420 90" opacity="0.55"><animate attributeName="stroke-dashoffset" values="0;-510" dur="40s" repeatCount="indefinite"/></circle>
</g>
<g id="far-mountains">
${mountain('M0 640L90 560L170 610L270 500L380 600L440 650L440 900L0 900Z', 0.18)}
${mountain('M1600 620L1500 540L1410 590L1320 480L1220 580L1160 640L1160 900L1600 900Z', 0.18)}
</g>
<g id="mist">
<g><animateTransform attributeName="transform" type="translate" values="-30 0;40 0;-30 0" dur="26s" repeatCount="indefinite"/><ellipse cx="180" cy="660" rx="300" ry="34" class="mist" opacity="0.7"/></g>
<g><animateTransform attributeName="transform" type="translate" values="30 0;-40 0;30 0" dur="30s" repeatCount="indefinite"/><ellipse cx="1420" cy="650" rx="300" ry="34" class="mist" opacity="0.7"/></g>
</g>
<g id="near-mountains">
${mountain('M0 760L110 650L210 720L330 610L420 730L420 900L0 900Z', 0.42)}
${mountain('M1600 750L1490 640L1390 710L1280 600L1190 720L1190 900L1600 900Z', 0.42)}
</g>
<g id="pagoda" class="tile" transform="translate(1380 520)">
<path d="M-50 0L0 -26L50 0ZM-38 -30L0 -54L38 -30ZM-26 -58L0 -80L26 -58Z" class="tile" opacity="0.7"/>
<rect x="-30" y="0" width="60" height="24" class="tile" opacity="0.7"/>
</g>
<g id="pine" class="tile" opacity="0.6"><path d="M150 640L150 520M150 560L110 540M150 540L195 515M150 600L105 580M150 585L200 560" stroke-width="7" stroke-linecap="round" fill="none" class="enso"/></g>
<g id="petals">${MONK_PETALS}</g>
</svg>`


// ---- Reactive states: calm (above), busy (Claude is working), done (celebration) ----

const num = (n: number) => String(Math.round(n * 100) / 100)

// Speed every animation up by k: shorter durations and delays.
const faster = (svg: string, k: number) =>
  svg.replace(/(dur|begin)="([0-9.]+)s"/g, (_m, a: string, v: string) => `${a}="${num(Number(v) / k)}s"`)

const before = (svg: string, extra: string) => svg.replace('</svg>', `${extra}</svg>`)

// A ray burst at a corner: grows and fades, repeating.
const burst = (x: number, y: number, color: string, dur: number, begin: number, size = 90) => {
  const rays = Array.from({ length: 10 }, (_v, i) => {
    const a = (i / 10) * Math.PI * 2
    return `<line x1="${num(Math.cos(a) * size * 0.35)}" y1="${num(Math.sin(a) * size * 0.35)}" x2="${num(Math.cos(a) * size)}" y2="${num(Math.sin(a) * size)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`
  }).join('')
  return `<g transform="translate(${x} ${y})" opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;0.25;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="0.2;1.5" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>${rays}<circle r="${size * 0.2}" fill="${color}"/></g></g>`
}

// A shooting star streaking across the sky.
const shooter = (x: number, y: number, color: string, dur: number, begin: number) =>
  `<g opacity="0"><animateTransform attributeName="transform" type="translate" values="${x} ${y};${x + 620} ${y + 330}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.7;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><line x1="-130" y1="-68" x2="0" y2="0" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="0.6"/><circle r="6" fill="${color}"/></g>`

// An expanding ring.
const ring = (x: number, y: number, color: string, dur: number, begin: number, to = 260) =>
  `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="${color}" stroke-width="3" opacity="0"><animate attributeName="r" values="10;${to}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`

// A pulsing edge glow, brighter while Claude works.
const edgeGlow = (color: string, dur: number) =>
  `<defs><radialGradient id="eg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${color}" stop-opacity="0.55"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>` +
  [[120, 520], [1480, 520]]
    .map(
      ([x, y]) =>
        `<ellipse cx="${x}" cy="${y}" rx="320" ry="520" fill="url(#eg)" opacity="0.4"><animate attributeName="opacity" values="0.25;0.75;0.25" dur="${dur}s" repeatCount="indefinite"/></ellipse>`,
    )
    .join('')

const OVERLAYS: Record<string, { busy: string; done: string; speed: number }> = {
  wizard_unused: {
    speed: 1,
    busy:
      edgeGlow('#a98bff', 1.6) +
      motes(
        [[250, 840, 40, 3.5, 0, 3.4], [300, 860, -30, 4, 1, 3], [370, 850, 30, 3.8, 2, 3.2], [1230, 850, -40, 3.6, 0.5, 3.4], [1330, 860, 30, 4.2, 1.5, 3], [1440, 850, -30, 3.7, 2.5, 3.2], [1530, 860, 20, 4, 0.8, 3]],
        '#e9d8ff',
      ) +
      `<g fill="none" stroke="#ffd36b" stroke-width="2.5" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;1;0;0.8;0" dur="1.4s" repeatCount="indefinite"/><path d="M1380 590L1420 640L1390 650L1450 720"/><path d="M200 330L240 380L215 388L270 450"/></g>`,
    done:
      shooter(500, 40, '#fff4d6', 2.6, 0) + shooter(260, 120, '#ffd36b', 3, 0.9) + shooter(700, 20, '#cbb4ff', 2.8, 1.7) +
      burst(150, 200, '#ffd36b', 2.2, 0.2) + burst(1450, 300, '#cbb4ff', 2.4, 1) + burst(1500, 760, '#ffd36b', 2.2, 1.6),
  },
  shaman: {
    speed: 2.2,
    busy:
      edgeGlow('#ff8a3d', 1.4) +
      motes(
        [[215, 760, 36, 3, 0, 3.4], [255, 760, -30, 3.6, 0.6, 3], [240, 750, 44, 3.2, 1.2, 3.2], [270, 760, -40, 3.8, 1.8, 2.8], [230, 760, 30, 3, 2.4, 3], [1500, 840, -30, 4, 0.3, 3], [1350, 850, 30, 4.4, 1.4, 3]],
        '#ffc15a',
      ) +
      ring(250, 760, '#ff8a3d', 2.2, 0, 220) + ring(250, 760, '#ffb347', 2.2, 1.1, 220),
    done:
      burst(150, 220, '#7fe7d2', 2.2, 0.2) + burst(1450, 260, '#ffb347', 2.4, 1) + burst(1500, 740, '#7fe7d2', 2.2, 1.6) +
      motes(
        [[1400, 700, 30, 4, 0, 4], [1500, 720, -20, 5, 1, 3.4], [1330, 740, 25, 4.5, 2, 3.8], [380, 700, 25, 4.5, 0.5, 3.6]],
        '#7fe7d2',
      ) +
      ring(1480, 520, '#7fe7d2', 3, 0, 300) + ring(1480, 520, '#ffb347', 3, 1.5, 300),
  },
  monk: {
    speed: 2,
    busy:
      `<g class="ink" opacity="0.28">${[420, 520, 620, 700]
        .map((y, i) => `<rect x="-120" y="${y}" width="140" height="3" rx="1.5"><animateTransform attributeName="transform" type="translate" values="0 0;520 0" dur="${3 + i}s" begin="${i * 0.7}s" repeatCount="indefinite"/></rect><rect x="1600" y="${y + 40}" width="140" height="3" rx="1.5"><animateTransform attributeName="transform" type="translate" values="0 0;-520 0" dur="${3.4 + i}s" begin="${i * 0.5}s" repeatCount="indefinite"/></rect>`)
        .join('')}</g>` +
      ring(1400, 170, '#b4442c', 2.8, 0, 200) + ring(210, 190, '#b4442c', 2.8, 1.4, 200),
    done:
      ring(210, 190, '#b4442c', 3.2, 0, 340) + ring(210, 190, '#b4442c', 3.2, 1.6, 340) + ring(1400, 170, '#b4442c', 3.2, 0.8, 340) +
      burst(150, 330, '#c97b6b', 2.6, 0.3, 70) + burst(1450, 330, '#c97b6b', 2.6, 1.1, 70),
  },
}

// ---- Time of day: the same scene, re-skied for dawn, day, dusk or night ----

const SHAMAN_SKY: Record<Day, { stops: [string, string, string]; stars: number }> = {
  night: { stops: ['#0a110d', '#14221a', '#2a1c10'], stars: 1 },
  dawn: { stops: ['#1d2a30', '#3d4a45', '#7a5a3e'], stars: 0.35 },
  day: { stops: ['#2b4a52', '#4f6e62', '#6f7a52'], stars: 0 },
  dusk: { stops: ['#171a2a', '#3d2530', '#7a4025'], stars: 0.35 },
}

// Where the sun (or moon) sits in the monk's scene.
const MONK_SUN: Record<Day, string> = {
  night: 'cx="230" cy="170" r="46" class="moon"',
  dawn: 'cx="250" cy="360" r="64" class="sun"',
  day: 'cx="210" cy="190" r="70" class="sun"',
  dusk: 'cx="300" cy="330" r="70" class="sun"',
}

function reskin(theme: string, svg: string, day: Day): string {
  if (theme === 'shaman') {
    const sky = SHAMAN_SKY[day]
    return svg
      .replace('#0a110d', sky.stops[0])
      .replace('#14221a', sky.stops[1])
      .replace('#2a1c10', sky.stops[2])
      .replace('<g id="stars">', `<g id="stars" opacity="${sky.stars}">`)
  }

  return svg
    .replace('cx="210" cy="190" r="70" class="sun"', MONK_SUN[day])
    .replace('</style>', '.moon{fill:#c8c2b0}</style>')
}

const VEIL = '<rect width="1600" height="900" fill="#05030a" opacity="0.38"/>'

const cache = new Map<string, string>()

// Scene names look like wizard_calm_night: the look, its mood, the time of day.
// Moods: calm, busy (Claude is working), done (a short celebration), error (everything dims).
export function sceneSource(key: string): string | undefined {
  const hit = cache.get(key)

  if (hit !== undefined) {
    return hit
  }
  const [theme = '', mood = '', day = ''] = key.split('_')

  if (!['wizard', 'shaman', 'monk'].includes(theme) || !['calm', 'busy', 'done', 'error'].includes(mood) || !['dawn', 'day', 'dusk', 'night'].includes(day)) {
    return undefined
  }
  const d = day as Day
  const m: Mood = mood === 'error' ? 'calm' : (mood as Mood)
  let svg: string

  if (theme === 'wizard') {
    svg = library(m, d)
  } else {
    const o = OVERLAYS[theme]
    const base = reskin(theme, theme === 'monk' ? MONK : SHAMAN, d)
    const char = theme === 'monk' ? monkChar : shamanChar
    const extras = theme === 'monk' ? monkExtras : shamanExtras

    if (o === undefined) {
      return undefined
    }
    // Only the base speeds up while Claude works; the extras and the figure stay as they are.
    const body = m === 'calm' ? base : m === 'busy' ? before(faster(base, o.speed), o.busy) : before(base, o.done)
    svg = before(before(body, extras()), char(m))
  }

  if (mood === 'error') {
    svg = before(svg, VEIL)
  }
  cache.set(key, svg)

  return svg
}
