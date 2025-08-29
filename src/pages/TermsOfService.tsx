import React from 'react';
import { motion } from 'framer-motion';
import FuteurHeader from './Header';
import Footer from './Footer';

const TermsOfService = () => {
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
      content: 'These Terms and Conditions govern your use of FuteurCredX\'s services, including our website and mobile applications (collectively, "Services"). By using our Services, you agree to these terms. Please read them carefully.',
    },
    {
      title: '2. Definitions',
      content: 'The terms "we", "us", "our", etc. refers to the company FuteurCredX and its affiliates. The terms "you", "yours", "users" etc. refers to any individual person and/or company that interacts with FuteurCredX and its affiliates\' website or applications in any manner. The phrases "the terms" or "agreement" refers specifically to the current version of the Terms and Services for our Services.',
    },
    {
      title: '3. What We Are and How to Contact Us',
      content: 'Our site and applications are operated by FuteurCredX Inc and its affiliates. We are registered in the United States of America at our office located at 1 Rockefeller Plaza, Floor 6, New York, NY 10020. We at FuteurCredX are here to help small businesses get a better understanding of what business credit is and how it works. We aim to help small businesses to utilize their business credit to the best of their abilities in order for them to have the best chances of success in getting access to credit.\n\nIf you would like to contact us please do so by sending an email to support@futeur.ai or by calling us at +1 (877) - 827 - 2095.',
    },
    {
      title: '4. Acceptance of Terms',
      content: 'By using our website or applications, you are automatically agreeing to these terms and conditions, and you agree to fully comply with them. There are also additional terms and conditions which apply to your usage of our Services. All of them are posted on our website in the same location.',
    },
    {
      title: '5. Updates to Our Policy and Services',
      content: 'Our policies and terms are updated as we see fit in order to keep up to date with everything. We aim to comply with all laws and regulations and in order to do so we may need to change our policies and terms of services. It is your responsibility to read the latest version of this policy which will be posted on our website and remain up to date.\n\nFurthermore, we also reserve the right to make changes to our Services as we see fit. Changes could be implemented for a plethora of reasons. For example, we may implement changes in order to better reflect our products and services or other such reasons as well. We will always try to give reasonable notice of major changes. We reserve the right to suspend or withdraw our Services for any reason. We cannot guarantee that access to our Services or the content on them will forever remain available or to be uninterrupted.',
    },
    {
      title: '6. Your Responsibilities',
      content: 'It is your responsibility to make sure that you keep the details for your account private and safe, including your username, password, and any other sensitive and personal information. It is your responsibility to keep said information private, secure, and confidential. If you feel that your information has been compromised, then it is also your responsibility to change your password AND inform us immediately of the potential breach. You can do so by sending an email to us at support@futeur.ai.\n\nYou agree to only submit information that is completely accurate to your knowledge on our Services. You agree not to submit information that you are aware is incorrect or inaccurate.\n\nYou may not use the likeness of our Services or any of our intellectual property for any reasons other than ones that we have explicitly approved. You agree that all content on our Services, including graphics, logos, images, icons, etc. are all property of FuteurCredX Inc and users have no right to use such content for any reason other than what is explicitly approved by us. You agree you will not use any such content for any purpose without the appropriate prior written authorization. This includes all of our copyrights, trademarks, and patents. All software used on our Services is the property of FuteurCredX Inc and its affiliates and is protected by United States and international copyright laws. Reproduction of such content, in whole or in part, is prohibited without prior consent.',
    },
    {
      title: '7. Our Responsibilities',
      content: 'We do not exclude or limit in any way our liability to you where it would be unlawful to do so. We will always attempt to give the most accurate information on our Services that we are aware of. We will update our Services within a reasonable time once being made aware of any inaccurate information. Please note that we only provide our Services for domestic and private use. You agree not to use our Services for any commercial or business purposes, and we have no liability to you for any loss of profit, loss of business, business interruption, or loss of business opportunity.\n\nIt is within our responsibility to protect your private information to the best we can. We have implemented industry-standard protocols in order to protect your information. We will make you aware of any potential breach within a reasonable time after we have become aware that one has occurred or that we are reasonably suspicious of one occurring.',
    },
    {
      title: '8. Service Disclaimers',
      content: 'Information that is found on our Services is considered to be general information. Do not use the information found on our Services as advice for your own individual circumstances. Instead you should consult a professional or specialist before making any drastic changes to your business model. We are here to help provide you with knowledge, not to tell you how you should proceed. We cannot be legally held liable for any decisions you make.\n\nOur Services hold certain links and mentions to other websites and services that are run completely by third parties. Such links to other websites and resources should not be endorsements of them by us. We have no control over third party links and websites and should not be held liable to anything that happens with you coming into contact with them.',
    },
    {
      title: '9. Law Enforcement',
      content: 'We reserve the right to comply with local and federal state governments and government actors such as law enforcement. While we will take every step necessary to protect consumer privacy, if a government actor, such as law enforcement officers, are able to provide a valid warrant for certain information or documents we would have no choice but to hand over those documents to the proper authorities. Under such circumstances, we have no obligation to inform you that such a case has arisen.\n\nOur Services are governed under New York law as well as any applicable federal laws. You may not use our Services in any manner in any way that would be considered illegal. You may not use our Services in the furtherance of any crimes either. If we suspect criminal activity from your account, we would be obligated to turn said information over to law enforcement.\n\nA failure or delay in enforcing an obligation, or exercising a right or remedy, does not amount to a waiver of that obligation, right or remedy on our part. We may at any time and in our sole discretion delay or waive enforcing any of our rights or remedies under this Agreement or under applicable law without losing any of those or any other rights or remedies. Even if we do not enforce our rights or remedies at any one time, we may enforce them at a later date.',
    },
    {
      title: '10. Amendments To Terms',
      content: 'We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically. Your continued use of the Services following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently, so you are aware of any changes, as they are binding on you. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. Each time you order, access or use any of the Services, you signify your acceptance and agreement, without limitation or qualification, to be bound by the then current Agreement and included Terms and Conditions. If you do not agree to the new terms, you are no longer authorized to use Service.',
    },
    {
      title: '11. Arbitration',
      content: 'All disputes arising under this agreement shall be governed by and interpreted in accordance with the laws of the State of New York, without giving effect to its conflicts of law provisions. You agree to submit to the personal jurisdiction of the state and federal courts located in New York County.',
    },
    {
      title: '12. Mobile Application End User License Agreement',
      content: 'Apps made available through the App Store are licensed, not sold, to you. Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement ("Standard EULA"), or a custom end user license agreement between you and the Application Provider ("Custom EULA"), if one is provided. Your license to any Apple App under this Standard EULA or Custom EULA is granted by Apple, and your license to any Third Party App under this Standard EULA or Custom EULA is granted by the Application Provider of that Third Party App. Any App that is subject to this Standard EULA is referred to herein as the "Licensed Application." The Application Provider or Apple as applicable ("Licensor") reserves all rights in and to the Licensed Application not expressly granted to you under this Standard EULA.\n\na. Scope of License\nLicensor grants to you a nontransferable license to use the Licensed Application on any Apple-branded products that you own or control and as permitted by the Usage Rules. The terms of this Standard EULA will govern any content, materials, or services accessible from or purchased within the Licensed Application as well as upgrades provided by Licensor that replace or supplement the original Licensed Application, unless such upgrade is accompanied by a Custom EULA. Except as provided in the Usage Rules, you may not distribute or make the Licensed Application available over a network where it could be used by multiple devices at the same time. You may not transfer, redistribute or sublicense the Licensed Application and, if you sell your Apple Device to a third party, you must remove the Licensed Application from the Apple Device before doing so. You may not copy (except as permitted by this license and the Usage Rules), reverse-engineer, disassemble, attempt to derive the source code of, modify, or create derivative works of the Licensed Application, any updates, or any part thereof (except as and only to the extent that any foregoing restriction is prohibited by applicable law or to the extent as may be permitted by the licensing terms governing use of any open-sourced components included with the Licensed Application).\n\nb. Consent to Use of Data\nYou agree that Licensor may collect and use technical data and related information—including but not limited to technical information about your device, system and application software, and peripherals—that is gathered periodically to facilitate the provision of software updates, product support, and other services to you (if any) related to the Licensed Application. Licensor may use this information, as long as it is in a form that does not personally identify you, to improve its products or to provide services or technologies to you.\n\nc. Termination\nThis Standard EULA is effective until terminated by you or Licensor. Your rights under this Standard EULA will terminate automatically if you fail to comply with any of its terms.\n\nd. External Services\nThe Licensed Application may enable access to Licensor\'s and/or third-party services and websites (collectively and individually, "External Services"). You agree to use the External Services at your sole risk. Licensor is not responsible for examining or evaluating the content or accuracy of any third-party External Services, and shall not be liable for any such third-party External Services. Data displayed by any Licensed Application or External Service, including but not limited to financial, medical and location information, is for general informational purposes only and is not guaranteed by Licensor or its agents. You will not use the External Services in any manner that is inconsistent with the terms of this Standard EULA or that infringes the intellectual property rights of Licensor or any third party. You agree not to use the External Services to harass, abuse, stalk, threaten or defame any person or entity, and that Licensor is not responsible for any such use. External Services may not be available in all languages or in your Home Country, and may not be appropriate or available for use in any particular location. To the extent you choose to use such External Services, you are solely responsible for compliance with any applicable laws. Licensor reserves the right to change, suspend, remove, disable or impose access restrictions or limits on any External Services at any time without notice or liability to you.\n\ne. NO WARRANTY\nYOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSED APPLICATION IS AT YOUR SOLE RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, AND LICENSOR HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE LICENSED APPLICATION AND ANY SERVICES, EITHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY, OF SATISFACTORY QUALITY, OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY, OF QUIET ENJOYMENT, AND OF NONINFRINGEMENT OF THIRD-PARTY RIGHTS. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY LICENSOR OR ITS AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY. SHOULD THE LICENSED APPLICATION OR SERVICES PROVE DEFECTIVE, YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION AND LIMITATIONS MAY NOT APPLY TO YOU.\n\nf. Limitation of Liability\nTO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR PERSONAL INJURY OR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE LICENSED APPLICATION, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, OR OTHERWISE) AND EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. In no event shall Licensor\'s total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of fifty dollars ($50.00). The foregoing limitations will apply even if the above stated remedy fails of its essential purpose.\n\ng. Export Restrictions\nYou may not use or otherwise export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained. In particular, but without limitation, the Licensed Application may not be exported or re-exported (a) into any U.S.-embargoed countries or (b) to anyone on the U.S. Treasury Department\'s Specially Designated Nationals List or the U.S. Department of Commerce Denied Persons List or Entity List. By using the Licensed Application, you represent and warrant that you are not located in any such country or on any such list. You also agree that you will not use these products for any purposes prohibited by United States law, including, without limitation, the development, design, manufacture, or production of nuclear, missile, or chemical or biological weapons.\n\nh. Commercial Items\nThe Licensed Application and related documentation are "Commercial Items", as that term is defined at 48 C.F.R. §2.101, consisting of "Commercial Computer Software" and "Commercial Computer Software Documentation", as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein. Unpublished-rights reserved under the copyright laws of the United States.\n\ni. Governing Law\nExcept to the extent expressly provided in the following paragraph, this Agreement and the relationship between you and Apple shall be governed by the laws of the State of California, excluding its conflicts of law provisions. You and Apple agree to submit to the personal and exclusive jurisdiction of the courts located within the county of Santa Clara, California, to resolve any dispute or claim arising from this Agreement. If (a) you are not a U.S. citizen; (b) you do not reside in the U.S.; (c) you are not accessing the Service from the U.S.; and (d) you are a citizen of one of the countries identified below, you hereby agree that any dispute or claim arising from this Agreement shall be governed by the applicable law set forth below, without regard to any conflict of law provisions, and you hereby irrevocably submit to the non-exclusive jurisdiction of the courts located in the state, province or country identified below whose law governs:\n\nIf you are a citizen of any European Union country or Switzerland, Norway or Iceland, the governing law and forum shall be the laws and courts of your usual place of residence.\n\nSpecifically excluded from application to this Agreement is that law known as the United Nations Convention on the International Sale of Goods.',
    },
  ];

  return (
    <motion.div
      className="bg-white text-gray-800 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Terms & Policies</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">TERMS AND CONDITIONS</h1>
        </motion.div>

        <div className="space-y-10">
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-widest">PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY</p>
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
 
    </motion.div>
  );
};

export default TermsOfService;

