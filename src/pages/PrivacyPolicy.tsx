import React from 'react';
import { motion } from 'framer-motion';
import FuteurHeader from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  const sections = [
    {
      title: '1. Introduction',
      content: 'At FuteurCredX, we are committed to helping small and medium-sized businesses improve their financial standing and secure funding by providing access to business intelligence and credit insights across our website, mobile applications, and other services (collectively, "Services"). We believe in financial transparency and responsible data handling. This privacy policy outlines how we collect, store, process, and share data, particularly in relation to business credit reports and lending pre-qualification, while ensuring compliance with applicable regulations.',
    },
    {
      title: '2. Definitions',
      content: 'The terms "we," "us," and "our" refer to FuteurCredX Inc. and its affiliates. The terms "you," "yours," and "users" refer to any individual or business entity interacting with FuteurCredX\'s platform, website, mobile applications, or services.',
    },
    {
      title: '3. Data Controllers',
      content: 'FuteurCredX Inc.\n1 Rockefeller Plaza, Floor 6\nNew York, NY 10020\nEmail: support@futeur.ai\nPhone: +1 (877) - 827 - 2095',
    },
    {
      title: '4. Data We Collect and Store',
      content: 'We collect and store various types of data to provide business intelligence and financial services:\n\nBusiness Credit Data (obtained from credit bureaus such as Experian, Equifax, and Dun & Bradstreet) for underwriting, risk evaluation, and lending pre-qualification.\nPersonal Identification Information: Name, email, phone number, business details.\nTransaction Data: Payment history, financial records, funding eligibility.\nAI-Driven Insights: Automated decisioning to match businesses with appropriate financial products.\nTechnical Data: IP addresses, browser details, geographic location, device information, mobile app usage data.\nThird-Party Data: Received from vendors, financial institutions, and regulatory bodies.\nBy using FuteurCredX Services, you consent to the collection and processing of this data.',
    },
    {
      title: '5. How We Use Your Information',
      content: 'Lending Pre-Qualification & Underwriting: Business credit reports are used to assess financial eligibility for funding opportunities.\nCredit Profile Access: We provide users with visibility into their credit data for financial improvement.\nRisk Evaluation: Data helps ensure lending partners match businesses with suitable products.\nCompliance & Fraud Prevention: Strict adherence to laws governing business credit data usage.\nEducation & Guidance: Businesses receive personalized insights to enhance credit readiness.\nService Improvement: Analyzing how users interact with our Services to enhance user experience and functionality.',
    },
    {
      title: '6. Bulk Data Processing & Compliance',
      content: 'We purchase and process business credit reports in bulk for underwriting and financial assessment purposes.\nAll data is strictly used for evaluation and qualification, never for resale.\nCustomers receive detailed guidance on how their credit data is assessed.\nWe maintain compliance with all regulatory bodies overseeing credit reporting and financial underwriting.',
    },
    {
      title: '7. AI-Driven Decisioning & Risk Mitigation',
      content: 'Automated models help evaluate credit risk and lending opportunities while ensuring fairness and non-discriminatory decision-making.\nWe use explainable AI techniques to allow transparency in financial pre-qualification.\nBusinesses can challenge AI-driven decisions and request human review where necessary.',
    },
    {
      title: '8. Data Sharing and Third-Party Partners',
      content: 'FuteurCredX partners with multiple financial institutions and service providers, including but not limited to:\n\nCredit Bureaus (Experian, Equifax, Dun & Bradstreet): To retrieve and analyze credit history.\nLenders & Financial Institutions: When referring businesses for funding opportunities.\nData Storage & Security Vendors: Such as cloud providers for secure data handling.\nAnalytics and Tracking Services: To help us understand how users interact with our Services and improve user experience.\nWe ensure that third parties comply with data protection regulations and do not misuse shared data. When using our mobile applications, we may share certain device information with mobile platform providers as necessary for the functioning of the application.',
    },
    {
      title: '9. Data Retention & Deletion',
      content: 'Business credit data is retained for up to four (4) months post-account deletion unless required by law.\nUsers can request account deletion and removal of associated data, except where required for fraud prevention or compliance.\nData related to underwriting decisions is stored securely and only used for pre-agreed financial assessment purposes.',
    },
    {
      title: '10. Security & Encryption Measures',
      content: 'We implement industry-leading security protocols, including:\n\nEncryption in Transit & At Rest: Protecting sensitive credit and financial data.\nStrict Access Controls: Limiting data access to authorized personnel only.\nFraud Detection Systems: AI-driven analysis to detect anomalies in credit applications.\nCompliance Monitoring: Regular audits to maintain adherence to credit bureau guidelines.\nSecure Mobile Application: Our mobile applications implement additional security measures specific to mobile platforms.',
    },
    {
      title: '11. Your Rights & Consumer Protections',
      content: 'You have the right to:\n\nAccess & Review Credit Data: Request a copy of your business credit report used in lending decisions.\nCorrect Inaccuracies: Dispute and update incorrect data.\nOpt-Out of Data Sharing: Restrict how your information is shared with financial institutions.\nRequest Deletion: Have your personal and business data removed where legally applicable.\nRequests can be submitted to support@futeur.ai.',
    },
    {
      title: '12. Mobile Application Privacy',
      content: 'When using our mobile applications, we may collect additional data specific to mobile usage:\n\nDevice Information: Type of mobile device, operating system version, unique device identifiers.\nMobile Analytics: How you use our mobile application, including crash data and performance metrics.\nLocal Storage: Some data may be stored locally on your device to improve application performance.\nOur mobile applications do not access or collect data from other applications on your device. You can control certain data collection through your device settings. Uninstalling our application will remove locally stored data, but will not affect data stored on our servers.',
    },
    {
      title: '13. Compliance with U.S. State Privacy Laws',
      content: 'This privacy policy complies with major U.S. state laws, including:\n\nCalifornia Consumer Privacy Act (CCPA) & CPRA: Providing transparency on data collection and opt-out options.\nColorado Privacy Act (CPA): Ensuring compliance with financial data protection standards.\nVirginia Consumer Data Protection Act (VCDPA): Guaranteeing fair access to credit data.\nConnecticut Data Privacy Act (CTDPA) & Nevada Chapter 603A (N603): Ensuring non-discriminatory use of credit profiles.',
    },
    {
      title: '14. Children\'s Privacy',
      content: 'Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us at support@futeur.ai and we will take steps to delete such information.',
    },
    {
      title: '15. International Data Transfers',
      content: 'FuteurCredX primarily operates in the United States. If you access our Services from outside the United States, your information may be transferred to, stored, and processed in the United States or other countries where our servers are located. By using our Services, you consent to any transfer of information outside of your country. We implement appropriate safeguards when transferring data across borders.',
    },
    {
      title: '16. Policy Updates',
      content: 'We regularly update our Privacy Policy to reflect regulatory changes and enhancements in our data protection framework. Users will be notified of major changes, and continued use of our Services constitutes agreement with the latest policy.',
    },
  ];

  return (
    <motion.div
      className="bg-white text-gray-800 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <FuteurHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Terms & Policies</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">PRIVACY POLICY</h1>
        </motion.div>

        <div className="space-y-10">
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-widest">PLEASE READ THIS PRIVACY POLICY CAREFULLY</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-lg text-gray-600">At FuteurCredX, your trust is our priority. Our comprehensive legal framework safeguards your data, ensures compliance, and upholds fairness in every interaction.</p>
            <p className="text-sm text-gray-500 mt-4">Last Updated: March 13, 2025</p>
          </motion.div>

          {sections.map((section, index) => (
            <motion.div key={index} variants={itemVariants}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
