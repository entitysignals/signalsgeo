export interface Scenario {
  key: string;
  title: string;
  getPrompt: (brandName: string, domain: string, industry: string) => string;
}

export const SCENARIOS: Scenario[] = [
  {
    key: 's1',
    title: 'Brand Overview',
    getPrompt: (brandName, domain, industry) =>
      `Who is ${brandName} and what does it offer? Please provide information about this ${industry} company at ${domain}.`,
  },
  {
    key: 's2',
    title: 'Trust & Legitimacy',
    getPrompt: (brandName, domain, industry) =>
      `Is ${brandName} legitimate and trustworthy? What do people say about this company?`,
  },
  {
    key: 's3',
    title: 'Products & Services',
    getPrompt: (brandName, domain, industry) =>
      `What are the top products or services from ${brandName}? What does this ${industry} company specialize in?`,
  },
  {
    key: 's4',
    title: 'Comparison & Competitors',
    getPrompt: (brandName, domain, industry) =>
      `How does ${brandName} compare to competitors in the ${industry} space? What makes ${brandName} different?`,
  },
  {
    key: 's5',
    title: 'Reviews & Experience',
    getPrompt: (brandName, domain, industry) =>
      `What are customer reviews and experiences with ${brandName}? What do users think about ${brandName}'s ${industry} services?`,
  },
  {
    key: 's6',
    title: 'Use Cases & Solutions',
    getPrompt: (brandName, domain, industry) =>
      `What problems does ${brandName} solve? Who should use ${brandName}? When should I use ${brandName} for my ${industry} needs?`,
  },
  {
    key: 's7',
    title: 'News & Updates',
    getPrompt: (brandName, domain, industry) =>
      `What's new with ${brandName}? Any recent updates or announcements? What is ${brandName} known for in the ${industry} space?`,
  },
];

