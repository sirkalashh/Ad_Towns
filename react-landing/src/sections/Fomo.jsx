import React from 'react';
import StarField from '../components/StarField';

export default function Fomo() {
  return (
    <section className="bg-navy py-12 px-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0c0c14 0%, #08080c 100%)' }}>
      <StarField count={120} className="opacity-70" />
      <div className="max-w-[1100px] mx-auto">
        <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/30 mb-8">
          Why you should register today
        </div>

        <div className="grid grid-cols-2 min-[600px]:grid-cols-4 gap-5">
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 py-8 transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
            <div className="font-heading text-[32px] font-extrabold text-gold mb-2 leading-none">48h</div>
            <div className="text-[13px] text-white/50 leading-snug">Shop positions fill fast after launch</div>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 py-8 transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
            <div className="font-heading text-[32px] font-extrabold text-gold mb-2 leading-none">1st</div>
            <div className="text-[13px] text-white/50 leading-snug">Be the first buyer of this unique concept</div>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 py-8 transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
            <div className="font-heading text-[32px] font-extrabold text-gold mb-2 leading-none">0%</div>
            <div className="text-[13px] text-white/50 leading-snug">Commission — you keep every rupee</div>
          </div>

          <div className="bg-white/5 border border-white/8 rounded-2xl p-6 py-8 transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
            <div className="font-heading text-[32px] font-extrabold text-gold mb-2 leading-none">Win</div>
            <div className="text-[13px] text-white/50 leading-snug">Cars, flats, bikes, cash & more prizes</div>
          </div>
        </div>

        <div className="text-[15px] text-white/40 mt-10 leading-relaxed max-w-[800px] mx-auto">
          <strong className="text-white/70 font-semibold">Early registrants get priority shop selection</strong> — the best floor positions go first.
          Once your city launches, late arrivals get whatever is left.
          Don't miss your chance to be among the founding sellers of AdTowns.
        </div>
      </div>
    </section>
  );
}
