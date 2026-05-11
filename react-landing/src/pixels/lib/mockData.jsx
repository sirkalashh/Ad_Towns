// ============================================================
// PixelBazaar Mock Data
// Provides all data needed to run the frontend without a backend
// ============================================================

// ---- Categories (9 as per spec) ----
export const CATEGORIES = [
  { id: 1, name: 'Fashion',       slug: 'fashion',       primary_color: '#D4537E', emoji: '👗', icon: 'Shirt' },
  { id: 2, name: 'Food',          slug: 'food',          primary_color: '#D85A30', emoji: '🍔', icon: 'UtensilsCrossed' },
  { id: 3, name: 'Medical',       slug: 'medical',       primary_color: '#1D9E75', emoji: '🏥', icon: 'Stethoscope' },
  { id: 4, name: 'Spa',           slug: 'spa',           primary_color: '#7F77DD', emoji: '💆', icon: 'Sparkles' },
  { id: 5, name: 'Gym',           slug: 'gym',           primary_color: '#639922', emoji: '💪', icon: 'Dumbbell' },
  { id: 6, name: 'Events',        slug: 'events',        primary_color: '#BA7517', emoji: '🎉', icon: 'PartyPopper' },
  { id: 7, name: 'Startups',      slug: 'startups',      primary_color: '#378ADD', emoji: '🚀', icon: 'Rocket' },
  { id: 8, name: 'Talents',       slug: 'talents',       primary_color: '#E24B4A', emoji: '🎨', icon: 'Palette' },
  { id: 9, name: 'Miscellaneous', slug: 'miscellaneous', primary_color: '#888780', emoji: '🔧', icon: 'Wrench' },
];

// ---- City ----
export const CITY = {
  name: 'Indore',
  slug: 'indore',
  state: 'Madhya Pradesh',
  vendor_count: 135,
  category_count: 9,
  total_pixels: 1800,
};

