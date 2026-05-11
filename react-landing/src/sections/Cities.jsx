import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cities = [
  "Indore", "Mumbai South", "Navi Mumbai", "Thane", "Delhi Central", "Gurgaon", "Noida", 
  "Bengaluru", "Jaipur", "Hyderabad", "Pune", "Chennai", "Ahmedabad", "Surat", 
  "Nagpur", "Bhopal", "Chandigarh", "Kochi", "Goa", "Dehradun", "Vadodara", 
  "Patna", "Ranchi", "Amritsar", "Jodhpur", "Udaipur", "Mysore", "Guwahati", "Puducherry"
];

export default function Cities() {
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState("Indore");

  return (
    <section id="cities" className="py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-coral font-bold uppercase tracking-wider text-xs">Launching across India</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">Is your city on the list?</h2>
        <p className="text-text text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          AdTowns is launching in 100 cities across India. Register your interest to secure your spot before your city goes live.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCity === city 
                  ? "bg-navy text-white border-navy shadow-lg scale-105" 
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
              }`}
            >
              {city}
            </button>
          ))}
          <button 
            className="px-6 py-2 rounded-full text-sm font-bold text-coral border border-coral/20 bg-coral/5 hover:bg-coral hover:text-white transition-all"
            onClick={() => navigate('/register')}
          >
            +71 more ↗
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Major cities are available in multiple zones for hyper‑local reach — Mumbai South, Navi Mumbai, Thane, Vasai-Virar · Delhi Central, Noida, Gurgaon and more
        </p>
      </div>
    </section>
  );
}
