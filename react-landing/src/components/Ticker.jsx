import React from 'react';

export default function Ticker() {
  const tickerItems = [
    { text: "Grand prizes: Flats, Cars, Bikes, Cash & More", icon: "🏆" },
    { text: "100 Cities launching soon", icon: "🇮🇳" },
    { text: "Zero commission for sellers", icon: "💰" },
    { text: "Register interest today to secure your spot", icon: "✨" },
    { text: "India's first hyper‑local online shop marketplace", icon: "🏠" }
  ];

  return (
    <div className="ticker-container">
      <div className="ticker-ribbon">
        <div className="flex animate-marquee">
          {Array(4).fill(tickerItems).flat().map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="ticker-icon">{item.icon}</span>
              <span className="ticker-text">{item.text}</span>
              <div className="ticker-dot" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
