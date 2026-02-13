export const mockStyleDetail = {
  id: "sty_01",
  name: "Sarah's Tech Voice",
  sourceUrl: "https://x.com/sarah/status/1234567890",
  sourceType: "url" as const,
  createdAt: new Date(Date.now() - 30 * 86400000),
  usageCount: 47,
  attributes: [
    {
      label: "Hook Pattern",
      value:
        "Personal story + bold contrarian claim: 'I did X. Here's what nobody tells you.'",
    },
    {
      label: "Tone",
      value:
        "Casual authority — conversational but confident. Uses 'you' frequently. Avoids jargon.",
    },
    {
      label: "Rhythm",
      value:
        "Short. Punchy. Then a longer sentence for context. Average sentence: 8-12 words.",
    },
    {
      label: "Structure",
      value:
        "8-12 posts per thread. Clear narrative arc. Hook in post 1, insight per post, CTA at end.",
    },
    {
      label: "Emoji Usage",
      value: "Strategic: one per post opening, never mid-sentence.",
    },
    {
      label: "Engagement Techniques",
      value: "Cliffhanger at post 3, question at post 7, CTA at end.",
    },
    {
      label: "Formatting",
      value:
        "Numbered (1/, 2/), line break between ideas, bold for emphasis.",
    },
    {
      label: "Vocabulary Level",
      value: "Simple words, no jargon, daily life analogies.",
    },
    {
      label: "Perspective",
      value: "First person storytelling with direct reader address.",
    },
    {
      label: "Platform Conventions",
      value: "'/' numbering, ends with 'Follow for more'.",
    },
  ],
  pipelines: [
    {
      name: "My Weekly Thread Pipeline",
      lastRunAt: new Date(Date.now() - 7200000),
    },
    {
      name: "Blog to Social",
      lastRunAt: new Date(Date.now() - 259200000),
    },
  ],
};
