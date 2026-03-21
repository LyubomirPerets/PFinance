export interface Interest {
  id: string;
  label: string;
  description: string;
  icon: string;
  suggestions: string[];
}

export const PERSONAL_FINANCE_INTERESTS: Interest[] = [
  {
    id: "budgeting",
    label: "Budgeting",
    description: "Learn to create and stick to a budget",
    icon: "📊",
    suggestions: [
      "What is the 50/30/20 rule?",
      "How do I start my first budget?",
      "What are the most common budgeting mistakes?",
    ],
  },
  {
    id: "saving",
    label: "Saving Strategies",
    description: "Emergency funds, high-yield accounts, and saving goals",
    icon: "🏦",
    suggestions: [
      "How much should I have in an emergency fund?",
      "What is a high-yield savings account?",
      "How do I save money when my income is tight?",
    ],
  },
  {
    id: "investing",
    label: "Investing Basics",
    description: "Stocks, bonds, ETFs, and building a portfolio",
    icon: "📈",
    suggestions: [
      "What's the difference between stocks and ETFs?",
      "How do I start investing with little money?",
      "What does diversification mean?",
    ],
  },
  {
    id: "retirement",
    label: "Retirement Planning",
    description: "401(k), IRA, Roth accounts, and long-term planning",
    icon: "🏖️",
    suggestions: [
      "What's the difference between a 401(k) and an IRA?",
      "How much should I save for retirement?",
      "What is a Roth conversion?",
    ],
  },
  {
    id: "debt",
    label: "Debt Management",
    description: "Strategies for paying off debt and avoiding traps",
    icon: "💳",
    suggestions: [
      "What is the debt snowball method?",
      "Should I pay off debt or invest first?",
      "How do I get out of credit card debt?",
    ],
  },
  {
    id: "credit",
    label: "Credit Scores",
    description: "Understanding and improving your credit score",
    icon: "⭐",
    suggestions: [
      "What factors affect my credit score?",
      "How can I improve my credit score fast?",
      "What's a good credit score?",
    ],
  },
  {
    id: "taxes",
    label: "Tax Planning",
    description: "Deductions, credits, and smart tax strategies",
    icon: "🧾",
    suggestions: [
      "What's the difference between a tax deduction and a tax credit?",
      "How can I reduce my tax bill legally?",
      "What is a W-4 and how do I fill it out?",
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    description: "Health, auto, life, and property insurance basics",
    icon: "🛡️",
    suggestions: [
      "How much life insurance do I actually need?",
      "What's the difference between HMO and PPO health plans?",
      "What does an emergency fund have to do with insurance?",
    ],
  },
  {
    id: "real-estate",
    label: "Real Estate",
    description: "Buying, renting, mortgages, and property investment",
    icon: "🏠",
    suggestions: [
      "Is it better to rent or buy a home?",
      "How does a mortgage work?",
      "What is PMI and how do I avoid it?",
    ],
  },
  {
    id: "side-income",
    label: "Side Income",
    description: "Freelancing, passive income, and side hustles",
    icon: "💡",
    suggestions: [
      "What are the best low-effort passive income ideas?",
      "How do taxes work for freelance income?",
      "How do I price my freelance services?",
    ],
  },
  {
    id: "financial-literacy",
    label: "Financial Literacy",
    description: "Core concepts every adult should know",
    icon: "📚",
    suggestions: [
      "What is compound interest and why does it matter?",
      "What is net worth and how do I calculate mine?",
      "What financial milestones should I hit in my 20s?",
    ],
  },
  {
    id: "crypto",
    label: "Cryptocurrency",
    description: "Bitcoin, blockchain, and digital assets",
    icon: "🪙",
    suggestions: [
      "How does blockchain technology work?",
      "What's the difference between Bitcoin and Ethereum?",
      "How much of my portfolio should be in crypto?",
    ],
  },
];