// ---- Vendor templates per category ----
const VENDOR_TEMPLATES = {
  fashion: [
    { business_name: "Ritu's Designer Boutique", deal_headline: 'Flat 40% OFF on Wedding Collection', description: 'Exclusive bridal lehengas, sarees, and designer wear. Handcrafted by expert artisans with premium fabrics. Visit our Palasia showroom for the latest wedding season collection.', rating: 4.2, whatsapp: '919876543210', link_url: 'https://example.com/ritus' },
    { business_name: 'Trendy Threads', deal_headline: 'Buy 2 Get 1 FREE — All Kurtis', description: 'Premium cotton and silk kurtis for every occasion. Indo-western styles, everyday office wear, and festive collections. New arrivals every week!', rating: 4.5, whatsapp: '919876543211', link_url: null },
    { business_name: 'Sapna Jewellers', deal_headline: '20% OFF on Gold Plated Sets', description: 'Artificial and gold-plated jewellery for weddings, festivals, and daily wear. Temple jewellery, kundan, and polki sets available.', rating: 4.0, whatsapp: '919876543212', link_url: 'https://example.com/sapna' },
    { business_name: 'StyleHub Men', deal_headline: 'Blazers Starting ₹999', description: 'Premium men\'s formals, casuals, and party wear. Tailoring services available. Visit us at Vijay Nagar for the best collection in Indore.', rating: 3.9, whatsapp: '919876543213', link_url: null },
    { business_name: 'Footwear Factory', deal_headline: 'All Shoes Under ₹799', description: 'Sports shoes, formals, sandals, and sneakers. 100+ brands under one roof. Exchange offer available on old footwear.', rating: 4.3, whatsapp: '919876543214', link_url: null },
  ],
  food: [
    { business_name: 'Sharma Ji Sweets', deal_headline: 'Diwali Box Starting ₹199', description: 'Authentic Indori sweets and namkeen. Famous poha-jalebi, malpua, and dry fruit ladoo. Bulk orders for corporate gifting available.', rating: 4.7, whatsapp: '919876543220', link_url: null },
    { business_name: 'Pizza Paradise', deal_headline: '2 Medium Pizzas @ ₹399', description: 'Wood-fired pizzas with authentic Italian dough. 30+ topping options. Free delivery within 5km. Open till midnight.', rating: 4.1, whatsapp: '919876543221', link_url: 'https://example.com/pizza' },
    { business_name: 'Chai Sutta Bar', deal_headline: 'Kulhad Chai + Bun Maska ₹49', description: 'Indore\'s favorite chai spot. 20+ flavors of kulhad chai, maggi, sandwiches, and momos. Perfect hangout for students and professionals.', rating: 4.4, whatsapp: '919876543222', link_url: null },
    { business_name: 'Green Bowl Salads', deal_headline: 'Healthy Lunch Bowls @ ₹149', description: 'Fresh salads, smoothie bowls, and protein meals. Keto, vegan, and gluten-free options. Daily menu changes. Home delivery available.', rating: 4.6, whatsapp: '919876543223', link_url: null },
  ],
  medical: [
    { business_name: 'Smile Dental Clinic', deal_headline: 'Free Dental Checkup This Week', description: 'Complete dental care — cleaning, braces, implants, and cosmetic dentistry. Painless root canal treatment. EMI options available.', rating: 4.8, whatsapp: '919876543230', link_url: 'https://example.com/smile' },
    { business_name: 'HealthFirst Pharmacy', deal_headline: '15% OFF on All Medicines', description: 'Genuine medicines at discounted prices. Free home delivery. Online prescription upload. Open 24/7.', rating: 4.3, whatsapp: '919876543231', link_url: null },
    { business_name: 'Vision Eye Center', deal_headline: 'Eye Checkup @ ₹99 Only', description: 'Comprehensive eye examination, LASIK surgery, cataract treatment, and designer frames. Experienced ophthalmologists on staff.', rating: 4.5, whatsapp: '919876543232', link_url: null },
  ],
  spa: [
    { business_name: 'Serenity Spa & Wellness', deal_headline: 'Full Body Massage @ ₹799', description: 'Swedish, Thai, Balinese, and Ayurvedic massages. Couples packages available. Private rooms with aromatherapy. Book your relaxation slot today.', rating: 4.6, whatsapp: '919876543240', link_url: 'https://example.com/serenity' },
    { business_name: 'Glow Beauty Studio', deal_headline: 'Bridal Makeup Trial @ ₹1499', description: 'Professional makeup artists for weddings, parties, and photoshoots. MAC, Huda Beauty products used. Pre-bridal packages from ₹5999.', rating: 4.4, whatsapp: '919876543241', link_url: null },
  ],
  gym: [
    { business_name: 'Iron Fitness Hub', deal_headline: '3 Months @ ₹2999 — No Joining Fee', description: 'State-of-the-art equipment, personal trainers, and group fitness classes. Zumba, yoga, and CrossFit batches. AC facility with shower rooms.', rating: 4.3, whatsapp: '919876543250', link_url: null },
    { business_name: 'Yoga Bliss Studio', deal_headline: 'First Month FREE for New Joiners', description: 'Traditional yoga, power yoga, and meditation classes. Certified instructors. Morning and evening batches. Stress-free living starts here.', rating: 4.7, whatsapp: '919876543251', link_url: 'https://example.com/yogabliss' },
  ],
  events: [
    { business_name: 'Royal Events Planner', deal_headline: 'Wedding Planning Starting ₹49,999', description: 'End-to-end wedding planning — décor, catering, photography, and entertainment. 200+ successful weddings managed. Destination weddings available.', rating: 4.5, whatsapp: '919876543260', link_url: 'https://example.com/royal' },
    { business_name: 'ClickPro Photography', deal_headline: 'Pre-Wedding Shoot @ ₹4999', description: 'Cinematic pre-wedding, wedding, and event photography. Drone shots included. Album delivery within 15 days. 4K video coverage.', rating: 4.6, whatsapp: '919876543261', link_url: null },
  ],
  startups: [
    { business_name: 'CodeNest Solutions', deal_headline: 'Website in 7 Days @ ₹9,999', description: 'Custom web development, mobile apps, and UI/UX design. React, Node.js, and Python experts. Free hosting for 1 year included.', rating: 4.4, whatsapp: '919876543270', link_url: 'https://example.com/codenest' },
    { business_name: 'LaunchPad Co-Working', deal_headline: 'Hot Desk @ ₹199/Day', description: 'Premium co-working space with high-speed WiFi, meeting rooms, and free coffee. Vijay Nagar location. Monthly plans from ₹3999.', rating: 4.2, whatsapp: '919876543271', link_url: null },
    { business_name: 'PrintQuick', deal_headline: '500 Business Cards @ ₹299', description: 'Digital and offset printing — business cards, brochures, banners, and packaging. Same-day delivery available. Bulk discounts.', rating: 4.0, whatsapp: '919876543272', link_url: null },
  ],
  talents: [
    { business_name: 'MusicMaster Academy', deal_headline: 'Learn Guitar in 30 Days — ₹1999', description: 'Guitar, keyboard, drums, and vocal training. Certified instructors with 10+ years of experience. Online and offline batches available.', rating: 4.5, whatsapp: '919876543280', link_url: null },
    { business_name: 'ArtVista Painting Classes', deal_headline: 'Weekend Workshops @ ₹499', description: 'Oil painting, watercolor, sketching, and mandala art. All materials provided. Kids and adult batches. Exhibition opportunities for students.', rating: 4.3, whatsapp: '919876543281', link_url: 'https://example.com/artvista' },
  ],
  miscellaneous: [
    { business_name: 'QuickFix Repairs', deal_headline: 'AC Servicing @ ₹399 Only', description: 'Home appliance repair — AC, washing machine, refrigerator, and microwave. Same-day service. 90-day warranty on all repairs.', rating: 4.1, whatsapp: '919876543290', link_url: null },
    { business_name: 'PetCare Indore', deal_headline: 'Pet Grooming Starting ₹299', description: 'Professional pet grooming, veterinary consultation, pet food, and accessories. Dog walking services. Boarding facility available.', rating: 4.4, whatsapp: '919876543291', link_url: 'https://example.com/petcare' },
    { business_name: 'TravelBee Tours', deal_headline: 'Goa Package 3N/4D @ ₹6,999/person', description: 'Domestic and international tour packages. Group tours, honeymoon specials, and adventure trips. Flight + hotel + sightseeing included.', rating: 4.2, whatsapp: '919876543292', link_url: null },
  ],
};

