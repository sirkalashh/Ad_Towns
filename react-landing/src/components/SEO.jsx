import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "AdTowns – Claim Your Shop. Win Big Prizes.",
  description = "India's first hyper‑local online shop marketplace. Register your interest today — secure your shop before launch and enter the grand competition to win cars, bikes, cash and more.",
  type = "website",
  name = "AdTowns",
  url = "https://adtowns.com",
  image = "https://adtowns.com/logo.png"
}) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={name} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'website' ? "WebSite" : "Organization",
          "name": name,
          "url": "https://adtowns.com",
          "description": "India's first hyper‑local online shop marketplace.",
          "logo": "https://adtowns.com/logo.png",
          ...(type === 'website' && {
             "potentialAction": {
                "@type": "SearchAction",
                "target": "https://adtowns.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
             }
          })
        })}
      </script>
    </Helmet>
  );
}
