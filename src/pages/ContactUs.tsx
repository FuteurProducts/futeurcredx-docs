import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import FuteurHeader from './Header';
import Footer from './Footer';
import { Briefcase, Scale, Megaphone, User, MapPin } from 'lucide-react';

const ContactUs = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    // IMPORTANT: Replace with your EmailJS credentials
    emailjs.sendForm('service_gfkc2kq', 'template_1jpa7bo', formRef.current, '8J8V4858Q6wP1K6dB')
      .then((result) => {
          console.log('SUCCESS!', result.text);
          alert('Your message has been sent successfully. We will get back to you shortly.');
          (e.target as HTMLFormElement).reset();
        }, (error) => {
          console.log('FAILED...', error.text);
          alert('Oops! Something went wrong. Please try again later.');
        });
  };

  const contactPoints = [
    { icon: Briefcase, title: "Careers", desc: "careers@futeur.ai" },
    { icon: Scale, title: "Legal Inquiries", desc: "legal@futeur.ai" },
    { icon: Megaphone, title: "Press & Media", desc: "team@futeurmedia.com" },
    { icon: User, title: "Accounts", desc: "accounts@futeur.ai" },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      <FuteurHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
      
        {/* Contact Points Section */}
      
        {/* Form Section */}
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Get in Touch</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">Ready to transform your business? Let's start the conversation.</p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                    <form ref={formRef} onSubmit={sendEmail} className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label htmlFor="first_name" className="block text-sm font-semibold text-gray-800 mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        id="first_name" 
                                        name="first_name" 
                                        placeholder='John' 
                                        className='w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium' 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last_name" className="block text-sm font-semibold text-gray-800 mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        id="last_name" 
                                        name="last_name" 
                                        placeholder='Doe' 
                                        className='w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium' 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder='john@company.com' 
                                    className='w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium' 
                                    required 
                                />
                            </div>
                            
                            <div className="mt-8 space-y-2">
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-2">Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    placeholder='Tell us about your project and how we can help...' 
                                    rows={6} 
                                    className='w-full px-4 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium resize-none' 
                                    required 
                                />
                            </div>
                            
                            <div className="mt-10">
                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-indigo-600 to-black hover:from-indigo-700 hover:to-black text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
         {/* Location Section */}
         <section className='mb-20'>
            <div className="w-full py-12 lg:py-16 bg-slate-50 rounded-2xl">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <h4 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>New York Office</h4>
                            <p className='text-lg text-gray-600 leading-relaxed mt-2'>Where Opportunity Never Sleeps. Welcome to the Heart of It All.</p>
                        </div>
                        <div className="flex justify-center md:justify-end">
                            <a href="https://www.google.com/maps/place/1+Rockefeller+Plaza" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                <MapPin className="w-6 h-6"/>
                                1 Rockefeller Plaza, Floor 6, New York, NY 10020
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;

