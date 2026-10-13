export const profile = {
  name: "HE CHENGHAO",
  handle: "ho2006",
  role: "Independent Developer",
  education: "Undergraduate at Shandong University",
  github: "https://github.com/ho2006",
  email: "btc.ho2006@gmail.com",
  avatar: "https://avatars.githubusercontent.com/u/195607975?v=4",
  intro:
    "I turn curiosity into useful software, drawing inspiration from code and everyday life. My projects explore AI conversations, desktop tools, and data research.",
  // Add verified honors only: { year, title, issuer, description, url }.
  honors: [],
};

// Summaries follow public READMEs and retain the status of unfinished research.
export const projectDetails = {
  IncentiveScope: {
    category: "Data Research",
    title: "IncentiveScope",
    subtitle: "On-chain incentives and user participation",
    description:
      "Research into user participation after trading incentives end, using public on-chain events, SQL analysis, and PyTorch backtests. Includes reproducible reports and an interactive dashboard.",
    tags: ["Python", "PyTorch", "SQL"],
    demo: "https://ho2006.github.io/IncentiveScope/",
    art: "research",
    featured: true,
  },
  "clash-pet": {
    category: "Desktop Tools",
    title: "Clash Pet",
    subtitle: "A little company for your desktop",
    description:
      "Mica is a lightweight Windows pixel pet for Clash Verge, with live proxy status and redacted AI agent diagnostics.",
    tags: ["C#", "Windows", "MIT"],
    art: "pet",
    featured: true,
  },
  "zxf-ai-chat": {
    category: "Web Apps",
    title: "Zhang Xuefeng AI Chat",
    subtitle: "Exploring conversational experiences",
    description:
      "A TypeScript chat website featuring an AI persona of Zhang Xuefeng, exploring natural conversational interfaces.",
    tags: ["TypeScript", "AI", "Web"],
    art: "chat",
    featured: true,
  },
  "sdu-accessible-study": {
    category: "Desktop Tools",
    title: "SDU Accessible Study",
    description:
      "An accessible Windows companion for the Shandong University lab safety learning portal, with timed course navigation.",
    tags: ["JavaScript", "Windows", "Accessibility"],
    art: "study",
  },
  "TradeGraph-Lab": {
    category: "Data Research",
    title: "TradeGraph Lab",
    description:
      "Temporal network research on international trade. Public data, validation, and graph analysis pipelines are in place; predictive findings have not been published.",
    tags: ["Python", "NetworkX", "Parquet"],
    art: "research",
  },
  StableFlow: {
    category: "Data Research",
    title: "StableFlow",
    description:
      "Ethereum stablecoin flow accounting and PyTorch forecasting. Currently an engineering preview using test data; real-world flow research remains unvalidated.",
    tags: ["DuckDB", "PyTorch", "Ethereum"],
    art: "research",
  },
  "im2610-bot-public": {
    category: "Data Research",
    title: "IM2610 Simulation Bot",
    description:
      "A simulated trading bot built with Python, SQLite, and a web console. Includes passive market making, risk controls, and Docker deployment.",
    tags: ["Python", "SQLite", "Docker"],
    art: "research",
  },
  "weapp-F-B": {
    category: "Web Apps",
    title: "weapp-F-B",
    tags: ["TypeScript"],
    art: "chat",
  },
  "worldcup-analysis-web": {
    category: "Web Apps",
    title: "Worldcup Analysis Web",
    tags: ["HTML"],
    art: "research",
  },
  kaggle_workshop: {
    category: "Data Research",
    title: "Kaggle Workshop",
    tags: ["Python"],
    art: "research",
  },
};
