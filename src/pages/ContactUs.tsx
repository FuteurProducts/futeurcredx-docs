import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Footer from './Footer';
import { Briefcase, Scale, Megaphone, User, MapPin } from 'lucide-react';

import { Col, Container, Row } from 'react-bootstrap';

const ContactUs = () => {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    
    console.log('Form submission started...');
    console.log('Form ref:', formRef.current);

    emailjs
      .sendForm(
        'service_gfkc2kq',   // Service ID
        'template_1jpa7bo', // Template ID
        formRef.current,    // Reference to the form
        '8J8V4858Q6wP1K6dB'  // Public Key
      )
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          alert('Your message has been sent successfully to our team. We will get back to you shortly.');
          e.target.reset();
        },
        (error) => {
          console.log('FAILED...', error);
          console.log('Error details:', error.text);
          console.log('Error status:', error.status);
          alert('Oops! Something went wrong. Please try again later.');
        }
      );
  };

  const contactPoints = [
    { icon: Briefcase, title: "Careers", desc: "hr@futeurcredx.com" },
    { icon: Scale, title: "Legal and Compliance", desc: "compliance@futeurcredx.com" },
    { icon: User, title: "Technical Support", desc: "support@futeurcredx.com" },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/contact-hero.jpg" 
            alt="Contact Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-white/90 text-base sm:text-lg font-medium mb-4 tracking-wide">Get in touch</p>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                WE'RE HERE TO<br />
                HELP, 24/7
              </h1>
              <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-xl">
                Whether you want to browse our Help Centre for solutions or mail to us directly, we've got you — even on a Sunday.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="py-12 sm:py-16">
        {/* Contact Details Section */}
        <section className="bg-gray-50 py-16 sm:py-24 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-72 items-start">
              {/* Left Column - Main Content */}
              <div className="flex-1 max-w-lg">
                <h3 className='font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 lg:mb-8 text-black leading-tight'>
                  Ignite the ⎯<br />
                  Conversation
                </h3>
                <p className='text-base sm:text-lg leading-relaxed text-gray-600 font-normal'>
                  Let's start a journey together. Reach out to us today and
                  witness how our solutions can revolutionize your business
                  through strategic technology solutions. Your future starts
                  with a simple click.
                </p>
              </div>

              {/* Right Column - Contact Items */}
              <div className="flex-none w-full lg:w-96 flex flex-col gap-8 lg:gap-12">
                {[
                  {
                    title: "Careers",
                    desc: "careers@futeurcredx.com",
                    icon: "/asa (1).svg",
                  },
                  {
                    title: "Legal Inquiries",
                    desc: "legal@futeurcredx.com",
                    icon: "/asa (2).svg",
                  },
                  {
                    title: "Technical Support",
                    desc: "support@futeurcredx.com",
                    icon: "/asa (3).svg",
                  },
                ].map((obj, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-5"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <img src={obj.icon} alt={obj.title} className="w-8 h-8 filter brightness-0" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <h5 className='font-semibold text-2xl text-black'>
                          {obj.title}
                        </h5>
                        <a 
                          href={`mailto:${obj.desc}`}
                          className='text-gray-500 text-lg hover:text-orange-500 transition-colors'
                        >
                          {obj.desc}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* New York Office Section */}
        <section className="bg-white py-20 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 xl:gap-40 items-start lg:items-center">
              {/* Left Column - Image */}
              <div className="flex-none w-full sm:w-96 lg:w-[480px] order-2 lg:order-1">
                <img 
                  src="/newyork.jpg" 
                  alt="New York Office" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>

              {/* Right Column - Content */}
              <div className="flex-none w-full lg:w-auto lg:max-w-2xl order-1 lg:order-2 text-center lg:text-left space-y-8">
                <div>
                  <h3 className='font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 text-black leading-[0.9]'>
                    NEW YORK OFFICE
                  </h3>
                  <p className='text-xl sm:text-2xl leading-relaxed text-gray-600 font-light mb-12'>
                    Where Opportunity Never Sleeps.<br />
                    Welcome to the Heart of It All.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-lg sm:text-xl text-gray-800 font-medium leading-relaxed">
                        17 State Street, Floor 40<br />
                        New York, New York 10004
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <a href="tel:+12129374610" className="text-lg sm:text-xl text-gray-800 font-medium hover:text-black transition-colors">
                      212-937-4610
                    </a>
                  </div>
                </div>
                
                <div className="pt-4">
                  <a 
                    href="https://maps.google.com/?q=17+State+Street,+Floor+40,+New+York,+New+York+10004"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-white py-20 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 xl:gap-24 items-start lg:items-center">
              {/* Left Column - Content */}
              <div className="flex-none w-full lg:w-auto lg:max-w-2xl order-1 text-center lg:text-left space-y-8">
                <div>
                  <h2 className='font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 text-black leading-[0.9]'>
                    Get in ⎯<br />
                    touch with us
                  </h2>
                  <p className='text-xl sm:text-2xl leading-relaxed text-gray-600 font-light mb-12 text-justify'>
                    We're here to help! Whether you have a question about our
                    services, need assistance with your account, or want to
                    provide feedback, our team is ready to assist you.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <a href="mailto:support@futeurcredx.com" className="text-lg sm:text-xl text-gray-800 font-medium leading-relaxed hover:text-black transition-colors">
                        support@futeurcredx.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <a href="tel:+18003967295" className="text-lg sm:text-xl text-gray-800 font-medium hover:text-black transition-colors">
                        + 800-396-7295
                      </a>
                      <p className="text-sm text-gray-600">
                        Available Monday to Friday, 9 AM - 6 PM EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="flex-none w-full sm:w-96 lg:w-[480px] order-2">
                <form
                  ref={formRef}
                  onSubmit={sendEmail}
                  className="bg-gray-50 p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 border border-black"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor="first_name">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          placeholder='Enter your first name...'
                          className='w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors text-gray-900 placeholder-gray-400'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor="last_name">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          placeholder='Enter your last name...'
                          className='w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors text-gray-900 placeholder-gray-400'
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder='Enter your email address...'
                      className='w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors text-gray-900 placeholder-gray-400'
                      required
                    />
                  </div>
                  
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor="message">
                      How can we help you?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder='Enter your message...'
                      rows={5}
                      className='w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none'
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
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

