import { useNavigate } from 'react-router-dom';

const promiseStats = [
  { n: "0%", l: "Commission on your sales — ever" },
  { n: "1 size", l: "Same shop for every seller" },
  { n: "1 year", l: "Full validity per shop" }
];

export default function Promise() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="bg-[#FAECE7] border border-[rgba(216,90,48,0.15)] rounded-[24px] py-14 px-8 text-center max-w-4xl mx-auto">
        <div className="text-[#993C1D] font-bold uppercase tracking-wider text-[11px] mb-3">The AdTowns promise</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-[#993C1D] leading-tight">
          Chai tapri or restaurant chain —<br/><span className="text-coral">same shop, same price, same stage.</span>
        </h2>
        <p className="text-[15px] text-[#993C1D] opacity-70 max-w-xl mx-auto mb-8 leading-relaxed">
          No commission on your sales. No bigger shop for bigger budgets. Every seller gets an equal, identical online shop. Your deal quality wins customers — not your wallet. That's the AdTowns promise.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[440px] mx-auto mb-6">
          {promiseStats.map((p, i) => (
            <div key={i} className="bg-white/70 rounded-xl p-4 border border-[rgba(216,90,48,0.12)]">
              <div className="font-heading text-[26px] font-extrabold text-coral mb-1">{p.n}</div>
              <div className="text-[11px] text-[#993C1D] opacity-65 leading-snug">{p.l}</div>
            </div>
          ))}
        </div>

        <div className="max-w-[360px] mx-auto mb-6 bg-white/65 rounded-2xl border border-[rgba(216,90,48,0.1)] overflow-hidden">
          <div className="grid grid-cols-2 bg-[rgba(216,90,48,0.1)] px-4 py-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#993C1D] text-left">Platform</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#993C1D] text-right">Their charge</span>
          </div>
          <div className="grid grid-cols-2 px-4 py-2.5 border-t border-[rgba(216,90,48,0.08)]">
            <span className="text-[13px] font-semibold text-gray-900 text-left">Nearbuy / Groupon</span>
            <span className="text-[12px] text-gray-500 text-right">2–25% per sale</span>
          </div>
          <div className="grid grid-cols-2 px-4 py-2.5 border-t border-[rgba(216,90,48,0.08)]">
            <span className="text-[13px] font-semibold text-gray-900 text-left">Google Ads</span>
            <span className="text-[12px] text-gray-500 text-right">Pay per click</span>
          </div>
          <div className="grid grid-cols-2 px-4 py-2.5 border-t border-[rgba(216,90,48,0.08)]">
            <span className="text-[13px] font-semibold text-gray-900 text-left">Instagram Ads</span>
            <span className="text-[12px] text-gray-500 text-right">Pay per result</span>
          </div>
          <div className="grid grid-cols-2 px-4 py-2.5 bg-coral text-white border-t border-transparent">
            <span className="text-[13px] font-bold text-left">AdTowns</span>
            <span className="text-[12px] font-bold text-right">starting from ₹499.88</span>
          </div>
        </div>

        <button onClick={handleRegister} className="inline-block px-8 py-3.5 rounded-full bg-coral text-white font-bold text-[15px] transition-all hover:bg-[#993C1D] hover:-translate-y-0.5">
          Join the equal opportunity platform ↗
        </button>
      </div>
    </section>
  );
}
