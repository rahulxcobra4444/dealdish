// ─── DealDish Mock Data ───

export const CUISINES = [
  'Indian', 'Chinese', 'Italian', 'Japanese', 'Mexican',
  'Thai', 'Mediterranean', 'American', 'Korean', 'French'
];

export const mockUsers = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@demo.com', role: 'user', avatar: '' },
  { id: 'u2', name: 'Priya Patel', email: 'priya@restaurant.com', role: 'restaurant_owner', avatar: '' },
  { id: 'u3', name: 'Admin User', email: 'admin@dealdish.com', role: 'admin', avatar: '' },
];

export const mockRestaurants = [
  {
    id: 'r1',
    name: 'Spice Garden',
    slug: 'spice-garden',
    description: 'Authentic North Indian cuisine with a modern twist. Our chefs bring decades of experience to craft memorable dining experiences.',
    cuisine: ['Indian', 'Chinese'],
    address: { street: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
    location: { type: 'Point', coordinates: [72.8777, 19.0760] },
    phone: '+91 98765 43210',
    owner: 'u2',
    coverImage: '',
    rating: 4.5,
    reviewCount: 128,
    priceRange: '$$',
    isVerified: true,
    isActive: true,
    openingHours: '11:00 AM - 11:00 PM',
    activeOfferCount: 3,
  },
  {
    id: 'r2',
    name: 'Sakura Japanese Kitchen',
    slug: 'sakura-japanese-kitchen',
    description: 'Premium sushi, ramen, and traditional Japanese dishes made with imported ingredients and meticulous attention to detail.',
    cuisine: ['Japanese'],
    address: { street: '15 Linking Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
    location: { type: 'Point', coordinates: [72.8361, 19.0640] },
    phone: '+91 98765 43211',
    owner: 'u2',
    coverImage: '',
    rating: 4.8,
    reviewCount: 96,
    priceRange: '$$$',
    isVerified: true,
    isActive: true,
    openingHours: '12:00 PM - 10:30 PM',
    activeOfferCount: 2,
  },
  {
    id: 'r3',
    name: 'Bella Italia',
    slug: 'bella-italia',
    description: 'Rustic Italian dining featuring wood-fired pizzas, handmade pastas, and an extensive wine selection from Tuscany.',
    cuisine: ['Italian', 'Mediterranean'],
    address: { street: '88 Hill Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
    location: { type: 'Point', coordinates: [72.8275, 19.0558] },
    phone: '+91 98765 43212',
    owner: 'u2',
    coverImage: '',
    rating: 4.3,
    reviewCount: 74,
    priceRange: '$$$',
    isVerified: true,
    isActive: true,
    openingHours: '12:00 PM - 11:00 PM',
    activeOfferCount: 2,
  },
  {
    id: 'r4',
    name: 'Thai Orchid',
    slug: 'thai-orchid',
    description: 'Experience the vibrant flavors of Thailand with our authentic curries, stir-fries, and aromatic soups.',
    cuisine: ['Thai'],
    address: { street: '23 SV Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400054' },
    location: { type: 'Point', coordinates: [72.8400, 19.0700] },
    phone: '+91 98765 43213',
    owner: 'u2',
    coverImage: '',
    rating: 4.1,
    reviewCount: 52,
    priceRange: '$$',
    isVerified: false,
    isActive: true,
    openingHours: '11:30 AM - 10:00 PM',
    activeOfferCount: 1,
  },
  {
    id: 'r5',
    name: 'Seoul Kitchen',
    slug: 'seoul-kitchen',
    description: 'Modern Korean BBQ and street food favourites. From crispy fried chicken to bubbling jjigae stews.',
    cuisine: ['Korean'],
    address: { street: '7 Turner Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
    location: { type: 'Point', coordinates: [72.8320, 19.0610] },
    phone: '+91 98765 43214',
    owner: 'u2',
    coverImage: '',
    rating: 4.6,
    reviewCount: 89,
    priceRange: '$$',
    isVerified: true,
    isActive: true,
    openingHours: '12:00 PM - 11:00 PM',
    activeOfferCount: 2,
  },
  {
    id: 'r6',
    name: 'El Fuego',
    slug: 'el-fuego',
    description: 'Bold Mexican cuisine with handmade tortillas, smoky meats, and craft margaritas in a festive ambience.',
    cuisine: ['Mexican'],
    address: { street: '33 Pali Hill', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
    location: { type: 'Point', coordinates: [72.8290, 19.0630] },
    phone: '+91 98765 43215',
    owner: 'u2',
    coverImage: '',
    rating: 4.4,
    reviewCount: 67,
    priceRange: '$$',
    isVerified: true,
    isActive: true,
    openingHours: '12:00 PM - 12:00 AM',
    activeOfferCount: 3,
  },
  {
    id: 'r7',
    name: 'Dragon Wok',
    slug: 'dragon-wok',
    description: 'Sichuan-inspired Chinese cuisine with fiery wok dishes, dim sum, and traditional Cantonese specialties.',
    cuisine: ['Chinese'],
    address: { street: '55 Carter Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400049' },
    location: { type: 'Point', coordinates: [72.8260, 19.0580] },
    phone: '+91 98765 43216',
    owner: 'u2',
    coverImage: '',
    rating: 4.0,
    reviewCount: 103,
    priceRange: '$$',
    isVerified: false,
    isActive: true,
    openingHours: '11:00 AM - 10:30 PM',
    activeOfferCount: 2,
  },
  {
    id: 'r8',
    name: 'Le Petit Bistro',
    slug: 'le-petit-bistro',
    description: 'Charming French bistro offering classic dishes, freshly baked croissants, and an exquisite cheese selection.',
    cuisine: ['French', 'Mediterranean'],
    address: { street: '12 Warden Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400026' },
    location: { type: 'Point', coordinates: [72.8120, 18.9710] },
    phone: '+91 98765 43217',
    owner: 'u2',
    coverImage: '',
    rating: 4.7,
    reviewCount: 45,
    priceRange: '$$$$',
    isVerified: true,
    isActive: true,
    openingHours: '10:00 AM - 10:00 PM',
    activeOfferCount: 1,
  },
  {
    id: 'r9',
    name: 'Burger Republic',
    slug: 'burger-republic',
    description: 'Gourmet burgers, loaded fries, and thick milkshakes. Casual dining at its finest with craft burgers made from scratch.',
    cuisine: ['American'],
    address: { street: '9 Juhu Tara Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400049' },
    location: { type: 'Point', coordinates: [72.8270, 19.0880] },
    phone: '+91 98765 43218',
    owner: 'u2',
    coverImage: '',
    rating: 4.2,
    reviewCount: 156,
    priceRange: '$$',
    isVerified: true,
    isActive: true,
    openingHours: '11:00 AM - 11:30 PM',
    activeOfferCount: 2,
  },
];

export const mockOffers = [
  {
    id: 'o1', restaurant: 'r1', title: '30% Off Dinner Buffet',
    description: 'Enjoy 30% off our legendary dinner buffet featuring 50+ dishes every Friday & Saturday.',
    discountType: 'percentage', discountValue: 30, minOrderValue: 500,
    validFrom: '2026-03-01', validTo: '2026-06-30',
    isActive: true, terms: 'Valid on dine-in only. Cannot be combined with other offers.',
    code: 'SPICE30', views: 1240, claims: 310, category: 'food'
  },
  {
    id: 'o2', restaurant: 'r1', title: 'Buy 1 Get 1 Biryani',
    description: 'Order any biryani and get a second one absolutely free. Perfect for sharing!',
    discountType: 'bogo', discountValue: 100, minOrderValue: 300,
    validFrom: '2026-03-15', validTo: '2026-05-15',
    isActive: true, terms: 'Lower-priced item is free. Dine-in and takeaway.',
    code: 'BOGOBIR', views: 890, claims: 220, category: 'food'
  },
  {
    id: 'o3', restaurant: 'r1', title: 'Free Dessert on Orders Above ₹800',
    description: 'Complimentary Gulab Jamun or Rasmalai on orders above ₹800.',
    discountType: 'freebie', discountValue: 0, minOrderValue: 800,
    validFrom: '2026-04-01', validTo: '2026-06-30',
    isActive: true, terms: 'One free dessert per table.',
    code: '', views: 560, claims: 140, category: 'food'
  },
  {
    id: 'o4', restaurant: 'r2', title: '20% Off Sushi Platters',
    description: 'Get 20% off on all signature sushi platters. Fresh, premium, and unforgettable.',
    discountType: 'percentage', discountValue: 20, minOrderValue: 1000,
    validFrom: '2026-03-01', validTo: '2026-05-31',
    isActive: true, terms: 'Valid Mon-Thu only. Dine-in.',
    code: 'SUSHI20', views: 780, claims: 190, category: 'food'
  },
  {
    id: 'o5', restaurant: 'r2', title: '₹200 Off Ramen Combos',
    description: 'Flat ₹200 off on any ramen combo including a side dish and a drink.',
    discountType: 'flat', discountValue: 200, minOrderValue: 600,
    validFrom: '2026-04-01', validTo: '2026-06-15',
    isActive: true, terms: 'One per customer per visit.',
    code: 'RAMEN200', views: 450, claims: 110, category: 'combo'
  },
  {
    id: 'o6', restaurant: 'r3', title: '25% Off Wood-Fired Pizzas',
    description: 'Quarter off our entire range of authentic wood-fired pizzas. Freshly baked to perfection.',
    discountType: 'percentage', discountValue: 25, minOrderValue: 400,
    validFrom: '2026-03-10', validTo: '2026-05-30',
    isActive: true, terms: 'Dine-in and takeaway. Max discount ₹300.',
    code: 'PIZZA25', views: 920, claims: 280, category: 'food'
  },
  {
    id: 'o7', restaurant: 'r3', title: 'Happy Hour: 40% Off Wines',
    description: '40% off all wines between 4 PM and 7 PM. Curated selection from Italian vineyards.',
    discountType: 'percentage', discountValue: 40, minOrderValue: 0,
    validFrom: '2026-03-01', validTo: '2026-06-30',
    isActive: true, terms: 'Valid 4 PM - 7 PM only. Dine-in.',
    code: '', views: 670, claims: 190, category: 'drinks'
  },
  {
    id: 'o8', restaurant: 'r4', title: '15% Off Entire Menu',
    description: 'Enjoy 15% off on everything at Thai Orchid. From curries to desserts!',
    discountType: 'percentage', discountValue: 15, minOrderValue: 300,
    validFrom: '2026-04-01', validTo: '2026-06-30',
    isActive: true, terms: 'Not valid on holidays.',
    code: 'THAI15', views: 340, claims: 85, category: 'food'
  },
  {
    id: 'o9', restaurant: 'r5', title: 'Korean BBQ Combo: ₹500 Off',
    description: 'Get ₹500 off on our premium Korean BBQ combo for 2 with unlimited sides.',
    discountType: 'flat', discountValue: 500, minOrderValue: 1500,
    validFrom: '2026-03-20', validTo: '2026-05-20',
    isActive: true, terms: 'Advance reservation required. Dine-in only.',
    code: 'KBBQ500', views: 610, claims: 145, category: 'combo'
  },
  {
    id: 'o10', restaurant: 'r5', title: 'Free Kimchi Fried Rice',
    description: 'Complimentary Kimchi Fried Rice on any order above ₹1000.',
    discountType: 'freebie', discountValue: 0, minOrderValue: 1000,
    validFrom: '2026-04-01', validTo: '2026-06-30',
    isActive: true, terms: 'One per table. Dine-in only.',
    code: '', views: 280, claims: 70, category: 'food'
  },
  {
    id: 'o11', restaurant: 'r6', title: 'Taco Tuesday: Buy 2 Get 1',
    description: 'Every Tuesday, buy 2 tacos and get the 3rd one free!',
    discountType: 'bogo', discountValue: 100, minOrderValue: 0,
    validFrom: '2026-03-01', validTo: '2026-06-30',
    isActive: true, terms: 'Every Tuesday. Dine-in and takeaway.',
    code: '', views: 890, claims: 340, category: 'food'
  },
  {
    id: 'o12', restaurant: 'r6', title: '₹100 Off Any Burrito Bowl',
    description: 'Flat ₹100 off on any burrito bowl. Loaded with your favourite fillings.',
    discountType: 'flat', discountValue: 100, minOrderValue: 250,
    validFrom: '2026-04-01', validTo: '2026-05-31',
    isActive: true, terms: 'Max one per order.',
    code: 'BOWL100', views: 420, claims: 105, category: 'food'
  },
  {
    id: 'o13', restaurant: 'r6', title: '50% Off Margaritas',
    description: 'Half price on all margaritas — classic, mango, and jalapeño!',
    discountType: 'percentage', discountValue: 50, minOrderValue: 0,
    validFrom: '2026-04-01', validTo: '2026-06-30',
    isActive: true, terms: 'Dine-in only. Max 3 per person.',
    code: 'MARG50', views: 560, claims: 210, category: 'drinks'
  },
  {
    id: 'o14', restaurant: 'r7', title: '20% Off Dim Sum Brunch',
    description: 'Enjoy 20% off our entire dim sum menu during weekend brunch hours.',
    discountType: 'percentage', discountValue: 20, minOrderValue: 400,
    validFrom: '2026-03-01', validTo: '2026-06-30',
    isActive: true, terms: 'Sat-Sun 11 AM - 3 PM only.',
    code: 'DIM20', views: 710, claims: 175, category: 'food'
  },
  {
    id: 'o15', restaurant: 'r7', title: 'Dragon Special: ₹300 Off Hotpot',
    description: 'Flat ₹300 off on our signature Sichuan Dragon Hotpot for 2.',
    discountType: 'flat', discountValue: 300, minOrderValue: 1200,
    validFrom: '2026-04-01', validTo: '2026-05-31',
    isActive: true, terms: 'Dine-in. Reservation recommended.',
    code: 'HOTPOT', views: 340, claims: 80, category: 'special'
  },
  {
    id: 'o16', restaurant: 'r8', title: '₹500 Off Tasting Menu',
    description: '₹500 off our exclusive 5-course French tasting menu with wine pairing.',
    discountType: 'flat', discountValue: 500, minOrderValue: 3000,
    validFrom: '2026-04-01', validTo: '2026-06-30',
    isActive: true, terms: 'Advance booking required. Min 2 guests.',
    code: 'TASTE500', views: 230, claims: 45, category: 'special'
  },
  {
    id: 'o17', restaurant: 'r9', title: 'Monster Burger Deal: BOGO',
    description: 'Buy any Monster Burger and get a Classic Burger free!',
    discountType: 'bogo', discountValue: 100, minOrderValue: 350,
    validFrom: '2026-03-15', validTo: '2026-05-30',
    isActive: true, terms: 'Dine-in & takeaway. Cannot combine with other offers.',
    code: 'MONSTER', views: 1560, claims: 520, category: 'food'
  },
  {
    id: 'o18', restaurant: 'r9', title: '35% Off Milkshakes',
    description: '35% off all thick milkshakes. Choose from 12 flavors including Oreo, Nutella, and Biscoff.',
    discountType: 'percentage', discountValue: 35, minOrderValue: 0,
    validFrom: '2026-04-01', validTo: '2026-06-30',
    isActive: true, terms: 'All day, every day.',
    code: 'SHAKE35', views: 890, claims: 340, category: 'drinks'
  },
];

export const mockReviews = [
  { id: 'rv1', user: 'u1', restaurant: 'r1', rating: 5, comment: 'Absolutely incredible food. The butter chicken is the best I\'ve ever had!', createdAt: '2026-03-20' },
  { id: 'rv2', user: 'u1', restaurant: 'r2', rating: 4, comment: 'Great sushi, fresh fish. A bit pricey but worth it for special occasions.', createdAt: '2026-03-18' },
  { id: 'rv3', user: 'u1', restaurant: 'r3', rating: 5, comment: 'The wood-fired pizza is absolutely divine. Authentic Italian experience.', createdAt: '2026-03-15' },
  { id: 'rv4', user: 'u1', restaurant: 'r5', rating: 4, comment: 'Korean BBQ was fantastic. Loved the unlimited kimchi sides.', createdAt: '2026-03-10' },
  { id: 'rv5', user: 'u1', restaurant: 'r6', rating: 5, comment: 'Best tacos in the city! The margaritas are top-notch too.', createdAt: '2026-03-08' },
  { id: 'rv6', user: 'u1', restaurant: 'r9', rating: 4, comment: 'Monster burgers live up to the name. Juicy and perfectly cooked.', createdAt: '2026-03-05' },
];

// Helper to get restaurant by id
export function getRestaurantById(id) {
  return mockRestaurants.find(r => r.id === id);
}

// Helper to get offers for a restaurant
export function getOffersByRestaurant(restaurantId) {
  return mockOffers.filter(o => o.restaurant === restaurantId && o.isActive);
}

// Helper to get restaurant for an offer
export function getOfferWithRestaurant(offerId) {
  const offer = mockOffers.find(o => o.id === offerId);
  if (!offer) return null;
  return { ...offer, restaurantData: getRestaurantById(offer.restaurant) };
}

// Helper to filter restaurants
export function filterRestaurants({ cuisine, rating, search, priceRange, verified } = {}) {
  let results = [...mockRestaurants].filter(r => r.isActive);
  
  if (cuisine) {
    const cuisines = cuisine.split(',');
    results = results.filter(r => r.cuisine.some(c => cuisines.includes(c)));
  }
  if (rating) {
    results = results.filter(r => r.rating >= parseFloat(rating));
  }
  if (priceRange) {
    results = results.filter(r => r.priceRange === priceRange);
  }
  if (verified === 'true') {
    results = results.filter(r => r.isVerified);
  }
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(s) ||
      r.description.toLowerCase().includes(s) ||
      r.cuisine.some(c => c.toLowerCase().includes(s))
    );
  }
  return results;
}

// Filter offers
export function filterOffers({ category, discountType, minDiscount, sort } = {}) {
  let results = [...mockOffers].filter(o => o.isActive);
  
  if (category) results = results.filter(o => o.category === category);
  if (discountType) results = results.filter(o => o.discountType === discountType);
  if (minDiscount) results = results.filter(o => o.discountValue >= parseFloat(minDiscount));
  
  if (sort === 'discount') results.sort((a, b) => b.discountValue - a.discountValue);
  else if (sort === 'popular') results.sort((a, b) => b.views - a.views);
  else results.sort((a, b) => new Date(b.validFrom) - new Date(a.validFrom));

  return results.map(o => ({ ...o, restaurantData: getRestaurantById(o.restaurant) }));
}

// Stats for dashboard
export function getDashboardStats(ownerId) {
  const restaurants = mockRestaurants.filter(r => r.owner === ownerId);
  const restaurantIds = restaurants.map(r => r.id);
  const offers = mockOffers.filter(o => restaurantIds.includes(o.restaurant));
  
  return {
    totalRestaurants: restaurants.length,
    totalOffers: offers.length,
    activeOffers: offers.filter(o => o.isActive).length,
    totalViews: offers.reduce((sum, o) => sum + o.views, 0),
    totalClaims: offers.reduce((sum, o) => sum + o.claims, 0),
    restaurants,
    offers,
  };
}
