# Tiered loadout system design

_Started 2026-09-23 02:43 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Design a single-page combat playbook for my D&D 5e character, used at the table"
The project currently has no files except possibly dotfiles — a `list_files` on the project root would return nothing else.
Current date is now September 22, 2026
</system-info>

<default aesthetic_system_instructions>
The user has not attached a design system. If they have ALSO not attached references or art direction, and the project is empty (the auto-managed _ds/ folder doesn't count), ask your opening questions with the ask_user tool. Whenever you ask opening questions in this project, include a design-system question in the form: the user's pick there sets the visual direction, so do NOT also ask about the visual aesthetic (no questions about vibe, colors or palette directions (including color-swatch svg-options questions), typography, mood, or art direction). Spend your other questions on everything else: audience, purpose, content, structure, scope, interactions, tone of copy. Exception: if the request already states the visual direction as a brand or concrete art direction, leave the design-system question out of your own questions (the app may still add one — it's skippable, and a skip doesn't change the stated direction) — but if they name a design system that isn't attached, keep the question: their pick there is what attaches it.

If the design-system question comes back unanswered — skipped without a pick (a "Not sure" / decide-for-me answer counts as a pick: it applies the effective default) — and no references or other art direction arrived either, THEN ask the visual-aesthetic questions before designing: a follow-up round (or one focused question) about vibe, colors, type, and mood is the right move once the design-system ask went unanswered. Do NOT just pick your own. Once you have a direction, use this guidance when creating designs:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are user-authored files in the project already (the auto-managed _ds/ folder is not user-authored).
</default aesthetic_system_instructions>

<pasted_text name="Pasted text (137 lines)">
Design a single-page combat playbook for my D&amp;D 5e character, used at the table during live play. It must be fast to scan mid-fight: I should find the right move in under 5 seconds.

## Character
Siris — Kalashtar Artillerist Artificer, glassblower of "The Eighth Fold" glass guild. Level 4, reaching level 5 soon.

## Layout requirements
- One page / one screen. Works on a tablet at arm's length and prints cleanly on one landscape sheet.
- Top strip: core stats (below) with a Level 4 / Level 5 toggle that swaps every number on the page.
- Left column: "Which play?" decision flow (below).
- Main area: playbook cards in a grid. Each card has the play name, a one-line "use when," a resource badge, then action-economy lanes: ACTION | BONUS ACTION | REACTION (only show lanes that are used), each with dice and a total average.
- Filter chips above the cards: Free / Uses slot / Near (≤30 ft of cannon) / Far / Level 5 only.
- Footer: rules reminders and "Pending DM rulings."
- Show dice as full expressions with labeled parts, e.g. "2d10 + 1d8 + 5 (cantrip + firearm + oil) ≈ 20.5." Averages in a muted smaller style.

## Visual direction
Stained-glass / glassworks workshop: deep charcoal background, jewel-tone accents (molten amber for fire, cobalt for force, green for acid, violet for psychic/control). Thin leaded-glass style dividers. Clean sans-serif body with high contrast; decorative flavor only in headers. Never rely on color alone: pair each damage type and badge with an icon or text label.

Badges:
- FREE (no slot) · SLOT (1st or 2nd) · CONC (concentration, icon) · DM? (dashed outline = ruling not yet approved) · L5 (level 5 only)

## Core stats
| | Level 4 | Level 5 |
|---|---|---|
| Spell attack | +6 | +7 |
| Spell save DC | 14 | 15 |
| Chistera attack | +Dex +2 | +Dex +3 |
| Slots | 3× 1st | 4× 1st, 2× 2nd |
| Fire Bolt | 1d10 (5.5) | 2d10 + 1d8 firearm (15.5) |
Assume Dex +2 for chistera math; mark it as an editable value.

Free once per long rest (Fey Touched): Misty Step, Dissonant Whispers.

## Tools reference (show as a compact strip or side panel)
- Eldritch Cannon (bonus action to fire; must be within 60 ft of me; can walk/climb 15 ft as part of that bonus action; AC 18, HP 5× my level; type is locked when summoned, rebuilding costs a slot)
  - Force Ballista: ranged spell attack, 120 ft, 2d8 force (9), pushes 5 ft
  - Flamethrower: 15-ft cone, Dex save, 2d8 fire (9), half on success; ignites unattended flammables. Effective reach ~30 ft (15 ft move + 15 ft cone)
- Magic Stone (cantrip, bonus action): imbue 3 orbs for 1 min; thrown 60 ft; spell attack; 1d6 + 4 bludgeoning (7.5). Allies who throw them use MY attack bonus and damage
- Chistera (glass jai-alai launcher, sling-style, 30/120 ft): 1d4 impact + 1d4 shrapnel + Dex (≈7)
- Oil: a coated target takes +5 fire the first time it takes ANY fire damage within 1 min (even half damage). Oil puddle: 5-ft square; once lit, burns 2 rounds, 5 fire to anyone entering or ending a turn in it

## Decision flow ("Which play?")
1. Caught in melee? → Clean Break
2. Target immune/resistant to fire? → Acid Etch
3. Boss hard to hit and allies can capitalize? → Lamplight
4. Mob swarm + time to prepare? → Kill Zone (L5 at range: Ranged Kill Zone)
5. Enemy caster is the problem? → Blackout
6. Mobs clustered? → Shatterpoint (L5)
7. Boss within ~30 ft of cannon? → Near plays: Glassfire, Pebble Kiln, Chistera Saver
8. Boss at range? → Far plays: Glass-shot Ballista (L5), Magic Stone Handoff, Prism Ray (L5), Glassfire (far)
Default baseline: Fire Bolt + cannon (L4: 14.5 · L5: 24.5)

## Playbook cards

GLASSFIRE — Boss burst opener · SLOT (1st; 2nd at L5)
- Action: Catapult an oil orb. Dex save or 3d8 bludgeoning (13.5); orb shatters and oils target
  - L5: cast at 2nd level through glass rod: 4d8 + 1d8 (upcast + firearm) ≈ 22.5
- Bonus (near): Flamethrower 2d8 + 5 (cannon + oil) ≈ 14
- Bonus (far): Force Ballista 2d8 (9); next turn Fire Bolt ignites oil (+5)
- Totals: L4 near 27.5 · L4 far 22.5 · L5 near 36.5 · L5 far 31.5
- Note: Catapult object must not be held; drop the orb at your feet first. Somatic only (works silenced)

PEBBLE KILN — Magic Stone oil orbs · FREE
- Pre-combat bonus action: imbue 3 oil orbs
- Action: throw orb, 1d6 + 4 (stone + Int) ≈ 7.5, target oiled
- Bonus (near): Flamethrower 2d8 + 5 ≈ 14 → ≈ 21.5/turn
- Far: alternate orb turn (orb + Ballista 16.5) and Fire Bolt ignite turn (10.5 + 9 = 19.5) → ≈ 18/turn
- L5: Fire Bolt route (24.5) wins; use orbs vs fire immunity or hand them off

CHISTERA SAVER — No slots · FREE · DM?
- Action: chistera orb 1d4 + 1d4 + Dex (impact + shrapnel + Dex) ≈ 7, target oiled
- Bonus (near): Flamethrower 2d8 + 5 ≈ 14 → ≈ 21/turn
- Far: alternate with Fire Bolt ignite → ≈ 17.75/turn
- Ground option: shatter orb for an oil puddle (5 fire per entry/turn end, 2 rounds)

GLASS-SHOT BALLISTA — Sustained ranged · FREE · DM? · L5
- Bonus (first): Force Ballista fires an oil orb: 2d8 force (9), target oiled
- Action: Fire Bolt 2d10 + 1d8 + 5 (cantrip + firearm + oil) ≈ 20.5
- Total ≈ 29.5/turn at any range (baseline 24.5)

MAGIC STONE HANDOFF — Team damage · FREE · DM? (glass orbs as "pebbles")
- Pre-combat: imbue 3 oil orbs, give to an ally without a good ranged attack
- Ally action: throw with my +7, 1d6 + 4 (7.5), target oiled
- Me: Fire Bolt 20.5 (with oil) + Ballista 9 = 29.5 (L5)

PRISM RAY — Boss burst · SLOT (2nd) · L5
- Action: Scorching Ray refracted through a glass prism: 3 rays × 2d6 fire (7 each) + 1d8 firearm on one ray + 5 oil if target oiled ≈ 30.5
- Bonus: Force Ballista 2d8 (9) → ≈ 39.5 if all rays hit

LAMPLIGHT — Hard-to-hit boss · SLOT (1st) · CONC
- Action: Faerie Fire (luminous glass dust), 20-ft cube, Dex save: attacks vs targets have advantage
- Bonus: Force Ballista with advantage, 2d8 (9)
- After: party + Fire Bolt + cannon all attack with advantage for 1 min

ACID ETCH — Fire-immune enemies · SLOT (1st) · CONC
- Action: Tasha's Caustic Brew, 30-ft line, Dex save: 2d4 acid at the start of each of its turns until scraped off (action) (≈5/turn). L5: +1d8 firearm on the first tick
- Bonus: Force Ballista 2d8 force (9)
- After: Magic Stone 1d6 + 4 bludgeoning (7.5)

KILL ZONE — Mob swarm, prep time · 0–2 slots
- Before combat: Snare the chokepoint; Magical Tinkering bead (recorded footsteps/voices) to lure; shatter oil orbs on the floor; pre-place Flamethrower cannon near the chokepoint
- Action: Grease the approach (optional)
- Bonus: Flamethrower 2d8 fire to the cone + lights the oil (5 fire per entry/turn end, 2 rounds)
- L5: Web instead of Grease; burning web deals 2d4 fire to anyone starting a turn in it, plus the cone's 2d8

RANGED KILL ZONE — Mob at range · SLOT (2nd) · CONC · DM? · L5
- Turn 1 action: Web (60 ft, 20-ft cube, Dex save or restrained)
- Turn 2 action: Fire Bolt ignites the web from up to 120 ft: 2d4 fire to anyone starting a turn in it
- Bonus: Force Ballista 2d8 (9); cannon stays safe with me

BLACKOUT — Shut down a caster · SLOT (2nd) or FREE · L5
- Option A: light an oil puddle near the caster, then Pyrotechnics on that fire: Con save or blinded until end of my next turn (everyone within 10 ft of the flame), or a 20-ft smoke cloud
- Option B (free 1/LR): Dissonant Whispers, Wis save: 3d6 psychic (10.5), half on success; on a fail it flees, provoking opportunity attacks from my allies

SHATTERPOINT — Clustered mobs · SLOT (2nd) · L5
- Action: Shatter through glass rod, 10-ft burst, Con save half: 3d8 + 1d8 thunder (spell + firearm) ≈ 18
- Bonus: Flamethrower 2d8 (9) on survivors

CLEAN BREAK — Escape melee · mostly FREE
- Reaction: Shield, +5 AC until my next turn (1st-level slot)
- Action: Dissonant Whispers (free 1/LR) 3d6 psychic; target flees
- Last resort: Misty Step (free 1/LR, bonus action, 30 ft), costs that turn's cannon shot

## Rules reminders (footer)
- One concentration spell at a time: Faerie Fire, Caustic Brew, Web, Heat Metal. Catapult, Shatter, Pyrotechnics, Snare, and Magic Stone don't need it
- Oil's +5 triggers once per coating
- Arcane Firearm (L5) adds +1d8 to ONE damage roll of an artificer spell cast through the glass rod; never the cannon
- Only one bonus action per turn: cannon vs Magic Stone vs Misty Step
- Bosses: target Dex saves or attack rolls. Casters: target Con/Str saves

## Pending DM rulings (dashed badges until approved)
1. Glass orbs count as Magic Stone "pebbles"
2. Chistera counts as a sling (proficient)
3. Shrapnel adds +1d4 piercing to chistera orbs
4. A Catapulted orb that shatters coats the target in oil
5. Force Ballista can fire oil orbs (same damage, adds oil)
6. Fire Bolt can target and ignite a Web
7. Arcane Firearm +1d8 can apply to one Magic Stone throw
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Design Components">
This project uses Design Components: every design is a single streaming `Name.dc.html` file. The full authoring spec is in your system prompt under "Writing code — Design Components" — follow it. Author and edit `.dc.html` content with the `dc_write`, `dc_html_str_replace`, `dc_js_str_replace`, and `dc_set_props` tools (not `write_file`; `str_replace_edit` works but won't stream); template edits stream into the live preview as you type.
</attached-skill>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

The playbook is built in **Siris Combat Playbook.dc.html** and is being checked now.

**How it works at the table:**
- The Level 4 / Level 5 toggle changes every number on the page. The Dex stepper recalculates the chistera attack and damage. Your level, Dex and ruling approvals are saved between sessions.
- Tap a "Which play?" question to highlight its cards and dim the rest. The filter chips hide cards that don't match. You can use both together.
- Tap a pending DM ruling to mark it approved. Its dashed badges turn solid wherever they appear.
- At Level 4, Level 5-only cards stay visible but dimmed, with their Level 5 numbers.

**Things I added that weren't in your brief:**
- **DM? 4** on Glassfire and **DM? 1** on Pebble Kiln, because the pending rulings apply to them.
- Far totals for Pebble Kiln and Chistera Saver at Level 5, worked out the same way as your Level 4 alternating-turns math.

**Printing:** it prints on one landscape sheet at about half scale and keeps the charcoal background. If you want an ink-saving light version for print, I can add one.

**Settings:** you can set Level 5-only cards to dim or hide at Level 4, filters to hide or dim, and the card grid to 3 columns, 4 columns or automatic.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

The Fire Bolt cell may still wrap; fixing its size.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

I've fixed the stats strip so it no longer breaks at tablet width; it's being re-checked now.

- The seven stats now sit on their own full-width row and don't wrap, so the empty black gap is gone.
- The title and the Level / Dex controls share the row above it.
- The Fire Bolt stat stays on one line.

## User

This feels like a tiered system, which clould flow liek this: Loadout (spells, equipment, etc.) > Which play/scenarios > Playbook. Can we updated it to have that sort of feel?

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

Now the logic additions.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The page now runs top to bottom in three tiers, in a new file: **Siris Combat Playbook v2.dc.html**. It's being checked now, and the original is unchanged.

- **I · Loadout:** the stats strip, then three panels: Spells (concentration spells marked ◎; 2nd-level spells crossed out at Level 4), the Eldritch Cannon, and Equipment. The panels collapse so the stats can stay visible mid-fight.
- **II · Which play?:** the 8 questions are now numbered tiles, plus a "None of the above" tile for the Fire Bolt + cannon baseline. Tapping a tile highlights its cards and scrolls down to the Playbook.
- **III · Playbook:** the filter chips and cards, unchanged.

Each tier has a numbered diamond header, and a small lead-line arrow links one tier to the next.

The Spells panel lists only the spells this playbook uses. If Siris has other spells prepared, send me the full list and I'll add them.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed three layout problems in v2; it's being re-checked now.

- **Damage labels:** the icon and word (e.g. "▲ fire") now stay on one line and no longer overlap the next row.
- **Rules reminders:** long items in the footer wrap properly instead of running into the next one.
- **Cannon stat:** "AC 18 · HP 20" now fits on one line.

## User

Which play is too restrictive (i'd like to see all plays in playbook at the same time... maybe add it as a pill/label on the playbook card.

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

All plays now stay visible in the Playbook when you pick a scenario; it's being checked now.

- **Scenario pills:** each card shows numbered pills for the Which-play questions that lead to it, e.g. "③ Hard-to-hit boss" or "⑦ Boss near". Glassfire shows both ⑦ and ⑧.
- **Tapping a scenario:** its matching cards get an amber outline, their pills turn amber, and the page scrolls to the Playbook. The other cards fade slightly but stay on screen.
- **Filter chips:** these still hide cards that don't match.

## User

Remove which play section. Also, remove level 5 options for now.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I removed the Which-play section and all Level 5 options in v2; it's being checked now.

- **Two tiers now:** I · Loadout and II · Playbook.
- **Scenario pills:** these stay on the cards as plain labels (e.g. "Boss near"), without the question numbers.
- **Level 5 removed:**
  - Gone from the page: the level toggle, the five Level 5-only cards, the "Level 5 only" chip, the 2nd-level spells, the glass rod and prism, the Arcane Firearm reminder, and DM rulings 5–7.
  - Kept: Level 4 numbers and rulings 1–4.

The Level 5 content is hidden rather than deleted, so I can bring it back with one change when Siris levels up.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed a bug that left v2 blank on load: the stats, cards and rulings weren't showing after the Level 5 removal. It's being re-checked now.

The rule "Only one bonus action per turn" in the footer was also still overlapping the line below it. I changed how the reminders lay out to stop the overlap.

## User

When I hover over spells in the spells card, provide pop-up dialogue box that provides instructions for use (rolls/dex save damage, etc).

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Hovering over a spell in the Spells panel now opens a pop-up with how to use it; on a tablet, tap to open and tap again to close. It's being checked now.

- **Top line:** tags for casting time, range or area, slot cost, and duration or concentration.
- **Rows below:** labeled Roll, Save, Fail, Pass, Hit, Setup, Also or Ends as each spell needs, with dice and averages. Your attack bonus and save DC (+6 / DC 14) are filled in.

The rules text is my summary of the standard 5e spells. Please check it against your books or your DM's house rules.

## User

i want there to be additional pills for which eldrich cannon/chistera as well

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I read this as gear pills on the playbook cards, and added them next to the scenario pills; they're being checked now. Each card now shows which cannon type it needs, plus the chistera where it applies:

- **▲ Flamethrower:** Glassfire, Pebble Kiln, Chistera Saver, Kill Zone
- **◆ Force Ballista:** Glassfire, Pebble Kiln, Chistera Saver, Magic Stone Handoff, Lamplight, Acid Etch
- **■ Chistera:** Chistera Saver
- **None:** Clean Break

Gear pills have square corners and a colored border, so they read differently from the rounded scenario pills.

If you meant hover pop-ups on the Cannon and Equipment panels, like the spells have, tell me and I'll add those.

## User

drop the use case pills, the near/far averages and subtitles for cards do the trick.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I removed the scenario pills from the cards. Each card now shows just its subtitle, the near/far averages, and the gear pills.

## User

I love some of the play names... others could use a makeover: Chistera Saver, Magic Stone Handoff, Lamplight (close, but lamp does a lot of the work and it's a weak noun--not really a "lamp"), Kill Zone (while true, thematically uninspired), Pebble Kiln (close, also missed opportunity/uninspired). I like dark humor so leveraging dark humor inspired names (where its a good fit, don't try and put a round peg in a square hole).

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I renamed five plays; the new names show on the cards and in the DM rulings list.

- **Chistera Saver → Breakage Fee:** you break it, they pay. Alternate: Cullet Toss (cullet is scrap glass).
- **Magic Stone Handoff → Party Favors:** lethal gifts for your allies. Alternate: Care Package.
- **Lamplight → Dead Man Glowing:** Faerie Fire marks the target. Alternate: Glitter Bomb.
- **Kill Zone → Welcome Mat:** an oiled floor and a bead that lures them in. Alternate: Open House.
- **Pebble Kiln → Firing Schedule:** kiln firing, or a firing squad's timetable. Alternate: Hot Rocks.

The Level 5 version of Kill Zone, which is hidden for now, is renamed Ranged Welcome Mat.

## User

Welcome Mat, Party Favors (or Firing squad) is excellent. Lets retry the rest.

## Assistant



## Assistant

_[tool: ask_user]_

I've put new name options for the other three plays in a form, plus a pick between Party Favors and Firing Squad for the team orb play. I'll apply your choices once you submit it.

## User

Answered — Asked for follow-up questions; glowing: Viewing Party; firing: Hot Potato; favors: Party Favors

## Assistant



## Assistant

_[tool: ask_user]_

I've added a new round to the form with more options for Breakage Fee, plus a space for any other questions you have. Viewing Party, Hot Potato and Party Favors are noted; I'll apply all the names once you submit.

## User

Answered — open_q: 1. What is the difference between the two orb flinging plays? They feel pretty similar...

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I renamed Dead Man Glowing to **Viewing Party** and Firing Schedule to **Hot Potato**. Breakage Fee stays as it is, since you didn't pick a new name.

**Hot Potato and Breakage Fee:** the two orb plays are nearly the same at Level 4. Both are free, oil the target and follow up with the Flamethrower for about 21 per turn. The difference is where the orbs come from:

- **Hot Potato (Magic Stone):**
  - It costs a bonus action before combat, and you get only 3 orbs for 1 minute.
  - It uses your spell attack (+6) for 1d6 + 4 ≈ 7.5, and allies can throw the orbs.
  - It needs DM ruling 1.
- **Breakage Fee (chistera):**
  - It needs no setup and has no orb limit.
  - It uses a weapon attack (Dex + 2) for 1d4 + 1d4 + Dex ≈ 7, and can shatter an orb into a burning puddle.
  - It needs DM rulings 2 and 3.

In practice Hot Potato is your opener when you have prep time, and Breakage Fee is what you fall back on once the stones run out.

I could merge them into one card with two ammo options, which frees a grid slot. Should I?

## User

Why couldn't i use the chistera with hot potato?

## Assistant

You can. Magic Stone's own text allows it: a pebble can be thrown *or hurled with a sling*. If your DM approves ruling 2 (the chistera counts as a sling), you can launch Magic Stone orbs with it.

- **What changes:** range goes from 60 ft thrown to 30/120 ft.
- **What stays the same:** it's still a spell attack at +6 for 1d6 + 4 ≈ 7.5, and it still oils the target.
- **Open question:** whether the shrapnel +1d4 (ruling 3) also applies to a Magic Stone orb. Magic Stone sets its own damage, so that's another call for your DM.

That makes Breakage Fee the same play with un-imbued orbs. The case for merging them into one card is stronger now:

- **Hot Potato:** imbued orbs first (3, spell attack, thrown or slung up to 120 ft).
- **When they run out:** plain chistera orbs (Dex attack, no limit, puddle option).

Want me to merge them, add ruling 2 to Hot Potato, and add the shrapnel question as a new pending ruling?

## User

what is the difference between an imbued orb and non imbued orb?

## Assistant

The difference is how you roll the attack and the damage:

- **Imbued orb (Magic Stone):**
  - It's a ranged **spell attack** at +6, and damage is **1d6 + 4** bludgeoning (≈ 7.5), using your Int.
  - It costs a bonus action to imbue, gives you 3 orbs, and they last 1 minute. Recasting ends any stones still imbued.
  - Allies can throw them using your +6 and your damage.
  - It counts as a spell, so Arcane Firearm could apply at Level 5 (ruling 7).
- **Plain orb (chistera):**
  - It's a ranged **weapon attack** at +4 (Dex + proficiency), and damage is **1d4 + 1d4 + Dex** (≈ 7, if rulings 2 and 3 are approved).
  - There's no setup and no limit beyond the orbs you carry.
  - It scales with Dex, not Int. It's magical only if the chistera is.

Both oil the target on impact, and both can be shattered on the ground to make a puddle.

At Dex +2 the damage is nearly equal, but the imbued orb hits more often (+6 vs +4). The plain orb costs nothing and never runs out.

## User

Ah, the key differentiator is ranged spell attack vs ranged weapon attack. Can we alter the play names to relfect that?

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I renamed both orb plays so the names say which kind of attack they use:

- **Hot Potato → Magic Bullet:** "magic" marks it as the spell attack, with a nod to the "magic bullet" theory for the dark humor. The subtitle now reads "Spell attack · Magic Stone orbs."
- **Breakage Fee → Blunt Instrument:** the classic murder weapon, and it marks the weapon attack. The subtitle now reads "Weapon attack · chistera, no slots."

The DM rulings list uses the new names too.

## User

Blunt instrument makes it seem like a melee attack. Magic Bullet is too close to Magic Missile--cliche... any dark humor we could flavor it with?

## Assistant



## Assistant

_[tool: ask_user]_

I've put darker name options for the two orb plays in a form. My picks are Cast the First Stone for the spell attack and Pane Killer for the weapon attack. I'll apply whatever you choose.

## User

Answered — Asked for follow-up questions

## Assistant



## Assistant

_[tool: ask_user]_

I've added more name options for both orb plays, plus a box to tell me the kind of dark humor you want. I'll rename the cards once you pick.

## User

Answered — Asked for follow-up questions

## Assistant



## Assistant

_[tool: ask_user]_

None of the names have landed yet, so I've switched to asking about direction: which kind of humor, how long the names should be, and whether the two should read as a matched pair. I'll write a fresh set from your answers.

## User

Answered — Asked for follow-up questions

## Assistant

_[tool: ask_user]_

## Assistant



## User

Dark humor should be macabre

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I went macabre and renamed both orb plays on the page:

- **Magic Bullet → Last Rites:** the spell attack. A rite is a ritual, like casting a spell, and it's what you're giving them. Alternates: Death Knell, Grave Goods, Tombstone.
- **Blunt Instrument → Coffin Nails:** the weapon attack. Cheap projectiles you can fire all day, each one sealing the lid a little tighter. Alternates: Body Count, Toe Tag, Glass Eye.

## User

IT should also be slightly descriptive...ask me lots of questoins to dial into the type of name we should have...

## Assistant



## Assistant

_[tool: ask_user]_

I've sent a longer form to pin down the naming style: what the name should hint at, which kind of macabre, tone, how descriptive versus flavorful, length, whose voice it's in, what to avoid, and which earlier names came closest. I'll write names from your answers once you submit.

## User

Answered — describe_what: The victim's fate; macabre_type: Morbid shop talk (the guild jokes about it); tone: Punny; clarity_slider: 7; length: 2 words; pair: Independent; voice: Siris (calm, psychic, precise); keep_liked: Welcome Mat, Party Favors; avoid: Pop-culture references, Spell names in the title, Anything that sounds melee; rename_scope: Just the orb plays; examples: Doesn't have to be stricly macabre, dark humor is okay too.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I renamed both orb plays, keeping to the style of Welcome Mat and Party Favors: an everyday phrase with a glass-shop pun on what happens to the target.

- **Spell attack → Blown Away:** glassblowing, and the target's fate. Alternates: Heat Treatment (tempering; the oil then fire), Final Firing (the kiln's last bake).
- **Weapon attack → Shipping Damage:** arrived broken, and so will they. The shop talk also fits cheap, unlimited ammo. Alternates: Clearance Sale (clearing them out), Factory Seconds (flawed glass sold cheap).

## User

Give me a list of options

## Assistant

Here are two-word, punny glass-shop names about what happens to the target.

**Spell attack (imbued orbs, 3 per cast, allies can throw them)**
- Blown Away: glassblowing, and they're gone
- Heat Treatment: tempering glass, and what the oil does next
- Final Firing: the last bake in the kiln
- Parting Gift: handed to allies, or given to the target
- Hand Delivered: allies throw your crafted orbs
- Limited Edition: only three orbs per cast
- Custom Order: made to measure for one target
- Signature Piece: your mark on them
- Fragile Arrival: they land, and so do the shards
- Gift Wrapped: oil coating, with a bow of fire

**Weapon attack (plain chistera orbs, no limit, can make a puddle)**
- Shipping Damage: arrived broken
- Clearance Sale: everything must go, including them
- Factory Seconds: flawed glass sold cheap, and they get seconds
- Bulk Discount: no limit on ammo
- Return Policy: the jai-alai throw comes back around
- Breakage Fee: the victim covers it
- Store Credit: small damage that adds up
- Pane Relief: the relief is Siris's, not theirs
- Special Delivery: slung from 120 ft
- Floor Model: shatter one for the puddle

Tell me which pair you want and I'll swap them onto the cards.

## User

we're going in circles. lets start over

## Assistant



## Assistant

_[tool: ask_user]_

Understood. Before I redo anything, I need two answers: what you want to start over (the orb names, all play names, or the whole design) and how we should get there. The form is up.

## User

Answered — Asked for follow-up questions; scope: Just the two orb play names

## Assistant



## Assistant

_[tool: ask_user]_

I'm starting the two orb names over. This round asks why the last batch missed, what each name has to do, and which one idea it should be built around. Once you answer, I'll send a short list to pick from rather than more rounds of options.

## User

Answered — why_miss: Not dark enough; must_convey: What it does; hook: Shards / shrapnel; near_miss: Anything that was a real phrase that was uncannily related (with a dark/crass twist)... like Welcome Mat (for a different spell); own_ideas: Not exact words but concetps. It's a ranged attack. If it were an oil filled barrel i would name it MOAB (mother of all barrels -- which is actually a nod to the actual MOAB --mother of all bombs)

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I renamed both orb plays using real phrases with a dark twist.

- **Glass Houses** (spell attack, Magic Stone): from "people in glass houses shouldn't throw stones." A glassblower throwing enchanted stones.
- **Stained Glass** (weapon attack, chistera shrapnel): they end up stained, with oil and blood.

If you want to swap either one, here are alternates in the same vein:
- **Glassy Eyed:** the thousand-yard stare, but dead.
- **Window Shopping:** picking off targets from 120 ft.
- **Shard Luck:** hard luck, with shrapnel.
- **Housewarming Gift:** oil first, then fire.
- **Pane in the Ass:** the crass option.

## User

So dark as in macabre... here's an example of the direction we're trying to go. One of my favorite scenes in all of Star Wars cinematography is Darth Vader going savage on the rebel soldiers at the end of Rogue One, or absolutely demolishing bystanders when Darth Vader is searching for Obi Wan in a dark alley on Tatooine. Another one is when MacDuff (in a rendition of MacBeth I saw) viciously/relentlessly hacks at MacBeth's head at the end of the play, overcome with passion and rage.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Got it: dark means brutal and relentless, not punchlines. I renamed both orb plays in that direction:

- **Headstones** (spell attack, Magic Stone): enchanted stones aimed at the head, and what gets set over the grave afterward.
- **Thousand Cuts** (weapon attack, chistera shrapnel): from "death by a thousand cuts." Endless ammo, shard after shard, until they drop.

Alternates if either misses:
- **Spell attack:** The Stoning, Grave Stones, Death Sentence
- **Weapon attack:** Laceration, Glass Storm, Flesh and Glass, Red Glass

## User

It's missing the essense that Party Favors and Welcome Mat had...

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

What Welcome Mat and Party Favors share: a harmless, friendly phrase that turns out to describe exactly what the play does, and the menace comes from how polite it sounds. I renamed both orb plays that way:

- **Hot Stones** (spell attack, Magic Stone): the spa treatment. Stones, then heat.
- **A Toast** (weapon attack, chistera): glassware raised in someone's honor. It shatters, then they burn, and "you're toast."

Same idea, if you'd rather swap:
- **Spell attack:** Worry Stones, Parting Gifts, Stepping Stones
- **Weapon attack:** Sea Glass, Wind Chimes, Housewarming, Window Treatment

