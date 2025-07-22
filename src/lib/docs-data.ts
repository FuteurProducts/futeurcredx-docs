export type NavItem = {
  id: string
  title: string
  tagline: string
  description: string[]
  imageQuery: string
}

export type NavGroup = {
  id: string
  title: string
  items: NavItem[]
}

export const navigation: NavGroup[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        id: "welcome",
        title: "Welcome to FuteurCred",
        tagline: "01",
        description: [
          "FuteurCred is a business credit platform designed to help you build business credit without personal guarantees. Our platform offers an intuitive, easy-to-use interface that makes it simple to manage your business credit and build relationships with vendors.",
          "In addition, the platform is constantly being updated with new features and improvements, so you can expect it to continue to evolve and improve over time. Whether you are looking for a simple credit monitoring tool, or a more advanced platform that can help you build business credit without personal guarantees, FuteurCred is the perfect choice.",
        ],
        imageQuery: "abstract welcome illustration for a fintech platform",
      },
      {
        id: "connect-ai",
        title: "Connect with LUMIQ AI",
        tagline: "02",
        description: [
          "Connect with the LUMIQ AI system to start your credit journey. The AI uses advanced business credit intelligence to understand your business needs and provide relevant recommendations for building credit without personal guarantees.",
        ],
        imageQuery: "futuristic AI connecting with business data, neural network",
      },
      {
        id: "get-strategy",
        title: "Get Personalized Credit Strategy",
        tagline: "03",
        description: [
          "Based on your business profile and credit goals, you will receive personalized recommendations for building business credit. The LUMIQ system analyzes your business data to provide customized vendor recommendations and credit building strategies.",
        ],
        imageQuery: "personalized business strategy plan on a digital tablet",
      },
      {
        id: "build-monitor",
        title: "Build and Monitor Credit",
        tagline: "04",
        description: [
          "Start building your business credit profile using our vendor universe and monitoring tools. Track your progress, manage vendor relationships, and watch your business credit score improve over time with our comprehensive dashboard.",
        ],
        imageQuery: "dashboard showing credit score and financial growth charts",
      },
    ],
  },
  {
    id: "advanced-features",
    title: "Advanced Features",
    items: [
      {
        id: "vendor-universe",
        title: "Vendor Universe",
        tagline: "A1",
        description: [
          "Explore our vast network of vendors to find the right partners for your business. Our platform provides detailed information on each vendor, helping you make informed decisions.",
        ],
        imageQuery: "galaxy of business logos representing a vendor universe",
      },
      {
        id: "credit-reporting",
        title: "Credit Reporting",
        tagline: "A2",
        description: [
          "Automatically report your payment history to business credit bureaus. Consistent reporting is key to building a strong credit profile.",
        ],
        imageQuery: "secure data transfer to credit bureaus illustration",
      },
    ],
  },
]
