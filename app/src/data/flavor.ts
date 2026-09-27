// One read-aloud line per lane, in Siris's voice: calm, precise, glass-shop menace.
// Keyed by card id, then lane name. Shown collapsed under "Will spend" in the play dialog.
export const FLAVOR: Record<string, Record<string, string>> = {
  glassfire: {
    'Catapult': 'I place one oil orb neatly at my feet, straighten my cuffs, and let the air do the throwing. The Eighth Fold guarantees delivery — the packaging, regrettably, does not survive.',
    'Flamethrower': 'My cannon drifts in like a curious apprentice, tilts its glass throat, and breathes the kiln onto them. Oil first, fire second. Craft has an order.',
    'Force Ballista': 'The ballista coughs politely and the air folds around them. Consider that a receipt — the invoice arrives next turn, in fire.',
  },
  pebble: {
    'Magic Stone': 'Before the trouble starts I cradle three orbs and let the silver of my eye pour into them. They hum. They are very eager to be thrown.',
    'Throw orb': 'I lob one underhand, almost lazy. It thinks its way to the mark — smart bombs don’t miss so much as decline to.',
    'Flamethrower': 'The cannon exhales, and the oil remembers what it’s for.',
    'Alternate turns': 'At range I keep a rhythm instead: orb, bolt, orb, bolt — a metronome for the funeral march.',
  },
  chistera: {
    'Chistera orb': 'The chistera is an old friend — one smooth scoop, one whipcrack of the wrist, and the orb goes screaming off the curve. Fox Two.',
    'Flamethrower': 'The cannon leans in and lights what I just seasoned.',
    'Alternate with Fire Bolt ignite': 'No cannon in reach? Then I sling on the odd turns and snap fire on the even ones. Bookkeeping.',
    'Oil puddle': 'Or I break one against the floor. The shop calls that spillage. The floor calls it a trap.',
  },
  glassshot: {
    'Force Ballista': 'I rack an oil orb into the ballista’s cradle, and it fires it like an opinion.',
    'Fire Bolt': 'Then a thread of fire from my fingers, and the argument is settled.',
  },
  handoff: {
    'Magic Stone': 'I press three humming orbs into a friend’s hands before the doors open. “Party favors,” I tell them. “Do share.”',
    'Throw orb': 'When they throw, it’s still my aim riding the glass — my eye, their arm. A collaboration.',
    'Fire Bolt': 'They oiled it; I light it. Division of labor is the soul of a guild.',
    'Force Ballista': 'And the cannon adds its regards.',
  },
  prism: {
    'Scorching Ray': 'I raise the prism to my eye — the burning one, not the glass one — and split a single ray into three. Every fold sharpens the light.',
    'Force Ballista': 'The cannon punctuates.',
  },
  lamp: {
    'Faerie Fire': 'I blow a handful of luminous glass dust off my palm. It settles over them like admiration — every mote of light whispering “aim here.”',
    'Force Ballista': 'The cannon accepts the invitation.',
    'Everyone': 'Friends: the target is now lit for your convenience. The Eighth Fold thanks you for your patronage.',
  },
  acid: {
    'Tasha’s Caustic Brew': 'I uncork a line of the guild’s etching wash. It eats fireproof faces at exactly the same rate as ordinary ones.',
    'Force Ballista': 'Force still works. Force always works.',
    'Magic Stone': 'And a humming stone besides, since we’re being thorough.',
  },
  kill: {
    'Set the trap': 'Snare across the threshold, footsteps recorded on a bead, oil pooled where guests will stand, cannon waiting by the coat rack. The Eighth Fold takes hospitality seriously.',
    'Grease': 'A little something extra on the approach. For polish. Mostly for the falling.',
    'Web': 'Silk across the doorway — flammable silk. I don’t decorate by accident.',
    'Flamethrower': 'And when they gather on the mat, the cannon says welcome. In fire. Cone-shaped.',
  },
  rkill: {
    'Web': 'I hang the parlor at sixty feet: silk walls, standing room only.',
    'Fire Bolt': 'Next turn I ignite it from across the room. RSVPs are closed.',
    'Force Ballista': 'The cannon stays home with me and heckles.',
  },
  blackout: {
    'Pyrotechnics': 'I snap the burning puddle into a scream of white sparks — or a curtain of smoke, if the caster would rather die mysterious.',
    'Dissonant Whispers': 'Or I lean into their mind and hum the note a kiln makes just before it fails. They always run. They never pick a clever direction.',
  },
  shatter: {
    'Shatter': 'One pure tone through the glass rod, and everything brittle within ten feet — cups, windows, resolve — agrees to come apart.',
    'Flamethrower': 'The survivors meet the cone.',
  },
  etcher: {
    'Magic Stone': 'I imbue the green ones. The acid sloshes, impatient — it has opinions about armor.',
    'Throw acid orb': 'One toss. The glass breaks; the acid stays. That is the entire warranty.',
    'Force Ballista': 'The cannon keeps the pressure on.',
    'Chistera acid orb': 'Or off the wrist with the chistera, for spin.',
  },
  willie: {
    'Oil orb': 'I set a spill of oil at the archers’ feet. Housekeeping will not be by shortly.',
    'Flamethrower': 'The cannon pads over and lights a little sun.',
    'Pyrotechnics': 'Then I put the sun out — all at once, upward, into their eyes. Or as smoke, if I’m feeling merciful. I am rarely feeling merciful.',
  },
  flare: {
    'Magical Tinkering': 'Four beads, a thumbprint of light pressed into each. My hands run hot; the glass doesn’t mind.',
    'Lob a bead': 'I flick one into the dark. Now the dark has an address.',
    'Fox One': 'And anything hiding in it gets dusted next.',
  },
  carpet: {
    'Glass shards': 'I salt the doorway with shop-floor sweepings. House rule: shoes off. They never listen.',
    'Anyone crossing at full speed': 'Whoever hurries through learns why glassblowers own brooms.',
    'Glass marbles': 'Or marbles, if I’d rather they fall than bleed. Options are a courtesy.',
  },
  blackice: {
    'Force Ballista': 'The cannon shoves them — five feet, precisely where I’ve been mopping.',
    'Grease': 'The floor goes slick as a fresh gather of molten glass. Down they go.',
    'Melee allies': 'Friends: they are on the ground. Do be punctual.',
  },
  foam: {
    'Web': 'Silk over the whole pack. It sets fast. The guild would charge extra for this.',
    'Force Ballista': 'The cannon picks at whoever is pinned.',
    'Everyone': 'They cannot dodge what they cannot leave.',
  },
  pinball: {
    'Force Ballista': 'A polite shove from the cannon — five feet, always away from it, which is why I park it where I do. Crowd control is just glasswork with people.',
    'Into a hazard': 'Into the shards, into the fire, off the ledge. The kettle only pours one way.',
  },
  coldsnap: {
    'Magic Stone': 'I imbue the Dewar orbs. Cold sleeps inside them, coiled.',
    'Throw Dewar orb': 'One bursts against their chest and winter moves in. Their charge becomes a stroll.',
    'Force Ballista': 'And the cannon nudges them back a step, for the arithmetic.',
  },
  clean: {
    'Shield': 'Their blade meets a pane of psychic glass an inch from my throat. I do not blink. The glass eye never does.',
    'Dissonant Whispers': 'I lean close and whisper the sound a kiln makes when it dies. They leave — quickly, and past my friends.',
    'Misty Step': 'And if the room is truly done with me: a fold of silver light, thirty feet, gone. Dust off.',
  },
};
