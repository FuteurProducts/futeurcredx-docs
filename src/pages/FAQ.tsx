import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Star, Trophy, Users, MessageCircle, Clock, CheckCircle, BookOpen, TrendingUp, Shield, Zap, ArrowUp, ArrowDown, Eye, Calendar, Crown, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [readCount, setReadCount] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [showChatbox, setShowChatbox] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [visibleCount, setVisibleCount] = useState(50);
  const [questionVotes, setQuestionVotes] = useState<{[key: number]: {helpful: number, notHelpful: number, userVote: 'helpful' | 'not-helpful' | null}}>({});

  const categories = [
    { id: 'all', name: 'All Questions', icon: BookOpen, count: 1547 },
    { id: 'basics', name: 'Business Credit Basics', icon: Star, count: 287 },
    { id: 'building', name: 'Building Credit', icon: TrendingUp, count: 324 },
    { id: 'monitoring', name: 'Credit Monitoring', icon: Shield, count: 198 },
    { id: 'tradelines', name: 'Tradelines & Vendors', icon: Users, count: 245 },
    { id: 'scores', name: 'Credit Scores & Reports', icon: Trophy, count: 156 },
    { id: 'legal', name: 'Legal & Compliance', icon: CheckCircle, count: 89 },
    { id: 'financing', name: 'Business Financing', icon: Zap, count: 178 },
    { id: 'industry', name: 'Industry Specific', icon: MessageCircle, count: 70 }
  ];

  const faqs = [
    // High Priority - Most Asked Questions
    {
      id: 1,
      category: 'basics',
      question: "What's the difference between business credit and personal credit?",
      answer: "Business credit is tied to your EIN and business entity, while personal credit uses your SSN. Business credit doesn't appear on personal reports and can help you qualify for larger credit lines without personal guarantees. Business credit scores range from 0-100, while personal scores typically range from 300-850.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'Very High',
      votes: 1247,
      views: 15680,
      lastUpdated: '3 days ago'
    },
    {
      id: 2,
      category: 'basics',
      question: "Do I need to incorporate my business to build business credit?",
      answer: "Yes, you need a legal business entity (LLC, Corp, etc.) and an EIN to build legitimate business credit. Sole proprietorships typically can't establish separate business credit profiles. The business must be registered with the state and have a business bank account.",
      difficulty: 'Beginner',
      readTime: '1 min',
      popularity: 'Very High',
      votes: 892,
      views: 12340,
      lastUpdated: '5 days ago'
    },
    {
      id: 3,
      category: 'building',
      question: "How long does it take to build an 80+ business credit score?",
      answer: "With consistent reporting vendors and good payment history, you can typically achieve an 80+ score in 6-12 months. The key is using vendors that actually report to business credit bureaus. Payment history accounts for 35% of your score, so never miss payments.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Very High',
      votes: 1156,
      views: 18920,
      lastUpdated: '1 day ago'
    },
    {
      id: 4,
      category: 'tradelines',
      question: "Which vendors actually report to business credit bureaus?",
      answer: "Top reporters include Uline, Grainger, Quill, Office Depot, Dell, HP, Staples (business accounts), Shell/Fleet cards, and many Net 30 vendors. However, over 70% of businesses use vendors that don't report. Always verify before opening accounts.",
      difficulty: 'Advanced',
      readTime: '5 min',
      popularity: 'Very High',
      votes: 2341,
      views: 28750,
      lastUpdated: '2 days ago'
    },
    {
      id: 5,
      category: 'scores',
      question: "What's a good business credit score and how is it calculated?",
      answer: "80+ is excellent, 70-79 is good, 50-69 is fair, below 50 needs work. Calculation: Payment history (35%), Credit utilization (30%), Length of credit history (15%), Credit mix (10%), New credit inquiries (10%). Unlike personal credit, business scores max out at 100.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'Very High',
      votes: 987,
      views: 14560,
      lastUpdated: '7 days ago'
    },
    {
      id: 6,
      category: 'building',
      question: "What are PG-free tradelines and why are they important?",
      answer: "PG-free (Personal Guarantee-free) tradelines report to business credit bureaus without requiring personal guarantees. They're crucial for separating business and personal liability while building credit. Examples include certain utility companies, office suppliers, and fuel cards.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'High',
      votes: 756,
      views: 9870,
      lastUpdated: '12 days ago'
    },
    {
      id: 7,
      category: 'monitoring',
      question: "How often should I check my business credit reports?",
      answer: "Monthly monitoring is recommended. Check Experian, Equifax, and Dun & Bradstreet reports regularly. Set up alerts for changes and dispute errors immediately. Business credit reports can change more frequently than personal reports due to trade reference updates.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 543,
      views: 7890,
      lastUpdated: '18 days ago'
    },
    {
      id: 8,
      category: 'legal',
      question: "Can business credit help me avoid personal guarantees?",
      answer: "Yes! Strong business credit (80+ scores across bureaus) significantly increases your chances of qualifying for financing without personal guarantees. Lenders want to see 2+ years of credit history, strong payment patterns, and established trade references.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 834,
      views: 11200,
      lastUpdated: '25 days ago'
    },
    {
      id: 9,
      category: 'building',
      question: "What's the biggest mistake people make when building business credit?",
      answer: "Using vendors that don't report to credit bureaus. 70% of businesses waste time with non-reporting vendors. Other major mistakes: mixing personal and business expenses, not paying on time, not monitoring reports, and applying for too much credit at once.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'Very High',
      votes: 1456,
      views: 19840,
      lastUpdated: '8 days ago'
    },
    {
      id: 10,
      category: 'tradelines',
      question: "How many tradelines do I need for a strong business credit profile?",
      answer: "Minimum 5-7 reporting tradelines across different industries. Having 10-15 diverse, well-managed tradelines typically results in optimal scores. Mix of revolving credit, installment loans, and trade accounts works best.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 712,
      views: 8950,
      lastUpdated: '14 days ago'
    },

    // Medium Priority Questions
    {
      id: 11,
      category: 'basics',
      question: "Can I use my SSN instead of EIN for business credit?",
      answer: "No, legitimate business credit requires an EIN (Employer Identification Number). Using your SSN creates a sole proprietorship profile that appears on your personal credit report. Get an EIN free from the IRS website - never pay third parties for this.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 445,
      views: 6780,
      lastUpdated: '21 days ago'
    },
    {
      id: 12,
      category: 'financing',
      question: "What credit score do I need for business loans?",
      answer: "Requirements vary: SBA loans typically want 680+ personal score, business credit cards may accept 650+, alternative lenders might go as low as 500. Strong business credit (80+) can compensate for lower personal scores and increase approval odds.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'Very High',
      votes: 923,
      views: 13450,
      lastUpdated: '4 days ago'
    },
    {
      id: 13,
      category: 'building',
      question: "Should I pay business credit cards in full or carry a balance?",
      answer: "Pay in full whenever possible. Unlike personal credit where 1-9% utilization is optimal, business credit rewards consistent full payments. However, showing some activity (10-30% utilization) can be better than zero usage. Never carry high balances.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 667,
      views: 9120,
      lastUpdated: '29 days ago'
    },
    {
      id: 14,
      category: 'monitoring',
      question: "Why don't I see my business credit score on free sites?",
      answer: "Business credit scores aren't typically free like personal scores. You need to pay business credit bureaus directly or use paid monitoring services. Be wary of 'free' business credit sites - they often have hidden fees or limited information.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 789,
      views: 10560,
      lastUpdated: '35 days ago'
    },
    {
      id: 15,
      category: 'tradelines',
      question: "Do business credit cards report to business credit bureaus?",
      answer: "Some do, some don't. Capital One Spark, Chase Ink, and American Express business cards typically report positive payment history but not balances. Credit unions and smaller banks may not report at all. Always ask before applying.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 612,
      views: 8340,
      lastUpdated: '16 days ago'
    },
    {
      id: 16,
      category: 'legal',
      question: "Can creditors go after my personal assets if I have business credit?",
      answer: "If you didn't sign a personal guarantee and your business is properly structured (LLC/Corp), creditors typically can't pursue personal assets. However, piercing the corporate veil can happen if you mix personal/business finances or don't maintain proper business formalities.",
      difficulty: 'Advanced',
      readTime: '5 min',
      popularity: 'High',
      votes: 856,
      views: 11890,
      lastUpdated: '42 days ago'
    },
    {
      id: 17,
      category: 'basics',
      question: "What's the difference between D&B, Experian, and Equifax for business?",
      answer: "Dun & Bradstreet (DUNS number required) focuses on commercial data and risk assessment. Experian Business emphasizes payment trends and industry comparisons. Equifax Business tracks credit and collections. Each uses different scoring models - you need all three for complete coverage.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'High',
      votes: 734,
      views: 9670,
      lastUpdated: '11 days ago'
    },
    {
      id: 18,
      category: 'financing',
      question: "Can I get approved for business credit with bad personal credit?",
      answer: "Yes, but options are limited initially. Start with secured business credit cards, vendor accounts that don't check personal credit, and business credit builders. As your business credit improves, you'll have more options that don't rely on personal credit scores.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'Very High',
      votes: 1134,
      views: 16780,
      lastUpdated: '6 days ago'
    },
    {
      id: 19,
      category: 'building',
      question: "How do I dispute errors on my business credit report?",
      answer: "Contact each bureau directly: D&B, Experian Business, and Equifax Business have separate dispute processes. Provide documentation supporting your claim. Common errors include wrong payment dates, incorrect balances, or accounts that aren't yours. Follow up in writing.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'Medium',
      votes: 423,
      views: 6890,
      lastUpdated: '38 days ago'
    },
    {
      id: 20,
      category: 'tradelines',
      question: "What's the difference between net 30, net 60, and net 90 accounts?",
      answer: "These refer to payment terms - Net 30 means payment is due in 30 days. Net 30 accounts are ideal for building credit because they report monthly. Net 60/90 report less frequently. Start with Net 30 vendors like Uline, Grainger, and Quill for faster credit building.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'Medium',
      votes: 567,
      views: 7450,
      lastUpdated: '52 days ago'
    },

    // Additional Questions (21-50 for space, representing the full 1500+)
    {
      id: 21,
      category: 'industry',
      question: "Does my industry type affect business credit requirements?",
      answer: "Yes, high-risk industries (restaurants, construction, retail) face stricter requirements and higher interest rates. Low-risk industries (professional services, technology) typically get better terms. Some industries have specialized lenders who understand their unique needs better.",
      difficulty: 'Advanced',
      readTime: '4 min',
      popularity: 'Medium',
      votes: 334,
      views: 5620,
      lastUpdated: '63 days ago'
    },
    {
      id: 22,
      category: 'financing',
      question: "What's the difference between business term loans and lines of credit?",
      answer: "Term loans provide a lump sum with fixed payments over a set period. Lines of credit work like business credit cards - you only pay interest on what you use and can draw/repay repeatedly. Lines of credit are better for cash flow, term loans for major purchases.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 678,
      views: 8920,
      lastUpdated: '19 days ago'
    },
    {
      id: 23,
      category: 'building',
      question: "Can I build business credit for multiple businesses?",
      answer: "Yes, each business with its own EIN can build separate credit profiles. However, if you're a guarantor on multiple business loans, this can impact your debt-to-income ratio for future personal credit. Keep detailed records for each business entity.",
      difficulty: 'Advanced',
      readTime: '4 min',
      popularity: 'Medium',
      votes: 445,
      views: 6780,
      lastUpdated: '74 days ago'
    },
    {
      id: 24,
      category: 'scores',
      question: "Why did my business credit score drop when I didn't miss any payments?",
      answer: "Common reasons: increased credit utilization, new credit inquiries, changes in payment patterns (even if on time), industry risk adjustments, or data reporting changes from vendors. Business scores are more volatile than personal scores due to these factors.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 712,
      views: 9450,
      lastUpdated: '9 days ago'
    },
    {
      id: 25,
      category: 'legal',
      question: "Do I need a business attorney to set up business credit?",
      answer: "Not required, but recommended for complex situations. An attorney can help with proper business structure, contracts, and ensuring you maintain corporate formalities that protect against personal liability. Many entrepreneurs successfully build business credit without legal help initially.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 389,
      views: 5670,
      lastUpdated: '85 days ago'
    },
    {
      id: 26,
      category: 'basics',
      question: "What is a DUNS number and do I need one?",
      answer: "A DUNS (Data Universal Numbering System) number is a unique nine-digit identifier for businesses used by Dun & Bradstreet. While not legally required, it's essential for building business credit with D&B and often required for government contracts and large corporate partnerships.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 623,
      views: 8450,
      lastUpdated: '27 days ago'
    },
    {
      id: 27,
      category: 'building',
      question: "How does business credit utilization affect my score?",
      answer: "Keep utilization below 30%, ideally under 10%. Unlike personal credit, business credit rewards consistent activity rather than zero balances. Using 1-10% of available credit and paying in full monthly shows active, responsible usage patterns that boost scores.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 789,
      views: 11230,
      lastUpdated: '13 days ago'
    },
    {
      id: 28,
      category: 'tradelines',
      question: "What's the difference between trade references and tradelines?",
      answer: "Trade references are vendors who can vouch for your payment history when contacted. Tradelines are actual credit accounts that automatically report to credit bureaus. You need both - references for new credit applications and tradelines for ongoing score building.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 456,
      views: 6890,
      lastUpdated: '46 days ago'
    },
    {
      id: 29,
      category: 'financing',
      question: "Can I get business credit with no revenue?",
      answer: "Yes, but options are limited. Start with secured business credit cards, certain vendor accounts that don't require revenue verification, and business credit builders. Focus on establishing trade references first, then transition to unsecured credit as revenue grows.",
      difficulty: 'Beginner',
      readTime: '3 min',
      popularity: 'High',
      votes: 834,
      views: 12560,
      lastUpdated: '31 days ago'
    },
    {
      id: 30,
      category: 'monitoring',
      question: "How long does negative information stay on business credit reports?",
      answer: "Most negative items remain for 7 years, similar to personal credit. However, some public records like bankruptcies can stay for 10 years. Tax liens remain until paid and released. Regular monitoring and prompt dispute of errors is crucial for maintaining clean reports.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 567,
      views: 7890,
      lastUpdated: '67 days ago'
    },
    {
      id: 31,
      category: 'basics',
      question: "What's the minimum credit score needed to start building business credit?",
      answer: "There's no minimum personal credit score required to start building business credit. However, having a score above 650 opens more options. Even with poor personal credit, you can begin with secured cards and vendor accounts that don't check personal credit.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 723,
      views: 9870,
      lastUpdated: '22 days ago'
    },
    {
      id: 32,
      category: 'building',
      question: "How often should I apply for new business credit?",
      answer: "Space applications 3-6 months apart to minimize hard inquiries' impact. Too many applications in a short period can lower your score and raise red flags with lenders. Focus on building strong relationships with existing creditors before seeking new ones.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 445,
      views: 6450,
      lastUpdated: '91 days ago'
    },
    {
      id: 33,
      category: 'tradelines',
      question: "Do fuel cards help build business credit?",
      answer: "Yes, many fuel cards report to business credit bureaus. Shell, ExxonMobil, and fleet cards from major companies typically report positive payment history. They're often easier to qualify for than traditional business credit cards and help establish payment patterns.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 612,
      views: 8230,
      lastUpdated: '39 days ago'
    },
    {
      id: 34,
      category: 'scores',
      question: "Why are my business credit scores different across bureaus?",
      answer: "Each bureau uses different scoring models and receives different data from creditors. Not all vendors report to all three bureaus. Experian focuses on payment trends, D&B on commercial risk, and Equifax on credit and collections. This creates score variations.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'High',
      votes: 678,
      views: 9120,
      lastUpdated: '15 days ago'
    },
    {
      id: 35,
      category: 'legal',
      question: "What's the difference between a personal guarantee and corporate guarantee?",
      answer: "A personal guarantee makes you individually liable for business debt using personal assets. A corporate guarantee uses business assets only. Personal guarantees are more common but riskier. Strong business credit can help you avoid personal guarantees over time.",
      difficulty: 'Advanced',
      readTime: '4 min',
      popularity: 'Medium',
      votes: 523,
      views: 7340,
      lastUpdated: '58 days ago'
    },
    {
      id: 36,
      category: 'financing',
      question: "What's the difference between secured and unsecured business credit?",
      answer: "Secured credit requires collateral (cash deposit, equipment, real estate) while unsecured credit relies on creditworthiness alone. Start with secured options to build credit history, then transition to unsecured as your business credit strengthens.",
      difficulty: 'Beginner',
      readTime: '3 min',
      popularity: 'High',
      votes: 756,
      views: 10450,
      lastUpdated: '24 days ago'
    },
    {
      id: 37,
      category: 'building',
      question: "Can I transfer personal credit card balances to business cards?",
      answer: "Generally no - this violates the separation between personal and business finances. It can also void your business credit card terms and potentially pierce the corporate veil. Keep business and personal expenses completely separate.",
      difficulty: 'Intermediate',
      readTime: '2 min',
      popularity: 'Medium',
      votes: 434,
      views: 6120,
      lastUpdated: '78 days ago'
    },
    {
      id: 38,
      category: 'tradelines',
      question: "What are store credit accounts and do they help business credit?",
      answer: "Store credit accounts from business suppliers (Home Depot Pro, Lowe's Business, etc.) can help build credit if they report to bureaus. Many don't report, so verify before applying. They're often easier to get approved for than traditional credit cards.",
      difficulty: 'Beginner',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 567,
      views: 7650,
      lastUpdated: '102 days ago'
    },
    {
      id: 39,
      category: 'monitoring',
      question: "How do I know if a vendor reports to business credit bureaus?",
      answer: "Ask directly before opening accounts. Check the vendor's credit application for mentions of credit reporting. Look for terms like 'credit bureau reporting' or 'trade reference.' You can also check with credit bureaus to see if the vendor is a reporting member.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'High',
      votes: 823,
      views: 11890,
      lastUpdated: '17 days ago'
    },
    {
      id: 40,
      category: 'basics',
      question: "What business documents do I need to apply for business credit?",
      answer: "Essential documents include: EIN letter, business license, articles of incorporation/organization, business bank statements, financial statements, and sometimes personal credit reports. Having these ready speeds up the application process significantly.",
      difficulty: 'Beginner',
      readTime: '3 min',
      popularity: 'High',
      votes: 692,
      views: 9340,
      lastUpdated: '33 days ago'
    },
    {
      id: 41,
      category: 'financing',
      question: "What's the typical credit limit for new business credit cards?",
      answer: "Initial limits typically range from $500-$5,000 for new businesses. Factors include business revenue, time in business, personal credit score, and bank relationship. Limits often increase automatically with good payment history and can be requested after 6-12 months.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 745,
      views: 10230,
      lastUpdated: '49 days ago'
    },
    {
      id: 42,
      category: 'building',
      question: "Should I close unused business credit accounts?",
      answer: "Generally no - keep accounts open to maintain credit history length and available credit. However, close accounts with annual fees you're not using or if you have too many accounts to manage effectively. The impact on business credit is less severe than personal credit.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 456,
      views: 6780,
      lastUpdated: '86 days ago'
    },
    {
      id: 43,
      category: 'tradelines',
      question: "What are vendor starter programs and how do they work?",
      answer: "Vendor starter programs help new businesses establish trade references by starting with small credit lines that gradually increase. Companies like Uline, Grainger, and Quill offer these programs with initial limits of $50-$500 that grow with payment history.",
      difficulty: 'Beginner',
      readTime: '3 min',
      popularity: 'High',
      votes: 634,
      views: 8560,
      lastUpdated: '28 days ago'
    },
    {
      id: 44,
      category: 'scores',
      question: "How long does it take for business credit activities to show on reports?",
      answer: "New accounts typically appear within 30-60 days. Payment information updates monthly for most creditors. Negative items like late payments can appear faster (within 30 days). Public records updates vary but generally appear within 60-90 days.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 523,
      views: 7120,
      lastUpdated: '71 days ago'
    },
    {
      id: 45,
      category: 'legal',
      question: "Can I use business credit for personal expenses?",
      answer: "No - using business credit for personal expenses violates the separation between business and personal finances. This can void protections, create tax issues, and potentially allow creditors to pursue personal assets. Keep all expenses strictly separated.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'High',
      votes: 812,
      views: 11450,
      lastUpdated: '37 days ago'
    },
    {
      id: 46,
      category: 'financing',
      question: "What's the difference between business credit cards and business loans?",
      answer: "Credit cards provide revolving credit you can use repeatedly up to a limit. Business loans provide a lump sum with fixed payments over a set term. Cards are better for ongoing expenses and cash flow, loans for major purchases or expansion capital.",
      difficulty: 'Beginner',
      readTime: '3 min',
      popularity: 'High',
      votes: 687,
      views: 9230,
      lastUpdated: '54 days ago'
    },
    {
      id: 47,
      category: 'building',
      question: "How do seasonal businesses build business credit?",
      answer: "Focus on establishing accounts during active seasons and maintaining small balances during off-seasons to show consistent activity. Many seasonal businesses use business lines of credit to smooth cash flow gaps while maintaining credit relationships year-round.",
      difficulty: 'Intermediate',
      readTime: '4 min',
      popularity: 'Medium',
      votes: 378,
      views: 5670,
      lastUpdated: '96 days ago'
    },
    {
      id: 48,
      category: 'tradelines',
      question: "Do business checking accounts affect business credit?",
      answer: "Business checking accounts don't directly build credit, but they're essential for credit applications. Banks often consider your banking relationship when evaluating credit applications. Overdrafts and NSF fees can negatively impact your banking history and credit decisions.",
      difficulty: 'Beginner',
      readTime: '2 min',
      popularity: 'Medium',
      votes: 445,
      views: 6340,
      lastUpdated: '113 days ago'
    },
    {
      id: 49,
      category: 'monitoring',
      question: "What's the difference between business credit monitoring and personal credit monitoring?",
      answer: "Business credit monitoring tracks your business credit reports from D&B, Experian Business, and Equifax Business. It's separate from personal monitoring and typically more expensive. Business reports update less frequently but can change more dramatically than personal reports.",
      difficulty: 'Intermediate',
      readTime: '3 min',
      popularity: 'Medium',
      votes: 534,
      views: 7230,
      lastUpdated: '65 days ago'
    },
    {
      id: 50,
      category: 'industry',
      question: "How do franchise businesses handle business credit?",
      answer: "Franchisees typically build credit under their own business entity, separate from the franchisor. However, some franchisors offer credit programs or partnerships with lenders. The franchise relationship can sometimes help with credit applications due to the established business model.",
      difficulty: 'Advanced',
      readTime: '4 min',
      popularity: 'Medium',
      votes: 423,
      views: 5890,
      lastUpdated: '127 days ago'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return b.votes - a.votes;
      case 'views':
        return b.views - a.views;
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return b.votes - a.votes; // default to popularity
    }
  });

  const visibleFAQs = filteredFAQs.slice(0, visibleCount);

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        setReadCount(prev => prev + 1);
        return [...prev, id];
      }
    });
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 25, filteredFAQs.length));
  };

  const handleVote = (faqId: number, voteType: 'helpful' | 'not-helpful') => {
    setQuestionVotes(prev => {
      const currentVote = prev[faqId];
      const newVote = { ...currentVote };
      
      // Initialize if not exists
      if (!newVote.helpful) newVote.helpful = 0;
      if (!newVote.notHelpful) newVote.notHelpful = 0;
      
      // Handle vote logic
      if (currentVote?.userVote === voteType) {
        // User is removing their vote
        if (voteType === 'helpful') {
          newVote.helpful = Math.max(0, newVote.helpful - 1);
        } else {
          newVote.notHelpful = Math.max(0, newVote.notHelpful - 1);
        }
        newVote.userVote = null;
      } else {
        // User is changing or adding a vote
        if (currentVote?.userVote) {
          // Remove previous vote
          if (currentVote.userVote === 'helpful') {
            newVote.helpful = Math.max(0, newVote.helpful - 1);
          } else {
            newVote.notHelpful = Math.max(0, newVote.notHelpful - 1);
          }
        }
        
        // Add new vote
        if (voteType === 'helpful') {
          newVote.helpful += 1;
        } else {
          newVote.notHelpful += 1;
        }
        newVote.userVote = voteType;
      }
      
      return {
        ...prev,
        [faqId]: newVote
      };
    });
  };

  useEffect(() => {
    if (readCount >= 5 && userLevel === 1) setUserLevel(2);
    if (readCount >= 15 && userLevel === 2) setUserLevel(3);
    if (readCount >= 30 && userLevel === 3) setUserLevel(4);
  }, [readCount, userLevel]);

  const getLevelInfo = (level: number) => {
    const levels = {
      1: { name: 'Credit Curious', color: 'bg-gray-500', next: 5 },
      2: { name: 'Credit Builder', color: 'bg-blue-500', next: 15 },
      3: { name: 'Credit Expert', color: 'bg-purple-500', next: 30 },
      4: { name: 'Credit Master', color: 'bg-yellow-500', next: null }
    };
    return levels[level as keyof typeof levels] || levels[1];
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {/* Hero Section */}
      <div className="relative py-16 px-6 bg-black/20 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-white/10 text-white mb-3 uppercase tracking-wide">
              Level {userLevel}: {getLevelInfo(userLevel).name}
            </Badge>
            <div className="w-full max-w-md mx-auto bg-black/30 rounded-full h-2 mb-2 border border-white/5">
              <div 
                className="bg-white/50 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: getLevelInfo(userLevel).next 
                    ? `${(readCount / getLevelInfo(userLevel).next!) * 100}%` 
                    : '100%' 
                }}
              />
            </div>
            <p className="text-sm text-white/60 uppercase tracking-wide font-medium">
              {getLevelInfo(userLevel).next 
                ? `${getLevelInfo(userLevel).next! - readCount} questions to next level`
                : 'Max level achieved! 🏆'
              }
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 text-white">
            BUSINESS CREDIT
            <br />
            <span className="text-white/80">KNOWLEDGE HUB</span>
          </h1>
          
          <p className="text-lg text-white/70 mb-6 max-w-3xl mx-auto">
            The most comprehensive business credit resource with 1,500+ expert-verified answers from industry professionals.
          </p>

          {/* Premium Access Banner */}
          <div className="mb-6 p-6 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-white/80" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide">FUTEURCRED+ MEMBERS</h2>
              <Crown className="w-6 h-6 text-white/80" />
            </div>
            <p className="text-white/70 mb-4">
              Get unlimited access to our complete knowledge library with 1,500+ expert answers, 
              advanced search filters, priority expert support, and exclusive industry insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/10">
                <BookOpen className="w-4 h-4 text-white" />
                <span className="text-white/80">Full Library Access</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/10">
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-white/80">Priority Expert Chat</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/10">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white/80">Industry Insights</span>
              </div>
            </div>
            <Button className="bg-white/10 hover:bg-white text-white hover:text-black font-bold px-8 py-3 backdrop-blur-sm border border-white/20 hover:border-white transition-all">
              Upgrade to FUTEURCRED+
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mb-6 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg max-w-4xl mx-auto">
            <p className="text-white/70 text-sm">
              <strong>Disclaimer:</strong> This is an informational forum designed to help users learn about business credit. 
              The content provided here is for educational purposes only and does not constitute financial, legal, or professional advice. 
              Always consult with qualified professionals before making financial decisions.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/10">
              <Users className="w-4 h-4 text-white/80" />
              <span className="text-white/70">47,892 Credit Builders</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/10">
              <Trophy className="w-4 h-4 text-white/80" />
              <span className="text-white/70">1,547 Expert Answers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/10">
              <Zap className="w-4 h-4 text-white/80" />
              <span className="text-white/70">Updated Weekly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="sticky top-0 bg-[#0E0E10]/95 backdrop-blur-sm border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search 1,500+ business credit questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-white/30 focus:outline-none backdrop-blur-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm backdrop-blur-sm"
              >
                <option value="popularity">Most Popular</option>
                <option value="votes">Most Voted</option>
                <option value="views">Most Viewed</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white border border-white/20 font-medium'
                      : 'bg-black/30 text-white/70 hover:bg-black/40 border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 space-y-6">
              <Card className="bg-black/30 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-white/80" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Questions Read</span>
                      <span className="text-white font-bold">{readCount}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Next Level: {getLevelInfo(userLevel).next}</span>
                        <span className="text-white/60">{readCount}/{getLevelInfo(userLevel).next}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full">
                        <div 
                          className="h-2 bg-white/30 rounded-full" 
                          style={{ width: `${Math.min((readCount / getLevelInfo(userLevel).next) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Current Level</span>
                      <span className="text-white font-bold">{userLevel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Knowledge Score</span>
                      <span className="text-white font-bold">{Math.min(readCount * 3, 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Upgrade Card */}
              <Card className="bg-black/30 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-white/80" />
                    Premium Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-white/80" />
                      <span>1,500+ Expert Answers</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-white/80" />
                      <span>Advanced Search Filters</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-white/80" />
                      <span>Priority Expert Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-white/80" />
                      <span>Industry Insights</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-white/10 hover:bg-white text-white hover:text-black font-bold backdrop-blur-sm border border-white/20 hover:border-white transition-all">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>

              {/* Expert Support Card - Blurred/Paywall */}
              <div className="relative">
                <Card className="bg-black/30 border-white/10 blur-sm backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-white/80" />
                      Expert Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60 text-sm mb-4 tracking-wide">
                      Can't find your answer? Our business credit experts are standing by.
                    </p>
                    <Button 
                      onClick={() => setShowChatbox(true)}
                      className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20 hover:border-white transition-all font-medium"
                    >
                      Chat with Expert
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Paywall Overlay */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
                  <div className="text-center p-4">
                    <Lock className="w-8 h-8 text-white/80 mx-auto mb-2" />
                    <p className="text-white font-bold text-sm mb-1 uppercase tracking-wide">Premium Feature</p>
                    <p className="text-white/70 text-xs uppercase">Upgrade to FUTEURCRED+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {filteredFAQs.length.toLocaleString()} Questions Found
              </h2>
              <div className="text-sm text-white/60 uppercase tracking-wide font-medium">
                Showing {visibleFAQs.length} of {filteredFAQs.length}
              </div>
            </div>

            <div className="space-y-3">
              {visibleFAQs.map((faq) => {
                const currentVotes = questionVotes[faq.id] || { helpful: 0, notHelpful: 0, userVote: null };
                const totalHelpful = faq.votes + currentVotes.helpful;
                const totalNotHelpful = currentVotes.notHelpful;

                return (
                  <Card key={faq.id} className="bg-black/30 border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm">
                    <CardHeader 
                      className="cursor-pointer pb-3"
                      onClick={() => toggleExpanded(faq.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg mb-3 hover:text-white/80 transition-colors leading-tight font-bold tracking-tight">
                            {faq.question}
                          </CardTitle>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <Badge 
                              variant="secondary" 
                              className="bg-white/10 text-white/80 border-white/10 uppercase text-xs tracking-wider font-medium"
                            >
                              {faq.difficulty}
                            </Badge>
                            
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-3 h-3" />
                              {faq.readTime}
                            </div>
                            
                            <div className="flex items-center gap-1 text-white/60">
                              <ArrowUp className="w-3 h-3" />
                              {totalHelpful.toLocaleString()}
                            </div>
                            
                            <div className="flex items-center gap-1 text-white/60">
                              <Eye className="w-3 h-3" />
                              {faq.views.toLocaleString()}
                            </div>
                            
                            <div className="flex items-center gap-1 text-white/60">
                              <Calendar className="w-3 h-3" />
                              {faq.lastUpdated}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          {expandedItems.includes(faq.id) ? (
                            <ChevronUp className="w-5 h-5 text-purple-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedItems.includes(faq.id) && (
                      <CardContent className="pt-0">
                        <div className="p-4 bg-black/20 backdrop-blur-sm rounded-lg border-l-2 border-white/20">
                          <p className="text-white/80 leading-relaxed mb-4 tracking-wide">
                            {faq.answer}
                          </p>
                          <div className="flex items-center gap-6 text-sm border-t border-white/10 pt-3">
                            <button 
                              onClick={() => handleVote(faq.id, 'helpful')}
                              className={`flex items-center gap-2 transition-colors ${
                                currentVotes.userVote === 'helpful' 
                                  ? 'text-white font-medium' 
                                  : 'text-white/70 hover:text-white'
                              }`}
                            >
                              <ArrowUp className="w-4 h-4" />
                              Helpful ({totalHelpful})
                            </button>
                            <button 
                              onClick={() => handleVote(faq.id, 'not-helpful')}
                              className={`flex items-center gap-2 transition-colors ${
                                currentVotes.userVote === 'not-helpful' 
                                  ? 'text-white font-medium' 
                                  : 'text-white/70 hover:text-white'
                              }`}
                            >
                              <ArrowDown className="w-4 h-4" />
                              Not Helpful ({totalNotHelpful})
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredFAQs.length && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white hover:text-black px-8 py-3 transition-all backdrop-blur-sm"
                >
                  Load More Questions ({filteredFAQs.length - visibleCount} remaining)
                </Button>
              </div>
            )}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-8 max-w-lg mx-auto">
                  <Crown className="w-16 h-16 text-white/80 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Question Not Found?</h3>
                  <p className="text-white/80 mb-6 tracking-wide">
                    Sign up for <strong>FUTEURCRED+</strong> to get full access to our complete library of 1,500+ expert answers and advanced search capabilities.
                  </p>
                  
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-white/70 justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Complete Knowledge Library</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Advanced Search & Filters</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70 justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Priority Expert Support</span>
                    </div>
                  </div>
                  
                  <Button className="bg-white/10 hover:bg-white text-white hover:text-black font-bold px-8 py-3 mb-4 backdrop-blur-sm border border-white/20 hover:border-white transition-all">
                    Upgrade to FUTEURCRED+
                  </Button>
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/60 text-sm mb-2 uppercase tracking-wide">Or try adjusting your search:</p>
                    <Button 
                      onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 text-sm"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expert Chat Widget */}
      {showChatbox && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-purple-600 rounded-t-lg">
            <h3 className="font-bold text-white">Business Credit Expert</h3>
            <button 
              onClick={() => setShowChatbox(false)}
              className="text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-800">
            <div className="space-y-3">
              <div className="bg-purple-600 text-white p-3 rounded-lg text-sm">
                👋 Hi! I'm here to help with your business credit questions. What would you like to know?
              </div>
              <div className="bg-gray-700 text-gray-300 p-3 rounded-lg text-sm">
                I can help with:
                <ul className="mt-2 text-xs list-disc list-inside">
                  <li>Vendor recommendations</li>
                  <li>Credit building strategies</li>
                  <li>Score improvement tips</li>
                  <li>Financing options</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask your question..."
                className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm placeholder-white/50 backdrop-blur-sm"
              />
              <Button size="sm" className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20 hover:border-white transition-all font-medium">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
