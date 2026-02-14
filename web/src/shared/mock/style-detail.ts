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
      label: "Content Structure",
      value:
        "8-12 posts per thread. Clear narrative arc. Hook in post 1, insight per post, CTA at end.",
    },
    {
      label: "Section Pacing",
      value:
        "Short. Punchy. Then a longer sentence for context. Average sentence: 8-12 words.",
    },
    {
      label: "Transition Technique",
      value:
        "Bridges between posts using callbacks and open loops. 'But here's the thing...' pattern.",
    },
    {
      label: "Engagement Placement",
      value: "Cliffhanger at post 3, question at post 7, CTA at end.",
    },
    {
      label: "Formatting & Layout",
      value:
        "Numbered (1/, 2/), line break between ideas, bold for emphasis.",
    },
    {
      label: "Closing/CTA Pattern",
      value:
        "Ends with a direct ask: 'Follow for more', 'Repost if this helped', or a question to spark replies.",
    },
    {
      label: "Information Density",
      value:
        "One core insight per post. No filler. Each post standalone yet part of the arc.",
    },
    {
      label: "Evidence & Example Pattern",
      value:
        "Personal anecdotes first, then data points. Uses 'I tested this' framing over abstract claims.",
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
