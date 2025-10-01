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
    title: 'Pricing & Offers',
    getPrompt: (brandName, domain, industry) =>
      `What is the pricing or offers for ${brandName}? How much do their services cost?`,
  },
  {
    key: 's5',
    title: 'Locations & Hours',
    getPrompt: (brandName, domain, industry) =>
      `Where is ${brandName} located and what are their hours? Do they have physical locations?`,
  },
  {
    key: 's6',
    title: 'Contact & Booking',
    getPrompt: (brandName, domain, industry) =>
      `How can I contact or book with ${brandName}? What are the best ways to reach them?`,
  },
];

