export interface Interest {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const PERSONAL_FINANCE_INTERESTS: Interest[] = [
  {
    id: "budgeting",
    label: "Budgeting",
    description: "Learn to create and stick to a budget",
    icon: "📊",
  },
  {
    id: "saving",
    label: "Saving Strategies",
    description: "Emergency funds, high-yield accounts, and saving goals",
    icon: "🏦",
  },
  {
    id: "investing",
    label: "Investing Basics",
    description: "Stocks, bonds, ETFs, and building a portfolio",
    icon: "📈",
  },
  {
    id: "retirement",
    label: "Retirement Planning",
    description: "401(k), IRA, Roth accounts, and long-term planning",
    icon: "🏖️",
  },
  {
    id: "debt",
    label: "Debt Management",
    description: "Strategies for paying off debt and avoiding traps",
    icon: "💳",
  },
  {
    id: "credit",
    label: "Credit Scores",
    description: "Understanding and improving your credit score",
    icon: "⭐",
  },
  {
    id: "taxes",
    label: "Tax Planning",
    description: "Deductions, credits, and smart tax strategies",
    icon: "🧾",
  },
  {
    id: "insurance",
    label: "Insurance",
    description: "Health, auto, life, and property insurance basics",
    icon: "🛡️",
  },
  {
    id: "real-estate",
    label: "Real Estate",
    description: "Buying, renting, mortgages, and property investment",
    icon: "🏠",
  },
  {
    id: "side-income",
    label: "Side Income",
    description: "Freelancing, passive income, and side hustles",
    icon: "💡",
  },
  {
    id: "financial-literacy",
    label: "Financial Literacy",
    description: "Core concepts every adult should know",
    icon: "📚",
  },
  {
    id: "crypto",
    label: "Cryptocurrency",
    description: "Bitcoin, blockchain, and digital assets",
    icon: "🪙",
  },
];
