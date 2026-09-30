// Editable comic manuscript. Each image sheet contains four scenes in reading order.
// Speech attributed to a Yip or Nerp must contain only their one word and punctuation.
import { descriptions } from './descriptions.js';
export const chapters = [
  { id: 'flummoxprap', title: 'Life on Flummoxprap', kicker: 'A perfectly peculiar planet', panels: [
    { scene: 'Wide establishing view of a purple and yellow planet against deep purple space; gray boulder settlements on its rolling surface.', caption: 'On a purple and yellow planet called Flummoxprap lived creatures unknown to the rest of the galaxy.', layout: 'wide' },
    { scene: 'Cheerful hooded Yips in the purple and yellow town square sing together, faces with huge toothy grins, long drooping noses and fully shadowed eyes. Music notes may be abstract shapes only.', caption: 'They were called Yips. They were musical. They were peaceful. They were very easy to quote.', speech: [['Yip', 'Yip!'], ['Yip', 'Yip!'], ['Yip', 'Yip!']] },
    { scene: 'Low close-up of the bare toes beneath long robes, rapidly shuffling along a yellow path with purple speed marks.', caption: 'They got around by shuffling their bare toes. Inch by inch. Surprisingly quickly.', sfx: 'shuffle shuffle' },
    { scene: 'A smiling Yip lifts the edge of a plain gray boulder house on a purple hill, revealing a yellow cozy entrance underneath.', caption: 'Home was under a rock. A perfectly good rock.' },
    { scene: 'Dramatic long perspective of a wildly curving yellow street rising and falling over purple hills among ordinary gray rock houses.', caption: 'The streets went up, down, around—and then around some more.', layout: 'wide' },
    { scene: 'Busy gray boulder shops and cinema with decorative yellow and purple blank banners, Yips shuffling between entrances.', caption: 'The shops were rocks. The movie theaters were rocks. The entertainment facilities? Also rocks.', labels: ['SHOPS', 'CINEMA'] },
    { scene: 'Close-up still life at a yellow cafe table: clear cup of rich purple drink, a yellow patty on a purple plate, toothy Yip in background.', caption: 'They drank purple ploofidonk and ate yellow brog. Brog was shaped suspiciously like a patty.', labels: ['PLOOFIDONK', 'BROG'] },
    { scene: 'Two smiling hooded Yips have a very animated conversation on a purple and yellow street, sleeves gesturing, eyes completely hidden.', caption: 'Conversation was simple. “Yip” was the only word they knew.', speech: [['Yip', 'Yip?'], ['Yip', 'Yip!']] }
  ]},
  { id: 'visitors', title: 'Some very polite visitors', kicker: 'Conquest, with excellent manners', panels: [
    { scene: 'A huge lime-green blimp-shaped spaceship casts a shadow across the purple and yellow gray-rock town. Yips look up.', caption: 'Then, one day, the Gorfs arrived.', layout: 'wide' },
    { scene: 'Large translucent green gelatinous Gorf leader exits lime blimp, bubbles and distorted scenery visible through acid body, goo protrusion holds tiny orange water-pistol weapon.', caption: 'Gorfs were great green blobs of gooey acid. Their little orange weapons looked a lot like water pistols.' },
    { scene: 'Intimidating but comically courteous Gorf bends toward one smiling Yip in a purple yellow street.', caption: 'The Gorf leader spoke in a low, scary British voice. His manners were impeccable.', speech: [['Gorf', 'Could you take me to your leader?'], ['Yip', 'Yip!']] },
    { scene: 'Yip guide brings Gorf leader to the largest gray boulder in town; royal Yip appears under it, smiling with hidden eyes.', caption: 'The Yip shuffled toward the biggest Yip rock of all.', speech: [['Gorf', 'Good day, sir? Ma’am? Um… Royal Yip.']] },
    { scene: 'Gorf leader bows elaborately before the toothy royal Yip beneath gigantic gray rock, orange weapon held politely behind goo back.', speech: [['Gorf', 'Is there any way you would allow us to take over your planet?']] },
    { scene: 'Close-up translucent Gorf leader very politely explaining, purple yellow town visible distorted through goo; royal Yip cheerful at edge.', speech: [['Gorf', 'I really don’t want to be a bother. I just need to destroy anything and everything on Flummoxprap.'], ['Yip', 'Yip.']] },
    { scene: 'Gorf leader holds tiny orange pistol politely toward an untroubled smiling Yip outside a gray rock home. No firing, no injury.', caption: 'That was all the Yip leader knew how to say. So the Gorf leader went around town.', speech: [['Gorf', 'May I destroy you?'], ['Yip', 'Yip.']] },
    { scene: 'Another ordinary Yip cheerfully answers Gorf leader in front of a gray boulder shop. Two further smiling Yips queue behind. No harm shown.', speech: [['Gorf', 'May I destroy you?'], ['Yip', 'Yip!']], caption: 'The answer was always the same. Until…' }
  ]},
  { id: 'nerps', title: 'Five little disagreements', kicker: 'One new word changes everything', panels: [
    { scene: 'Exactly five recognizable Yips A B C D E face a huge translucent Gorf with orange pistol on purple yellow street, smiles beginning to fade.', speech: [['Gorf', 'May I destroy you?']], layout: 'wide' },
    { scene: 'Close-up tall plum pointed-hood A with yellow seam concentrates, eyes hidden, long nose, formerly smiling mouth now a small downturned line. Other four visible behind.', caption: 'Five Yips learned a new word.', speech: [['Nerp', 'Nerp.']] },
    { scene: 'Exactly five escapees A B C D E stand in a firm row, all have small straight downturned mouths, sleeves folded, gloomy faces beneath eye shadows.', speech: [['Nerp', 'Nerp.'], ['Nerp', 'Nerp.'], ['Nerp', 'Nerp.'], ['Nerp', 'Nerp.'], ['Nerp', 'Nerp.']], caption: 'Each of the five said it. And so they were forever known as the Nerps.', layout: 'wide' },
    { scene: 'Silent close comparison: ordinary toothy smiling Yip on left, short mustard Nerp B on right with nearly straight downturned mouth, dark eye shadows on both.', caption: 'Much the same robes. Much the same noses. Considerably less cheer.' },
    { scene: 'Exactly five small gloomy Nerps A B C D E shuffle into a comically enormous plain gray rock spaceship, purple yellow ground.', caption: 'The five Nerps boarded their own ship. It was, of course, a comically large rock.', layout: 'wide' },
    { scene: 'Close-up purple and yellow spaceship control console full of small blank yellow buttons surrounding a huge red central button with blank sticker.', caption: 'Among all the buttons marked “Yip” was one large red button.', labels: ['Yip', 'Yip', 'Yip', 'Away'] },
    { scene: 'A plum-robed sleeve presses the huge red central button in the yellow purple control console, other four Nerps stand behind.', caption: 'Its sticker read “Away.” One Nerp pressed it.', sfx: 'CLICK' },
    { scene: 'Giant gray rock spaceship blasts away from purple-yellow planet into deep purple space, the planet recedes. No Gorf violence visible.', caption: 'And away they went.', layout: 'wide' }
  ]},
  { id: 'plan', title: 'A three-part plan', kicker: 'Nothing could possibly go Nerp', panels: [
    { scene: 'Exactly five Nerps A B C D E in gray-rock spaceship gaze through window at purple yellow home fading into space, long quiet moody composition.', caption: 'Their journey was long and silent, punctuated only by their new, grumbled word.', speech: [['Nerp', 'Nerp.']], layout: 'wide' },
    { scene: 'Blue Earth grows large through rock ship window; five Nerps huddle gloomily over a planning table with three empty circular markers.', caption: 'Earth drew closer, and so did the hope of a new home. The Nerps were gloomy, but smart: they suspected they would not be welcome. They devised a plan. Three things.' },
    { scene: 'A robed sleeve opens a small drawer inside rock ship, revealing a large button with blank label.', caption: 'One: the button hidden in a drawer.', labels: ['Invisibility'] },
    { scene: 'Uninflated inflatable sumo costume spread across spaceship floor with clear schematic of five little hooded figures, one in each limb and one centered at head. No text.', caption: 'Two: an inflatable sumo wrestler costume. One Nerp per limb, and one in the middle as the head.' },
    { scene: 'Nerp C with two yellow cuff stripes opens an empty weapon storage recess inside ship, an empty outline mounting bracket shaped for a science fiction laser gun, disappointed posture.', caption: 'Three: the mighty LASER GUN! …Which they had not packed.', sfx: '…' },
    { scene: 'Tiny harmless brightly colored foam dart toy gun rests in a robed sleeve, one soft foam dart visible, five Nerps solemnly admire it.', caption: 'They had to settle for a Nerf foam-dart gun. Since they could only say “Nerp,” that was what they called it.', speech: [['Nerp', 'Nerp.']] },
    { scene: 'Five distinct Nerps prepare three objects on spaceship floor: invisibility button in drawer, oversized folded sumo costume, small toy foam dart gun. Earth in window.', caption: 'One invisible rock. One lumpy disguise. One “Nerp.” Time to execute the plan.' },
    { scene: 'Large gray rock spaceship becomes a faint dashed ghost outline over planet Earth as a robed sleeve presses invisibility control in small inset, no text.', caption: 'They pressed the button. No one but the Nerps could see their abnormally large rock.', layout: 'wide' }
  ]},
  { id: 'japan', title: 'An entirely ordinary arrival', kicker: 'Five aliens. One very bad disguise.', panels: [
    { scene: 'Full-color Japanese city street establishing shot, convenience store with blank white striped green orange red sign, roof visible, dusk still bright, no caricatures.', caption: 'Their invisible rock came to rest on the roof of a 7-Eleven in Japan.', labels: ['7-ELEVEN'], layout: 'wide' },
    { scene: 'Roof of same Japanese convenience store, invisible giant rock indicated by delicate ghost contour, exactly five Nerps A B C D E stand beside it with folded sumo costume.', caption: 'Phase one: complete. Phase two was going to be a tight fit.' },
    { scene: 'Five distinct Nerps on convenience-store roof pull open an enormous inflatable sumo costume. It resembles a silly empty balloon suit with mawashi, not a real person.', caption: 'They unfolded the costume.' },
    { scene: 'Comical close-up empty inflated sumo suit on roof, four Nerps awkwardly squeezing into each limb, fifth waiting at center, robes and toes poking from openings.', speech: [['Nerp', 'Nerp!'], ['Nerp', 'Nerp!!']], caption: 'One Nerp per limb…' },
    { scene: 'Last pointed-hood plum Nerp A wedges into center opening as four others already fill limbs of lumpy sumo costume. Exactly one exterior head before closure.', caption: '…and one in the middle as the head. After plenty of painful “Nerps,” all five fit.', speech: [['Nerp', 'Nerp!!!']] },
    { scene: 'Lumpy inflated sumo costume waddles awkwardly down Japanese street, arms and feet at comically incompatible angles, no visible aliens.', caption: 'They waddled into the city. Their walking was not even remotely human.', sfx: 'wobble', layout: 'wide' },
    { scene: 'Ordinary Japanese pedestrians give puzzled sideways glances to the hilariously lumpy sumo balloon costume shuffling past storefronts. Neutral respectful faces.', caption: 'There were looks. Quite a few looks.' },
    { scene: 'Inflated costume waits at ordinary elevator doors in a Japanese building, small toy gun pokes from costume, upward and downward elevator arrows.', caption: 'Phase three: shoot anyone who discovered their true identity. There was one small problem: their “Nerp” gun could only mildly annoy someone.' }
  ]},
  { id: 'elevator', title: 'A crushing victory. Apparently.', kicker: 'The great elevator incident', panels: [
    { scene: 'Sumo costume alone inside elevator, sleeve pressing up and down buttons, joyful motion marks contrast absurd face.', caption: 'They rode the elevator up and down. Just for fun.' },
    { scene: 'Very elderly Japanese man with glasses and walking cane enters elevator with absurd inflatable costume. Warm ordinary interior; he looks calm.', caption: 'An elderly man joined them. Even with his glasses, he could barely see more than a large sumo wrestler.' },
    { scene: 'Plum pointed hood A Nerp head with long nose and hidden eyes pops out of neck seam of inflated sumo costume inside elevator; elderly passenger facing forward.', caption: 'Then a head popped out.', speech: [['Nerp', 'Nerp!']], layout: 'wide' },
    { scene: 'Small bright foam dart flies from tiny toy gun in costume sleeve and lightly touches elderly man’s jacket; man unharmed, puzzled. No injury.', sfx: 'piff.', caption: 'A direct hit. A very soft direct hit.' },
    { scene: 'Silent close-up elderly man adjusting glasses looking down at one foam dart on his jacket, entirely unharmed and mildly confused. Nerp head peers from costume behind.', caption: 'The man was confused. The Nerps were proud. Then the Nerps were confused: he was still standing.' },
    { scene: 'Wide elevator interior with inflated costume repeatedly shooting harmless foam darts at man’s coat; several soft darts on floor, man looks mildly annoyed and perfectly fine.', caption: 'So they shot him again. And again. And again.', sfx: 'piff. piff. piff.', layout: 'wide' },
    { scene: 'Elevator doors open at floor; elderly man calmly walks out with cane, foam darts on elevator floor. Costume remains inside.', caption: 'Eventually, the man got out.', sfx: 'DING' },
    { scene: 'Nerp head emerging triumphantly from lumpy sumo costume stares at empty elevator doorway, small toy gun raised, no elderly man remaining.', caption: 'Maybe he was intimidated? Probably it was just his floor. The Nerps considered the operation a success.', speech: [['Nerp', 'Nerp.']] }
  ]},
  { id: 'house', title: 'Home, gloomy home', kicker: 'Please observe the sign', panels: [
    { scene: 'Inflatable sumo costume leaves building into sunset Japanese street, long shadows, weary waddle.', caption: 'It was getting late. They still had nowhere to stay.' },
    { scene: 'Quiet eerie Japanese side street at dusk, small bridge crosses scene, faded navy blue house tucked beneath, costume notices it at edge.', caption: 'Then they saw it. On a quiet street where few people went. Beneath a small bridge.', layout: 'wide' },
    { scene: 'Front view tiny abandoned faded navy blue house under bridge, chipped rusted white metal fence, large hazy window and dead lawn patch, crooked blank white warning sign.', caption: 'A faded navy-blue house. A white fence, rusty and chipped. A little patch of dead grass. Perfect.' },
    { scene: 'Close-up very crooked white warning sign on rusty chipped white fence, blank center for HTML lettering, robed sleeve emerging from costume reaches toward it.', labels: ['DO NOT TRESPASS'], caption: 'And an extremely promising sign.' },
    { scene: 'Same fence sign now perfectly straight, five gloomy Nerps A B C D E have stepped out of deflated sumo costume; two sleeves finish leveling sign. No text in art.', labels: ['DO NOT TRESPASS'], caption: 'They straightened it. A home should have standards.' },
    { scene: 'Large hazy front window of navy house, five Nerp silhouettes reflected outside, sofa only just discernible very close behind glass, dead grass at bottom.', caption: 'From outside, you could only see things close to the window. From inside, you could see everything.' },
    { scene: 'View over exactly five Nerp backs entering small doorway into impossibly huge empty house interior with deep perspective. Dim blue twilight, tall ceiling.', caption: 'Inside, the house was HUGE. At least five times bigger than it looked from the street.', layout: 'wide' },
    { scene: 'Wide interior floorplan perspective: big sofa immediately against front window on left, deep huge room, dark doorway in back-right corner. Exactly five Nerps gaze toward doorway.', caption: 'One big sofa stood right by the window. In the back-right corner, a dark doorway led into an enormous back room.' }
  ]},
  { id: 'machine', title: 'A most unfortunate business plan', kicker: 'Ten seconds of work. Then, the wait.', panels: [
    { scene: 'Exactly five gloomy Nerps A B C D E huddle in cavernous dim blue back room, bent together conspiratorially, bare toes ring inward.', caption: 'The Nerps had the best idea. They huddled together for a minute.', speech: [['Nerp', 'Nerp.'], ['Nerp', 'Nerp?'], ['Nerp', 'Nerp.']] },
    { scene: 'Exactly five Nerps rapidly build mysterious conveyor machine in dim room with tool shapes held by covered sleeves, comical motion streaks, no humans.', caption: 'Then they got to work. About ten seconds later, their masterpiece was finished.', sfx: 'clank clank' },
    { scene: 'Dramatic wide view finished sinister absurd machine: huge empty human-size hopper at left, conveyor extends across cavernous room to small table at right. Five Nerps dwarfed beside it.', caption: 'A bin big enough for a whole human. A conveyor belt across the room. A table at the end.', layout: 'wide' },
    { scene: 'Close-up harmless bright foam-dart toy gun held in plum robe sleeve in dim blue light, soft darts visible, long shadows of five Nerps behind. No victim, no harm.', caption: 'Their plan was to shoot anyone who trespassed until that person could no longer stand—or breathe. The weapon was still the same harmless foam-dart gun.' },
    { scene: 'Ominous view down into completely empty metal hopper and conveyor vanishing into dark machine housing, five Nerp silhouettes inspect rim. No people inside, no body parts.', caption: 'Then, in their plan, the trespasser would go into the machine. And somehow…' },
    { scene: 'Small open brown cardboard box on output table, containing exactly one bright toy foam-dart gun and exactly three soft darts, conveyor behind. No human remnants.', caption: '…out would come a small brown cardboard box, containing one Nerp gun and three Nerp darts.' },
    { scene: 'Exactly five recognizable Nerps A B C D E shuffle from dark back-right doorway across huge room toward large sofa close to front window; empty machine behind.', caption: 'With their work complete, the five Nerps returned to the front room.' },
    { scene: 'Final wide view from outside hazy front window at night, exactly five Nerps A B C D E sit side by side on large sofa directly by window, small downturned mouths, eyes fully black shadows. Quiet eerie navy house and straight fence sign framing. No visitor, no victim.', caption: 'And so they sat on the sofa, which easily held all five Nerps, and waited for their first victim.', layout: 'wide', final: true }
  ]}
];

let index = 0;
for (const chapter of chapters) {
  chapter.panels.forEach(panel => {
    panel.number = ++index;
    panel.alt = descriptions[index - 1];
    panel.id = `panel-${index}`;
    panel.sheet = Math.floor((index - 1) / 4) + 1;
    panel.cell = (index - 1) % 4;
  });
}
export const panels = chapters.flatMap(chapter => chapter.panels);
