import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { Portfolio } from '../components/Portfolio';
import { WhyUs } from '../components/WhyUs';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';

export const Home = () => {
  const [preselectedService, setPreselectedService] = useState('Web Development');

  const handleSelectServiceFromCard = (serviceName) => {
    setPreselectedService(serviceName);
  };

  return (
    <div className="relative min-h-screen bg-[#08080C] text-slate-100 selection:bg-purple-600 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Services onSelectService={handleSelectServiceFromCard} />
        <Portfolio />
        <WhyUs />
        <ContactSection preselectedService={preselectedService} />
      </main>
      <Footer />
    </div>
  );
};