// ---- Generate consistent colors for vendors without images ----
const VENDOR_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#EF4444',
  '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#06B6D4',
  '#3B82F6', '#A855F7', '#D946EF', '#0EA5E9', '#10B981',
];

function getVendorColor(index) {
  return VENDOR_COLORS[index % VENDOR_COLORS.length];
}

// ---- Generate 100 pixels for a given category (30 Elite, 30 Premium, 40 Standard) ----
export function generateCategoryPixels(categorySlug) {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return null;

  const vendors = VENDOR_TEMPLATES[categorySlug] || [];
  const pixels = [];

  // Assign vendors to positions (randomly for mock purposes)
  const vendorPositions = new Map();
  let vendorIdx = 0;

  // Place some vendors in each tier
  const slots = [
    [1, 2], [1, 5], [1, 8], // Floor 1 (Elite)
    [4, 3], [4, 7],         // Floor 2 (Premium)
    [7, 1], [7, 4], [7, 9], // Floor 3 (Standard)
  ];

  for (const [row, col] of slots) {
    if (vendorIdx < vendors.length) {
      vendorPositions.set(`${row}-${col}`, vendorIdx);
      vendorIdx++;
    }
  }

  let takenCount = 0;

  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 10; col++) {
      let type = 'standard';
      if (row <= 3) type = 'elite';
      else if (row <= 6) type = 'premium';
      
      const key = `${row}-${col}`;
      const vIdx = vendorPositions.get(key);
      const hasVendor = vIdx !== undefined;

      if (hasVendor) takenCount++;

      const pixel = {
        id: `${categorySlug}-${row}-${col}`,
        row_number: row,
        col_number: col,
        pixel_type: type,
        status: hasVendor ? 'taken' : 'available',
      };

      const vendor = hasVendor
        ? {
            ...vendors[vIdx],
            id: `vendor-${categorySlug}-${vIdx}`,
            image_url: null,
            color: getVendorColor(vIdx),
            views_count: Math.floor(Math.random() * 500) + 50,
            whatsapp_taps: Math.floor(Math.random() * 100) + 10,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString(),
            expires_at: new Date(Date.now() + Math.floor(Math.random() * 300 + 60) * 86400000).toISOString(),
          }
        : null;

      pixels.push({ pixel, vendor });
    }
  }

  return {
    category,
    pixels,
    available_pixels: 100 - takenCount,
    elite_available: 30 - pixels.filter(p => p.pixel.pixel_type === 'elite' && p.pixel.status === 'taken').length,
    premium_available: 30 - pixels.filter(p => p.pixel.pixel_type === 'premium' && p.pixel.status === 'taken').length,
    standard_available: 40 - pixels.filter(p => p.pixel.pixel_type === 'standard' && p.pixel.status === 'taken').length,
    total_vendors: takenCount,
  };
}

