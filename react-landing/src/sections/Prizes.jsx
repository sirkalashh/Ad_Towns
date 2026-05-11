import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import StarField from '../components/StarField';

export default function Prizes() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 47, hours: 12, mins: 34, secs: 8 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = n => String(n).padStart(2, '0');

  const grandPrizes = [
    { rank: "Grand prize", ico: "🏆", title: "Premium Flat", desc: "A premium residential flat for the top grand prize winner — a home, gifted by AdTowns", color: "text-gold" },
    { rank: "1st runner-up", ico: "🚗", title: "Brand New Car", desc: "Drive home in a brand new car — awarded to the 1st runner-up of the grand competition", color: "text-white" },
    { rank: "2nd runner-up", ico: "🏍️", title: "Motorcycle / Bike", desc: "A brand new motorcycle for the 2nd runner-up — plus exciting bonuses", color: "text-coral" },
  ];

  const otherPrizes = ["Two-wheelers", "Latest mobile phones", "Cash prizes", "Bicycles", "Laptops & tablets", "Shopping vouchers", "Holiday packages", "Gold coins", "Smart TVs", "Smartwatches", "Premium speakers", "And many more..."];

  const [isMobileView, setIsMobileView] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMobileView(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  return (
    <section id="prizes" className="py-20 px-4">
      <div className="max-w-5xl mx-auto rounded-[3rem] p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(145deg, #0c0c14 0%, #050507 100%)' }}>
        <StarField count={200} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="premium-badge-dark inline-flex items-center gap-3 px-[26px] py-[10px] rounded-full text-gold text-[15px] font-bold mb-6">
            🏆 Grand prize competition — multiple winners
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Register. Compete. <span className="text-gold">Win huge prizes.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            This isn't just a platform launch — it's a celebration of India's local businesses. We're giving away life‑changing prizes to the people who make AdTowns great.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 max-w-2xl">
            <p className="text-white font-bold mb-2">Vendors, visitors, and referrals all get the opportunity to participate.</p>
            <p className="text-gray-400 text-sm">Whether you're a seller listing your shop or a buyer discovering deals — you're automatically in the running.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
            {grandPrizes.map((p, idx) => (
              <motion.div
                key={idx}
                whileInView={isMobileView && !shouldReduceMotion ? {
                  borderColor: "rgba(239, 159, 39, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  scale: 1.02
                } : {}}
                viewport={isMobileView ? { amount: 0.4, margin: "-15% 0px -15% 0px" } : { once: true }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl md:hover:border-gold/30 transition-all group"
              >
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-4">{p.rank}</span>
                <motion.div
                  whileInView={isMobileView && !shouldReduceMotion ? { scale: 1.1 } : {}}
                  className="text-4xl mb-4 group-hover:scale-110 transition-transform"
                >
                  {p.ico}
                </motion.div>
                <h3 className={`text-xl font-bold mb-2 ${p.color}`}>{p.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-6">And many more prizes for multiple winners</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
              {otherPrizes.map(p => (
                <span key={p} className="bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-4 rounded-full hover:border-gold/40 hover:text-white transition-all cursor-default">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Competition registration closes in</p>
            <div className="flex items-center gap-3 sm:gap-6">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.mins },
                { label: 'Secs', val: timeLeft.secs },
              ].map((b, i, arr) => (
                <React.Fragment key={b.label}>
                  <div className="bg-white/10 border border-white/5 p-4 sm:p-6 rounded-2xl min-w-[70px] sm:min-w-[90px]">
                    <div className="text-2xl sm:text-3xl font-extrabold text-gold">{format(b.val)}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-500 mt-1">{b.label}</div>
                  </div>
                  {i < arr.length - 1 && <div className="text-2xl font-bold text-white/20">:</div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <Button variant="primary" className="text-lg px-10 py-4" onClick={() => navigate('/register')}>
            Register now — free to enter ↗
          </Button>
          <p className="text-gray-600 text-[10px] mt-4">No purchase required to enter. Multiple winners across all categories. Full T&Cs apply.</p>
        </div>
      </div>
    </section>
  );
}
