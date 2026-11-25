# look: animated themes for Claude Code

`/look wizard`, `/look shaman` and `/look monk` switch the Claude desktop app's Code tab between three animated vector themes. `/look off` returns to the normal look.

- **Wizard**: a candle-lit library with a night window, a sleeping cat, and a small levitating wizard who takes books from the shelf and reads them while Claude works.
- **Shaman**: forest dusk by a campfire, a drumming shaman, an owl in the dead tree and the odd shooting star.
- **Monk**: ink mountains, a meditating monk who rings a temple bell while Claude works, a bird on the pagoda and drifting incense smoke.

Each theme reacts to Claude: calm when idle, a gentle working scene during a turn (the character acts, nothing gets brighter), a ten second celebration when it finishes, and a dimmed scene on an error. The sky follows your clock (dawn, day, dusk, night). The status line shows what the character is doing, and there is optional quiet sound (turn on the speaker in the title bar; clicking the backdrop plays a note).

Themes show in local sessions in the Code tab of the Claude desktop app, not in cloud sessions or the terminal.

## Install

At the prompt of a terminal session:

```
/plugin install look --marketplace joshuamcdaid3-stack/claude-look-themes
```

From a shell:

```
claude plugin install look --marketplace joshuamcdaid3-stack/claude-look-themes
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `joshuamcdaid3-stack/claude-look-themes`, then Add plugin.

Then open a new local session and type `/look wizard`.

## Changing it

The art is plain SVG animated with SMIL, in `hooks/`: `library.ts` (the wizard's library), `scenes.ts` (shaman, monk and the time of day), `characters.ts`, `sounds.ts` and `register.tsx` (the command and reactions).

## License

MIT, for the themes, scenes, characters, sounds and command code (see `LICENSE`).

`hooks/make-colors.js` and `hooks/make-colors.d.ts` are a colour helper copied from Claude's mod-authoring skill. They are not mine and are not covered by this licence.
