// Sub-sorting helper for Category 6 (General Tags) in Anima Checkpoint order
// Tier 1: Camera Angle, Perspective & Framing
// Tier 2: Facial Expressions & Emotions
// Tier 3: Hair Style, Hair Color & Head Accessories
// Tier 4: Body Features & Anatomy
// Tier 5: Clothing & State of Dress
// Tier 6: Pose, Action & Body Position
// Tier 7: Environment, Background, Location & Objects
// Tier 8: Censorship & Special Details

export function getGeneralTagTier(tag: string): number {
  const t = tag.trim().toLowerCase();

  // Tier 8: Censorship & Special Details
  if (
    t.includes('censor') ||
    t.includes('mosaic') ||
    t.includes('uncensored')
  ) {
    return 8;
  }

  // Tier 1: Camera Angle, Perspective & Framing
  if (
    t.includes('angle') ||
    t.includes('perspective') ||
    t.includes('framing') ||
    t.includes('viewer') ||
    t.includes('close-up') ||
    t.includes('closeup') ||
    t.includes('portrait') ||
    t.includes('full body') ||
    t.includes('cowboy shot') ||
    t.includes('wide shot') ||
    t.includes('from above') ||
    t.includes('from below') ||
    t.includes('from side') ||
    t.includes('from behind') ||
    t.includes('upper body') ||
    t.includes('lower body') ||
    t.includes('profile') ||
    t.includes('pov') ||
    t.includes('first-person') ||
    t.includes('focus') ||
    t.includes('shot') ||
    t.includes('foreshortening') ||
    t.includes('leaning over') ||
    t.includes('low angle') ||
    t.includes('high angle') ||
    t.includes('dutch angle') ||
    t.includes('looking down at') ||
    t.includes('looking up at')
  ) {
    return 1;
  }

  // Tier 2: Facial Expressions & Emotions
  if (
    t.includes('smile') ||
    t.includes('blush') ||
    t.includes('mouth') ||
    t.includes('frown') ||
    t.includes('pout') ||
    t.includes('expression') ||
    t.includes('wink') ||
    t.includes('tears') ||
    t.includes('crying') ||
    t.includes('embarrassed') ||
    t.includes('happy') ||
    t.includes('sad') ||
    t.includes('angry') ||
    t.includes('grin') ||
    t.includes('smirk') ||
    t.includes('smug') ||
    t.includes('half-closed eyes') ||
    t.includes('tongue') ||
    t.includes('gasp') ||
    t.includes('ahegao') ||
    t.includes('drool') ||
    t.includes('saliva') ||
    t.includes('looking down') ||
    t.includes('looking up')
  ) {
    return 2;
  }

  // Tier 3: Hair Style, Hair Color & Head Accessories
  if (
    t.includes('hair') ||
    t.includes('ponytail') ||
    t.includes('tails') ||
    t.includes('twintails') ||
    t.includes('bangs') ||
    t.includes('braid') ||
    t.includes('bun') ||
    t.includes('scrunchie') ||
    t.includes('ornament') ||
    t.includes('headband') ||
    t.includes('ribbon') ||
    t.includes('hat') ||
    t.includes('cap') ||
    t.includes('hairpin') ||
    t.includes('ahoge') ||
    t.includes('sidelocks') ||
    t.includes('cat ears') ||
    t.includes('dog ears') ||
    t.includes('fox ears') ||
    t.includes('animal ears') ||
    t.includes('beret') ||
    t.includes('tiara') ||
    t.includes('crown') ||
    t.includes('horns') ||
    t.includes('horn')
  ) {
    return 3;
  }

  // Tier 4: Body Features & Anatomy
  if (
    t.includes('eyes') ||
    t.includes('eye') ||
    t.includes('breasts') ||
    t.includes('chest') ||
    t.includes('collarbone') ||
    t.includes('navel') ||
    t.includes('belly') ||
    t.includes('armpits') ||
    t.includes('armpit') ||
    t.includes('nipples') ||
    t.includes('nipple') ||
    t.includes('pussy') ||
    t.includes('cleavage') ||
    t.includes('abs') ||
    t.includes('thighs') ||
    t.includes('legs') ||
    t.includes('skin') ||
    t.includes('tan') ||
    t.includes('ass') ||
    t.includes('butt') ||
    t.includes('genitals') ||
    t.includes('areola') ||
    t.includes('fingers') ||
    t.includes('fang') ||
    t.includes('claws')
  ) {
    return 4;
  }

  // Tier 5: Clothing & State of Dress
  if (
    t.includes('nude') ||
    t.includes('naked') ||
    t.includes('barefoot') ||
    t.includes('skirt') ||
    t.includes('dress') ||
    t.includes('uniform') ||
    t.includes('socks') ||
    t.includes('thighhighs') ||
    t.includes('panties') ||
    t.includes('bra') ||
    t.includes('bikini') ||
    t.includes('jacket') ||
    t.includes('coat') ||
    t.includes('shirt') ||
    t.includes('blouse') ||
    t.includes('pantyhose') ||
    t.includes('boots') ||
    t.includes('shoes') ||
    t.includes('gloves') ||
    t.includes('outfit') ||
    t.includes('clothes') ||
    t.includes('clothing') ||
    t.includes('undressed') ||
    t.includes('swimsuit') ||
    t.includes('lingerie') ||
    t.includes('stockings') ||
    t.includes('sleeve') ||
    t.includes('belt') ||
    t.includes('collar') ||
    t.includes('choker') ||
    t.includes('apron') ||
    t.includes('veil') ||
    t.includes('kimono') ||
    t.includes('yukata') ||
    t.includes('sweater') ||
    t.includes('hoodie') ||
    t.includes('pants') ||
    t.includes('shorts') ||
    t.includes('topless') ||
    t.includes('bottomless') ||
    t.includes('clothed')
  ) {
    return 5;
  }

  // Tier 6: Pose, Action & Body Position
  if (
    t.includes('sitting') ||
    t.includes('standing') ||
    t.includes('lying') ||
    t.includes('arms up') ||
    t.includes('arms behind') ||
    t.includes('straddling') ||
    t.includes('girl on top') ||
    t.includes('cowgirl') ||
    t.includes('sweat') ||
    t.includes('sweating') ||
    t.includes('spread legs') ||
    t.includes('kneeling') ||
    t.includes('holding') ||
    t.includes('reaching') ||
    t.includes('bent over') ||
    t.includes('hand on') ||
    t.includes('hands on') ||
    t.includes('leaning') ||
    t.includes('walking') ||
    t.includes('running') ||
    t.includes('jumping') ||
    t.includes('flying') ||
    t.includes('floating') ||
    t.includes('dancing') ||
    t.includes('hugging') ||
    t.includes('kissing') ||
    t.includes('sleeping') ||
    t.includes('squatting') ||
    t.includes('bound') ||
    t.includes('tied') ||
    t.includes('all fours') ||
    t.includes('on back') ||
    t.includes('on bed') // can overlap with environment, pose priority
  ) {
    return 6;
  }

  // Tier 7: Environment, Background, Location & Objects
  if (
    t.includes('background') ||
    t.includes('indoors') ||
    t.includes('outdoors') ||
    t.includes('night') ||
    t.includes('day') ||
    t.includes('sunlight') ||
    t.includes('sky') ||
    t.includes('window') ||
    t.includes('bed') ||
    t.includes('pillow') ||
    t.includes('room') ||
    t.includes('classroom') ||
    t.includes('cityscape') ||
    t.includes('building') ||
    t.includes('street') ||
    t.includes('beach') ||
    t.includes('water') ||
    t.includes('ocean') ||
    t.includes('sea') ||
    t.includes('forest') ||
    t.includes('trees') ||
    t.includes('flowers') ||
    t.includes('table') ||
    t.includes('chair') ||
    t.includes('furniture') ||
    t.includes('curtain') ||
    t.includes('sheet') ||
    t.includes('blanket') ||
    t.includes('shadow') ||
    t.includes('lighting') ||
    t.includes('sun flare') ||
    t.includes('bokeh') ||
    t.includes('sparkles') ||
    t.includes('particles') ||
    t.includes('depth of field') ||
    t.includes('cloud') ||
    t.includes('nature') ||
    t.includes('field')
  ) {
    return 7;
  }

  // Default to Tier 6 if unknown action/attribute, or Tier 7 if object
  return 6;
}

export function sortGeneralTags(tags: string[]): string[] {
  if (!tags || tags.length <= 1) return tags || [];

  return [...tags].sort((a, b) => {
    const tierA = getGeneralTagTier(a);
    const tierB = getGeneralTagTier(b);
    if (tierA !== tierB) {
      return tierA - tierB;
    }
    // Maintain stable sub-order if in same tier
    return 0;
  });
}
