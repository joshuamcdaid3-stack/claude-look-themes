import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { sceneSource } from './scenes.js'
import { SOUNDS } from './sounds.js'

const roles = (accent: string, danger: string, success: string, warning: string, pro: string) => ({
  accent,
  danger,
  success,
  warning,
  pro,
})

// Wizard: candle-lit library, warm browns and gold. Dark only.
const wizard = makeColors({
  label: 'Wizard',
  only: 'dark',
  roles: roles('#e0a84a', '#e5605a', '#8fc47a', '#e0b44c', '#b48ae0'),
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1a1410',
        'surface-1': '#211a14',
        'surface-2': '#2a2018',
        'surface-3': '#2a2018',
        'text-primary': '#f3e8d4',
        'text-secondary': '#d6c7ad',
        'text-muted': '#b3a389',
      },
    },
  },
})

// Shaman: forest dusk, ember orange. Dark only.
const shaman = makeColors({
  label: 'Shaman',
  only: 'dark',
  roles: roles('#e0823a', '#d9534f', '#8bbf6a', '#d9a441', '#5fb3a4'),
  dark: {
    gray: {
      anchors: {
        'surface-0': '#11160f',
        'surface-1': '#171d14',
        'surface-2': '#1e261a',
        'surface-3': '#1e261a',
        'text-primary': '#efe9d6',
        'text-secondary': '#d0c8ae',
        'text-muted': '#aba388',
      },
    },
  },
})

// Monk: ink on rice paper by day, charcoal by night.
const monk = makeColors({
  label: 'Monk',
  roles: roles('#b4442c', '#b3392f', '#4e7d3a', '#a86f14', '#6d4f94'),
  light: {
    gray: {
      anchors: {
        'surface-0': '#ece5d6',
        'surface-1': '#f2ecde',
        'surface-2': '#f8f3e7',
        'text-primary': '#1f1d1a',
        'text-secondary': '#4a463f',
        'text-muted': '#655f55',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1a1917',
        'surface-1': '#211f1c',
        'surface-2': '#292622',
        'surface-3': '#292622',
        'text-primary': '#ece7dc',
        'text-secondary': '#c9c2b4',
        'text-muted': '#a39c8d',
      },
    },
  },
})

const LOOKS: Record<string, ThemeSetArgs> = {
  wizard: {
    colors: wizard.theme,
    overrideColorScheme: 'dark',
    backdrop: { scene: 'wizard', glass: { blur: 14, tint: '#1a1410', opacity: 0.6 } },
  },
  shaman: {
    colors: shaman.theme,
    overrideColorScheme: 'dark',
    backdrop: { scene: 'shaman', glass: { blur: 14, tint: '#11160f', opacity: 0.55 } },
  },
  monk: {
    colors: monk.theme,
    backdrop: { scene: 'monk', glass: { blur: 12, tint: '#ece5d6', opacity: 0.5 } },
  },
}

const NAMES = Object.keys(LOOKS)
const USAGE = `Usage: /look ${NAMES.join(' | ')} | off`

type Mood = 'calm' | 'busy' | 'done' | 'error'
type Day = 'dawn' | 'day' | 'dusk' | 'night'

// What the clock says: dawn 5-8, day 8-17, dusk 17-20, night otherwise.
const dayPart = (hour: number): Day => (hour >= 5 && hour < 8 ? 'dawn' : hour >= 8 && hour < 17 ? 'day' : hour >= 17 && hour < 20 ? 'dusk' : 'night')

// The look for a theme in a mood and time of day: the same colors, another scene.
const withMood = (name: string, mood: Mood, day: Day): ThemeSetArgs | undefined => {
  const look = LOOKS[name]

  if (look === undefined || look.backdrop === undefined || !('scene' in look.backdrop)) {
    return look
  }

  return { ...look, backdrop: { scene: `${name}_${mood}_${day}`, glass: look.backdrop.glass }, sound: SOUNDS[name] } as ThemeSetArgs
}

