export type CommunityItemType = 'video' | 'article' | 'website' | 'podcast' | 'tool';

export interface CommunityItem {
  title: string;
  description: string;
  url: string;
  type: CommunityItemType;
  author?: string;
  authorUrl?: string;
  date?: string; // ISO date string e.g. "2026-04-28"
}

export const communityItems: CommunityItem[] = [
  {
    title: "The Slop Isn't Coming From the Robot",
    description: "Chris Lema makes the case that AI slop isn't a robot problem — it's a human one. The machine doesn't decide to be hollow. The person prompting it does.",
    url: "https://chrislema.com/slop-isnt-coming-from-the-robot",
    type: "article",
    author: "Chris Lema",
    authorUrl: "https://chrislema.com",
    date: "2026-04-28",
  },
  {
    title: "This Coding Tool Kills AI Code Slop",
    description: "A deep-dive video on how a specific coding tool actively fights back against the low-quality, hallucinated garbage that AI assistants ship by default. Practical and direct.",
    url: "https://youtu.be/XLtuSy1opW4",
    type: "video",
    date: "2026-04-28",
  },
];