// ---- Ticker Ads ----
export const TICKER_ADS = [
  {
    id: 'ticker-1',
    title: 'New Vendor Signup Offer',
    subtitle: 'Get 20% OFF on your first pixel — Limited time!',
    cta_text: 'Register Now',
    background_color: '#3B82F6',
  },
  {
    id: 'ticker-2',
    title: '🔥 Trending: 15 new deals added today',
    subtitle: 'Fashion, Food & Medical categories updated',
    cta_text: 'Browse Deals',
    background_color: '#8B5CF6',
  },
  {
    id: 'ticker-3',
    title: '💰 Diwali Special: Premium Pixels @ Standard Price',
    subtitle: 'Offer valid till Nov 15',
    cta_text: 'Claim Now',
    background_color: '#D85A30',
  },
  {
    id: 'ticker-4',
    title: '🎯 500+ businesses already on PixelBazaar',
    subtitle: 'Join Indore\'s fastest growing deal platform',
    cta_text: 'Learn More',
    background_color: '#1D9E75',
  },
];

// ---- Ad Slot Banners (between rows) ----
export const AD_SLOTS = {
  after_row_5: [
    {
      id: 'ad-5-1',
      title: 'Diwali Mega Sale',
      subtitle: 'Up to 60% OFF on Fashion & Lifestyle',
      cta_text: 'Shop Now',
      label_text: 'Featured',
      background_color: '#D4537E',
    },
    {
      id: 'ad-5-2',
      title: 'New Restaurant Alert!',
      subtitle: 'Sharma Ji Sweets now on PixelBazaar',
      cta_text: 'View Deal',
      label_text: 'New',
      background_color: '#D85A30',
    },
  ],
  after_row_10: [
    {
      id: 'ad-10-1',
      title: 'Premium Pixels Available',
      subtitle: 'Top visibility for your business — Row 1 & 2',
      cta_text: 'Book Now',
      label_text: 'Sponsored',
      background_color: '#BA7517',
    },
  ],
  after_row_15: [
    {
      id: 'ad-15-1',
      title: 'Health & Wellness Week',
      subtitle: 'Free dental checkups, gym trials & spa discounts',
      cta_text: 'Explore',
      label_text: 'Special',
      background_color: '#1D9E75',
    },
  ],
  after_row_20: [
    {
      id: 'ad-20-1',
      title: 'Become a Vendor',
      subtitle: 'List your business for just ₹499/year. Equal pixels, equal opportunity.',
      cta_text: 'Register',
      label_text: 'PixelBazaar',
      background_color: '#378ADD',
    },
  ],
};

// ---- Pricing (3 tiers) ----
export const PRICING = {
  elite: {
    fashion: 1999.88,
    food: 1999.88,
    medical: 1999.88,
    spa: 1999.88,
    gym: 1999.88,
    events: 1999.88,
    startups: 1499.88,
    talents: 1499.88,
    miscellaneous: 1499.88,
  },
  premium: {
    fashion: 1499.88,
    food: 1499.88,
    medical: 1499.88,
    spa: 1499.88,
    gym: 1499.88,
    events: 1499.88,
    startups: 999.88,
    talents: 999.88,
    miscellaneous: 999.88,
  },
  standard: {
    fashion: 999.88,
    food: 999.88,
    medical: 999.88,
    spa: 999.88,
    gym: 999.88,
    events: 999.88,
    startups: 499.88,
    talents: 499.88,
    miscellaneous: 499.88,
  },
};
