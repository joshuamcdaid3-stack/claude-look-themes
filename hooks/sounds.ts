// Quiet by design: these play beside someone's work for hours, and only once the speaker in the title bar is on.
// Clicking the bare backdrop plays a note: the further right, the higher.

// Typed loosely on purpose: older builds of the command-line checker don't know `sound` yet; the app does.
export const SOUNDS: Record<string, unknown> = {
  // A warm room: a low hum, a crackling fire far off, and the odd turning page.
  wizard: {
    ambience: {
      reverb: 0.25,
      layers: [
        { wave: 'brown', drone: true, gain: 0.1, filter: { type: 'lowpass', hz: 380 } },
        { wave: 'crackle', scatter: 1.6, gain: 0.1, release: 0.06, filter: { type: 'lowpass', hz: 3000 } },
        { wave: 'white', scatter: 0.12, gain: 0.04, release: 0.4, filter: { type: 'bandpass', hz: 3200 } },
      ],
    },
    cues: {
      send: { layers: [{ wave: 'triangle', notes: ['E5'], gain: 0.12, release: 0.2 }] },
      tool: { layers: [{ wave: 'crackle', gain: 0.1, release: 0.05 }] },
      done: { reverb: 0.3, layers: [{ wave: 'bell', notes: ['E5', 'G5', 'B5'], step: 0.12, gain: 0.22, release: 1.4 }] },
      ask: { reverb: 0.2, layers: [{ wave: 'bell', notes: ['A4', 'E5'], step: 0.15, gain: 0.18, release: 1 }] },
      error: { layers: [{ wave: 'sine', notes: ['A2', 'E2'], step: 0.2, gain: 0.2, release: 0.8 }] },
      click: { reverb: 0.3, layers: [{ wave: 'bell', notes: ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'], gain: 0.18, release: 1.2 }] },
    },
  },
  // Night air by the fire: wind, a low drone, embers popping.
  shaman: {
    ambience: {
      layers: [
        { wave: 'pink', drone: true, gain: 0.07, filter: { type: 'lowpass', hz: 600 }, tremolo: { hz: 0.15, depth: 0.5 } },
        { wave: 'sine', drone: true, notes: ['D2', 'A2'], gain: 0.05 },
        { wave: 'crackle', scatter: 3, gain: 0.13, release: 0.06, filter: { type: 'lowpass', hz: 4000 } },
      ],
    },
    cues: {
      send: { layers: [{ wave: 'triangle', notes: ['D3'], gain: 0.14, release: 0.18, glide: -4 }] },
      tool: { layers: [{ wave: 'triangle', notes: ['D3'], gain: 0.08, release: 0.1, glide: -6 }] },
      done: { layers: [{ wave: 'triangle', notes: ['D4', 'F4', 'A4'], step: 0.16, gain: 0.2, release: 0.9 }] },
      ask: { layers: [{ wave: 'triangle', notes: ['A3', 'D4'], step: 0.16, gain: 0.16, release: 0.7 }] },
      error: { layers: [{ wave: 'sine', notes: ['G2', 'D2'], step: 0.2, gain: 0.2, release: 0.8 }] },
      click: { layers: [{ wave: 'triangle', notes: ['D3', 'F3', 'A3', 'C4', 'D4'], gain: 0.16, release: 0.6, glide: -3 }] },
    },
  },
  // A still hall: a faint hum, and a wind chime far away now and then.
  monk: {
    ambience: {
      reverb: 0.4,
      layers: [
        { wave: 'pink', drone: true, gain: 0.05, filter: { type: 'lowpass', hz: 500 } },
        { wave: 'sine', drone: true, notes: ['D3', 'A3'], gain: 0.04 },
        { wave: 'bell', scatter: 0.12, notes: ['A5', 'C#6', 'E6', 'F#6'], gain: 0.05, release: 2.5 },
      ],
    },
    cues: {
      send: { layers: [{ wave: 'bell', notes: ['D5'], gain: 0.1, release: 0.8 }] },
      tool: { layers: [{ wave: 'bell', notes: ['A5'], gain: 0.05, release: 0.3 }] },
      done: { reverb: 0.4, layers: [{ wave: 'bell', notes: ['A4', 'D5'], step: 0.5, gain: 0.25, release: 3 }] },
      ask: { layers: [{ wave: 'bell', notes: ['F#5'], gain: 0.15, release: 1.5 }] },
      error: { layers: [{ wave: 'sine', notes: ['D3', 'Ab2'], step: 0.25, gain: 0.18, release: 0.9 }] },
      click: { reverb: 0.4, layers: [{ wave: 'bell', notes: ['D4', 'F#4', 'A4', 'C#5', 'D5', 'F#5'], gain: 0.16, release: 2.5 }] },
    },
  },
}
