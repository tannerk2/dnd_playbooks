export interface SpellInfo { meta: string[]; lines: [label: string, dice: string, text: string][] }

/** Hover/tap pop-up text for the Spells panel, with Siris's DC and attack filled in. */
export const spellInfo = (dc: number, atk: string): Record<string, SpellInfo> => ({
  'Fire Bolt': { meta: ['Action', '120 ft', 'Cantrip'], lines: [['Roll', '', 'Ranged spell attack ' + atk], ['Hit', '1d10', 'fire ≈ 5.5'], ['Also', '', 'Ignites unattended flammable objects. Triggers oil +5']] },
  'Magic Stone': { meta: ['Bonus action', 'Touch', '1 min', 'Cantrip'], lines: [['Setup', '', 'Imbue up to 3 pebbles (glass orbs: DM? 1)'], ['Roll', '', 'Thrown 60 ft · ranged spell attack ' + atk + ' (allies use yours too)'], ['Hit', '1d6 + 4', 'bludgeoning ≈ 7.5'], ['Also', '', 'Recasting ends any stones still imbued']] },
  'Catapult': { meta: ['Action', '60 ft', '1st slot', 'Somatic only'], lines: [['Setup', '', 'Object 1–5 lb, not worn or carried: drop the orb at your feet first'], ['Save', '', 'Creature in its 90-ft path: Dex DC ' + dc], ['Fail', '3d8', 'bludgeoning ≈ 13.5 · object shatters (oils target: DM? 4)'], ['Pass', '', 'No damage; object keeps flying']] },
  'Faerie Fire': { meta: ['Action', '60 ft', '20-ft cube', '1st slot', '◎ Conc 1 min'], lines: [['Save', '', 'Each creature in the cube: Dex DC ' + dc], ['Fail', '', 'Outlined in light · attacks against it have advantage · can’t benefit from invisibility'], ['Also', '', 'Party, Fire Bolt and Force Ballista all roll with advantage']] },
  'Tasha’s Caustic Brew': { meta: ['Action', '30-ft line, 5 ft wide', '1st slot', '◎ Conc 1 min'], lines: [['Save', '', 'Each creature in the line: Dex DC ' + dc], ['Fail', '2d4', 'acid ≈ 5 at the start of each of its turns'], ['Ends', '', 'It or an adjacent creature uses an action to scrape it off']] },
  'Grease': { meta: ['Action', '60 ft', '10-ft square', '1st slot', '1 min'], lines: [['Effect', '', 'Area becomes difficult terrain'], ['Save', '', 'Dex DC ' + dc + ' when it appears, or when a creature enters or ends its turn there'], ['Fail', '', 'Falls prone'], ['Flavor', '', 'Grease Gun (Movement)']] },
  'Snare': { meta: ['1 minute to cast', 'Touch', '1st slot', '8 hours'], lines: [['Setup', '', '5-ft-radius loop, nearly invisible (Investigation DC ' + dc + ' to spot)'], ['Save', '', 'Creature entering: Dex DC ' + dc], ['Fail', '', 'Hoisted 3 ft upside down, restrained · repeats the save at end of each of its turns']] },
  'Shield': { meta: ['Reaction', 'Self', '1st slot'], lines: [['Trigger', '', 'You’re hit by an attack or targeted by magic missile'], ['Effect', '+5 AC', 'until the start of your next turn, including against the triggering attack']] },
  'Misty Step': { meta: ['Bonus action', 'Self', 'Free 1/LR'], lines: [['Effect', '', 'Teleport up to 30 ft to an unoccupied space you can see'], ['Cost', '', 'Uses your bonus action: no cannon shot this turn']] },
  'Dissonant Whispers': { meta: ['Action', '60 ft', 'Free 1/LR', 'Verbal only'], lines: [['Save', '', 'One creature: Wis DC ' + dc + ' (deafened creatures succeed)'], ['Fail', '3d6', 'psychic ≈ 10.5 · uses its reaction to move away as far as it can, provoking opportunity attacks'], ['Pass', '', 'Half damage, no movement']] },
  'Web': { meta: ['Action', '60 ft', '20-ft cube', '2nd slot', '◎ Conc 1 hr'], lines: [['Effect', '', 'Difficult terrain, lightly obscured'], ['Save', '', 'Dex DC ' + dc + ' when it appears or when a creature enters or starts its turn there'], ['Fail', '', 'Restrained · escape: action, Str check vs DC ' + dc], ['Anchor', '', 'Must be anchored between two solid masses or laid across a surface, or it collapses'], ['Fire', '2d4', 'fire · burns a 5-ft cube in 1 round, to anyone starting its turn in the fire']] },
  'Pyrotechnics': { meta: ['Action', '60 ft', '2nd slot'], lines: [['Target', '', 'A nonmagical flame (≤ 5-ft cube), which is extinguished'], ['Fireworks', '', 'Each creature within 10 ft: Con DC ' + dc + ' or blinded until end of your next turn'], ['Smoke', '', '20-ft radius heavily obscured, 1 min or until strong wind']] },
  'Continual Flame': { meta: ['Action', 'Touch', '2nd slot', '50 gp ruby dust'], lines: [['Effect', '', 'Torch-bright flame, no heat, lasts until dispelled'], ['Cost', '', 'Ruby dust is consumed']] },
  'Acid Splash': { meta: ['Action', '60 ft', 'Cantrip', 'Not known'], lines: [['Target', '', 'One creature, or two within 5 ft of each other'], ['Save', '', 'Dex DC ' + dc], ['Fail', '1d6', 'acid (2d6 at L5)']] },
  'Ray of Frost': { meta: ['Action', '60 ft', 'Cantrip', 'Not known'], lines: [['Roll', '', 'Ranged spell attack ' + atk], ['Hit', '1d8', 'cold (2d8 at L5) · −10 ft speed until your next turn']] },
  'Frostbite': { meta: ['Action', '60 ft', 'Cantrip', 'Not known'], lines: [['Save', '', 'Con DC ' + dc], ['Fail', '1d6', 'cold (2d6 at L5) · disadvantage on its next weapon attack before the end of its next turn']] },
});

export type SpellTier = 0 | 1 | 2 | 3 | 'swap';
/** Spell groups: title, tier, [name, concentration?][]. Tier 3 = Fey Touched. */
export const SPELLS: [title: string, tier: SpellTier, items: [string, boolean?][]][] = [
  ['Cantrips', 0, [['Fire Bolt'], ['Magic Stone']]],
  ['Cantrip swaps', 'swap', [['Acid Splash'], ['Ray of Frost'], ['Frostbite']]],
  ['1st level', 1, [['Catapult'], ['Faerie Fire', true], ['Tasha’s Caustic Brew', true], ['Grease'], ['Snare'], ['Shield']]],
  ['Fey Touched', 3, [['Misty Step'], ['Dissonant Whispers']]],
  ['2nd level', 2, [['Web', true], ['Shatter'], ['Scorching Ray'], ['Pyrotechnics'], ['Continual Flame'], ['Heat Metal', true]]],
];
