import { ArrowUpRight, FileText, Edit3 } from 'lucide-react';
import { AccordionItemProps } from '@/components/content/DocsAccordion';

export type ContentBlock = 
  | { type: 'heading'; level: 1; title: string; withCopy?: boolean } 
  | { type: 'image'; src: string; alt: string; }
  | { type: 'paragraph'; text: string; }
  | { type: 'link'; href: string; text: string; }
  | { type: 'cardGrid'; cards: CardProps[] }
  | { type: 'accordion'; items: AccordionItemProps[] };

export interface CardProps {
  href: string;
  Icon: React.ElementType;
  title: string;
  description: string;
}

export interface SectionData {
  [key: string]: ContentBlock[];
}

export const docsContent: SectionData = {
  introduction: [
    { type: 'heading', level: 1, title: 'Introduction', withCopy: true },
    { type: 'image', src: '/ApiDocs.png', alt: 'API Documentation Mockup' },
    { 
      type: 'paragraph', 
      text: 'FuteurCredX provides developers with powerful financial data through our flagship API, the Lumiq Credit Journey. This service grants direct access to comprehensive Experian credit data, enabling you to build sophisticated financial products and services.' 
    },
    { 
      type: 'paragraph', 
      text: 'The Lumiq Credit Journey API delivers a wealth of information, including the FSR Score, Intelliscore Plus, industry payment insights, and detailed credit health analytics. You can access critical data points such as risk factors, credit inquiries, tradelines, industry risk, collections, business obligations, and credit utilization. Gaining access is straightforward—simply create an account to start integrating our powerful credit data into your applications.' 
    },
    {
      type: 'cardGrid',
      cards: [
        {
          href: '/docs/api-reference',
          Icon: FileText,
          title: 'API Reference',
          description: 'Explore and integrate with API endpoints'
        },
        {
          href: 'quickstart',
          Icon: Edit3,
          title: 'LUMIQ Quickstart Guide',
          description: 'Get started with LUMIQ in just a few minutes'
        }
      ]
    }
  ],
  dashboard: [
    { type: 'heading', level: 1, title: 'Dashboard' },
    { 
      type: 'paragraph', 
      text: 'The FuteurCredX Dashboard is where you can manage your integration, retrieve API keys, and subscribe to webhooks. Developers can sign up for their small business to get started. If you want to use the API, you\'ll need a key, which can only be generated from the dashboard.' 
    },
    { 
      type: 'paragraph', 
      text: 'If you are a customer and have been sent access, you can log in here. If you have difficulties logging in, please reach out to your account’s administrator or contact the FuteurCredX team to get set up.' 
    },
    { type: 'image', src: '/dashboard.png', alt: 'FuteurCredX Dashboard Overview' },
    { type: 'link', href: 'https://www.futeurcredx.com/login', text: 'Login to your dashboard' }
  ],
  'launch-checklist': [
    { type: 'heading', level: 1, title: 'Launch Checklist', withCopy: true },
    {
      type: 'paragraph',
      text: 'Follow these steps to ensure a smooth launch when you are ready to go live with your FuteurCredX integration.'
    },
    {
      type: 'paragraph',
      text: '1. Sign Up & Configure: If you haven\'t already, create an account at futeurcredx.com/signup. Complete your business profile by providing your business name, address, and other required details. This is a mandatory step before you can generate API keys.'
    },
    {
      type: 'paragraph',
      text: '2. Generate Production API Keys: Navigate to the API Keys section in your dashboard and generate a new key for your production environment. Securely store this key on your application server—it will not be shown again.'
    },
    {
      type: 'paragraph',
      text: '3. Secure Your Keys: Ensure your production API keys are stored securely as environment variables or using a secrets management service. Never expose them in client-side code or commit them to source control.'
    },
    {
      type: 'paragraph',
      text: '4. Handle Webhooks: If your integration relies on asynchronous updates, ensure you have implemented and tested webhook endpoints to handle all relevant events for the products you are using.'
    },
    {
      type: 'paragraph',
      text: '5. Final Testing: Remove any development credentials or test data from your production build. Perform end-to-end tests using your production API keys to ensure all API calls and workflows function as expected.'
    }
  ],
  'sdk-web': [
    { type: 'heading', level: 1, title: 'Web SDK' },
    { 
      type: 'paragraph', 
      text: 'Our team is currently working hard on developing a powerful and easy-to-use Web SDK. It will be available soon to help you seamlessly integrate FuteurCredX into your web applications.' 
    },
    { 
      type: 'paragraph', 
      text: 'In the meantime, you can get started by exploring your dashboard, where you can manage your account and generate API keys.' 
    },
    { type: 'link', href: 'https://www.futeurcredx.com/login', text: 'Go to your dashboard' }
  ],
  quickstart: [
    { type: 'heading', level: 1, title: 'Quickstart', withCopy: true },
    {
      type: 'paragraph',
      text: 'Integrating with FuteurCredX is simple. Follow these steps for a basic client and server-side integration to call the API and manage your data.'
    },
    {
      type: 'accordion',
      items: [
        {
          trigger: '1. Sign Up & Create Account',
          content: [
            { type: 'paragraph', text: 'First, you need an account. If you don\'t have one, sign up and create your business profile. This is where you will manage everything.' },
            { type: 'image', src: '/Signup.png', alt: 'Signup Page' },
            { type: 'link', href: 'https://www.futeurcredx.com/signup', text: 'Create your account' }
          ]
        },
        {
          trigger: '2. Access Your Dashboard',
          content: [
            { type: 'paragraph', text: 'Once your account is created, log in to access your dashboard. This is your central hub for managing API keys and monitoring usage.' },
            { type: 'image', src: '/dashboard.png', alt: 'User Dashboard' },
            { type: 'link', href: 'https://www.futeurcredx.com/login', text: 'Login to your dashboard' }
          ]
        },
        {
          trigger: '3. Generate and Secure API Keys',
          content: [
            { type: 'paragraph', text: 'In the dashboard, navigate to the API Keys section to generate your first key. Copy it immediately and store it securely on your server. For security reasons, you will not be able to see the key again.' },
            { type: 'image', src: '/generatekey.png', alt: 'Generate API Key' },
            { type: 'image', src: '/key.png', alt: 'API Key' }
          ]
        },
        {
          trigger: '4. Make Your First API Call',
          content: [
            { type: 'paragraph', text: 'With your API key, you are ready to make authenticated requests to the FuteurCredX API. Use the key in the Authorization header of your requests as a Bearer token. You can test your API key directly from the dashboard to ensure it is working correctly before integrating it into your application.' },
            { type: 'image', src: '/Apikey.png', alt: 'API Key Testing' },
            { type: 'image', src: '/test.png', alt: 'API Call Test' }
          ]
        }
      ]
    }
  ]
};
