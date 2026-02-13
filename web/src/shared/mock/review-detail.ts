export const mockReviewDetail = {
  id: "rev_01",
  pipelineName: "Weekly YouTube Breakdown",
  stepName: "Multi-Format Transform",
  formatType: "thread" as const,
  status: "pending" as const,
  runId: "run_01",
  stepId: "s4",
  source: {
    type: "topic" as const,
    content:
      "Why most developers waste time on premature optimization and what to do instead",
  },
  styleProfile: {
    name: "Sarah's Tech Voice",
    tone: "Casual authority",
    hookPattern: "Personal story + bold claim",
    rhythm: "Short. Punchy. Then longer.",
  },
  previousStepOutput:
    "Full script: Why most developers waste time on premature optimization...\n\nIntroduction: We've all been there. You're building a new feature...\n\n[2,400 words about premature optimization, structured in 5 sections]",
  generatedContent: {
    thread: [
      {
        id: "p1",
        text: "I wasted 3 months optimizing code that didn't need it.\n\nHere's what nobody tells you about premature optimization",
      },
      {
        id: "p2",
        text: "1/ Most developers optimize for the wrong thing.\n\nThey chase milliseconds in code that runs once a day.\nMeanwhile, their users wait 5 seconds for a page to load.",
      },
      {
        id: "p3",
        text: "2/ The real bottleneck is almost never where you think.\n\nI spent weeks making a database query 10x faster.\nTurns out, the API call after it was taking 100x longer.",
      },
      {
        id: "p4",
        text: '3/ Here\'s my rule now:\n\n-> Build it\n-> Ship it\n-> Measure it\n-> THEN optimize the actual bottleneck\n\nNot the imaginary one.',
      },
      {
        id: "p5",
        text: "4/ The best optimization is often deleting code.\n\nThat fancy caching layer? Remove it.\nThat pre-computed lookup table? You don't need it yet.",
      },
      {
        id: "p6",
        text: '5/ "Premature optimization is the root of all evil" - Donald Knuth\n\nBut the full quote is even better:\n\n"We should forget about small efficiencies, say about 97% of the time."',
      },
      {
        id: "p7",
        text: "6/ What I do instead:\n\nWrite clear, readable code first\nSet up monitoring & metrics\nWait for actual data\nOptimize the top 3% that matters\nRepeat",
      },
      {
        id: "p8",
        text: '7/ Your future self will thank you.\n\nReadable code is 10x easier to optimize than "clever" code.\n\nAnd most "clever" code never needed to exist.',
      },
      {
        id: "p9",
        text: "TL;DR:\n\n-> Don't optimize before measuring\n-> Most code doesn't need optimization\n-> Readable > Fast (usually)\n-> The real bottleneck surprises you\n\nFollow for more developer lessons learned the hard way.",
      },
    ],
  },
};