// Set a look, and fall back to no sound where this build can't take it. Declared at the top level so the engine can follow `$`.
async function applyLook($: EngineInterface, look: ThemeSetArgs): Promise<{ isDrawn: boolean; reason?: string }> {
  try {
    return await $.theme.set(look)
  } catch (error) {
    $.ui.log(String(error))
    const quiet: ThemeSetArgs = { colors: look.colors, backdrop: look.backdrop, overrideColorScheme: look.overrideColorScheme }

    return await $.theme.set(quiet)
  }
}

// Re-draw the active look in a mood, for the time of day it is now.
async function setMood($: EngineInterface, mood: Mood): Promise<void> {
  const name = await $.store.get('look')
  const day = dayPart(new Date(await $.clock.now()).getHours())
  const look = typeof name === 'string' ? withMood(name, mood, day) : undefined

  if (look !== undefined) {
    try {
      await applyLook($, look)
    } catch (error) {
      $.ui.log(String(error))
    }
  }
}

// A line for the status bar: what the character is doing while Claude works.
const DOING: Record<string, Record<string, string>> = {
  wizard: { Read: 'Consulting the tomes', Grep: 'Searching the shelves', Glob: 'Searching the shelves', Edit: 'Inscribing a scroll', Write: 'Inscribing a scroll', Bash: 'Casting a spell', WebSearch: 'Scrying afar', WebFetch: 'Scrying afar', _: 'Pondering' },
  shaman: { Read: 'Reading the embers', Grep: 'Tracking spirits', Glob: 'Tracking spirits', Edit: 'Carving the totem', Write: 'Carving the totem', Bash: 'Stoking the fire', WebSearch: 'Listening to the wind', WebFetch: 'Listening to the wind', _: 'Drumming' },
  monk: { Read: 'Studying the sutras', Grep: 'Walking the path', Glob: 'Walking the path', Edit: 'Brushing the scroll', Write: 'Brushing the scroll', Bash: 'Ringing the bell', WebSearch: 'Gazing at the horizon', WebFetch: 'Gazing at the horizon', _: 'Breathing' },
}

async function say($: EngineInterface, tool: string | undefined): Promise<void> {
  const name = await $.store.get('look')
  const lines = typeof name === 'string' ? DOING[name] : undefined

  if (lines === undefined) {
    return
  }
  $.ui.status(`${lines[tool ?? '_'] ?? lines._ ?? ''}...`)
}

let celebration = 0

const CELEBRATION_MS = 10_000

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'look',
      description: 'Switch theme: wizard, shaman, monk, or off',
      argumentHint: '[wizard|shaman|monk|off]',
    })
    await setMood($, 'calm')

    return next(e)
  })

  on('command.run', { command: 'look' }, async ($, e) => {
    const name = e.args.trim().toLowerCase()

    if (name === 'off' || name === 'normal' || name === 'default') {
      await $.store.delete('look')
      await $.theme.clear()
      $.ui.status(undefined)

      return { text: 'Back to the normal look.' }
    }

    if (LOOKS[name] === undefined) {
      return { text: name === '' ? USAGE : `Unknown look "${name}". ${USAGE}` }
    }

    await $.store.set('look', name)
    const look = withMood(name, 'calm', dayPart(new Date(await $.clock.now()).getHours()))
    const set = look === undefined ? undefined : await applyLook($, look)

    return {
      text: set?.isDrawn === false ? `Look "${name}" saved, but nothing draws it here: ${set.reason ?? ''}` : `Look: ${name}.`,
    }
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      celebration += 1
      await setMood($, 'busy')
      await say($, undefined)
    }

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    await say($, e.tool)

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      celebration += 1
      const mine = celebration
      $.ui.status(undefined)

      if (e.reason === 'answer' || e.reason === 'error' || e.reason === 'refusal') {
        // A good answer celebrates; a failure dims the scene. Both settle after ten seconds.
        await setMood($, e.reason === 'answer' ? 'done' : 'error')
        $.clock.after(CELEBRATION_MS, () => {
          if (celebration === mine) {
            void setMood($, 'calm')
          }
        })
      } else {
        await setMood($, 'calm')
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const source = sceneSource(String(e.props.scene))

    if (source === undefined) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={source} alt={`${String(e.props.scene)} backdrop`} isInteractive />
  })
}
