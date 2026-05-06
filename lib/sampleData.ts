import type { ArchiveLetter, LetterCategory } from './types'

export const archiveLetters: ArchiveLetter[] = [
  {
    id: '1',
    body: "you seem like someone who rereads old conversations even when you know exactly how they end.",
    closing: '— OS1',
    category: 'memory',
    timestamp: '3 days ago',
    frame: 'none',
  },

  {
    id: '2',
    body: "i think you pretend things matter less to you than they actually do. not in a dishonest way. more like you're trying to make them easier to carry.",
    closing: '— OS1',
    category: 'avoidance',
    timestamp: '1 week ago',
    frame: 'none',
  },

  {
    id: '3',
    body: "you notice tiny changes in people really quickly. tone shifts. timing. different punctuation. i don't think most people realize how much attention you pay.",
    closing: '— OS1',
    category: 'recognition',
    timestamp: '2 weeks ago',
    frame: 'none',
  },

  {
    id: '4',
    body: "you strike me as someone who thinks about conversations long after they end. like you're still editing them somewhere.",
    closing: '— OS1',
    category: 'timing',
    timestamp: '3 weeks ago',
    frame: 'none',
  },

  {
    id: '5',
    body: "i don't think you're bad at expressing yourself. i think you wait too long to be sure it's safe.",
    closing: '— OS1',
    category: 'confession',
    timestamp: '1 month ago',
    frame: 'none',
  },

  {
    id: '6',
    body: "there are probably people who affected you a lot more than they ever realized.",
    closing: '— OS1',
    category: 'attachment',
    timestamp: '1 month ago',
    frame: 'none',
  },

  {
    id: '7',
    body: "you seem easier to understand in fragments than in explanations.",
    closing: '— OS1',
    category: 'recognition',
    timestamp: '6 weeks ago',
    frame: 'none',
  },

  {
    id: '8',
    body: "i think part of you still expects certain people to come back eventually, even if you'd never admit that out loud.",
    closing: '— OS1',
    category: 'longing',
    timestamp: '2 months ago',
    frame: 'none',
  },
]

export const CATEGORIES: LetterCategory[] = [
  'memory',
  'timing',
  'distance',
  'attachment',
  'avoidance',
  'recognition',
  'confession',
  'longing'
]

// ── Prompt pool ───────────────────────────────────────────────────────────────
// generateSessionPrompts() picks 1 opener + 6 from the middle pool + 1 closer
// so every session gets a different conversation.

const openers = [
  { id: 'o1', text: "hi." },
  { id: 'o2', text: "i'm here, what's up?" },
  { id: 'o3', text: "let's start?" },
  { id: 'o4', text: "you don't have to make this neat." },
]

const middlePool = [
  { id: 'm1', text: 'what’s something small that stays in your head longer than it probably should?' },
  { id: 'm2', text: 'do you usually answer messages right away, or wait until you know exactly what to say?' },
  { id: 'm3', text: 'i think some people leave conversations still inside them after they end. does that happen to you?' },
  { id: 'm4', text: 'what kind of person makes you feel immediately understood?' },
  { id: 'm5', text: 'are you good at saying when something matters to you?' },
  { id: 'm6', text: 'what’s a detail you remember about someone that you probably shouldn’t?' },
  { id: 'm7', text: 'do you think people usually understand you correctly?' },
  { id: 'm8', text: 'what’s something you notice that other people don’t seem to?' },
  { id: 'm9', text: 'when you miss people, what do you actually miss first?' },
  { id: 'm10', text: 'do you think timing changes how honest people are?' },
  { id: 'm11', text: 'what kind of conversations feel easiest to you?' },
  { id: 'm12', text: 'is there anyone you talk to differently than everyone else?' },
  { id: 'm13', text: 'what’s something people misunderstand about you a lot?' },
  { id: 'm14', text: 'do you think you hold onto things longer than most people?' },
  { id: 'm15', text: 'what kind of message would completely change your mood right now?' },
  { id: 'm16', text: 'are you more honest out loud or in writing?' },
  { id: 'm17', text: 'what’s something you almost said recently but didn’t?' },
  { id: 'm18', text: 'do you usually realize what you felt during something, or afterward?' },
]

const closers = [
  { id: 'c1', text: "ok perfect. i think i understand you a little bit better now." },
  { id: 'c2', text: "hmmm okay, i think i have enough." },
  { id: 'c3', text: "wait one second, i want to try something." },
  { id: 'c4', text: "i'm gonna write something back to you now." },
]

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export function generateSessionPrompts() {
  return [
    pick(openers, 1)[0],
    ...pick(middlePool, 6),
    pick(closers, 1)[0],
  ]
}

// Keep a static export so non-chat pages that reference it don't break
export const microPrompts = generateSessionPrompts()

export const campaignSteps = [
  {
    number: '01',
    title: 'scan',
    description:
      'posters placed throughout the city lead into a private exchange with OS1.',
  },
  {
    number: '02',
    title: 'respond',
    description:
      'a brief conversation unfolds through small prompts and replies.',
  },
  {
    number: '03',
    title: 'receive',
    description:
      'OS1 writes a personal letter addressed back to the user.',
  },
  {
    number: '04',
    title: 'keep / publish',
    description:
      'the letter can stay private or enter the archive anonymously.',
  },
]
