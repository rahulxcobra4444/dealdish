const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Offer = require('../models/Offer');

const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Offer.deleteMany({});

    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@dealdish.com',
      password: 'admin123456',
      role: 'admin',
      isVerified: true
    });

    console.log('Creating restaurant owners...');
    const owners = await User.create([
      { name: 'Rajesh Kumar', email: 'rajesh@gmail.com', password: 'password123', role: 'owner', isVerified: true },
      { name: 'Priya Sharma', email: 'priya@gmail.com', password: 'password123', role: 'owner', isVerified: true },
      { name: 'Amit Singh', email: 'amit@gmail.com', password: 'password123', role: 'owner', isVerified: true },
      { name: 'Sunita Devi', email: 'sunita@gmail.com', password: 'password123', role: 'owner', isVerified: true },
      { name: 'Mohan Das', email: 'mohan@gmail.com', password: 'password123', role: 'owner', isVerified: true }
    ]);

    console.log('Creating restaurants...');
    const restaurants = await Restaurant.create([
      {
        name: 'Spice Garden',
        slug: 'spice-garden',
        owner: owners[0]._id,
        description: 'Authentic North Indian cuisine in the heart of Siliguri',
        cuisine: ['North Indian', 'Mughlai'],
        address: { street: 'Hill Cart Road', city: 'Siliguri', state: 'West Bengal', pincode: '734001' },
        location: { type: 'Point', coordinates: [88.4338, 26.7271] },
        phone: '9800000001',
        isVerified: true,
        isActive: true,
        rating: 4.2,
        reviewCount: 45,
        priceRange: 'moderate'
      },
      {
        name: 'Dragon Palace',
        slug: 'dragon-palace',
        owner: owners[1]._id,
        description: 'Best Chinese and Tibetan food in Siliguri',
        cuisine: ['Chinese', 'Tibetan'],
        address: { street: 'Sevoke Road', city: 'Siliguri', state: 'West Bengal', pincode: '734001' },
        location: { type: 'Point', coordinates: [88.4200, 26.7300] },
        phone: '9800000002',
        isVerified: true,
        isActive: true,
        rating: 4.5,
        reviewCount: 62,
        priceRange: 'moderate'
      },
      {
        name: 'Burger Hub',
        slug: 'burger-hub',
        owner: owners[2]._id,
        description: 'Juicy burgers and fast food for everyone',
        cuisine: ['Fast Food', 'American'],
        address: { street: 'Pradhan Nagar', city: 'Siliguri', state: 'West Bengal', pincode: '734003' },
        location: { type: 'Point', coordinates: [88.4150, 26.7350] },
        phone: '9800000003',
        isVerified: true,
        isActive: true,
        rating: 4.0,
        reviewCount: 38,
        priceRange: 'budget'
      },
      {
        name: 'Tandoor Express',
        slug: 'tandoor-express',
        owner: owners[3]._id,
        description: 'Fresh tandoor items and Indian breads',
        cuisine: ['North Indian', 'Punjabi'],
        address: { street: 'Hakimpara', city: 'Siliguri', state: 'West Bengal', pincode: '734001' },
        location: { type: 'Point', coordinates: [88.4400, 26.7200] },
        phone: '9800000004',
        isVerified: true,
        isActive: true,
        rating: 4.3,
        reviewCount: 51,
        priceRange: 'budget'
      },
      {
        name: 'The Sweet Corner',
        slug: 'the-sweet-corner',
        owner: owners[4]._id,
        description: 'Traditional Bengali sweets and snacks',
        cuisine: ['Bengali', 'Desserts'],
        address: { street: 'Bidhan Road', city: 'Siliguri', state: 'West Bengal', pincode: '734001' },
        location: { type: 'Point', coordinates: [88.4250, 26.7150] },
        phone: '9800000005',
        isVerified: true,
        isActive: true,
        rating: 4.7,
        reviewCount: 89,
        priceRange: 'budget'
      }
    ]);

    console.log('Creating offers...');
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await Offer.create([
      {
        title: '30% Off on All Curries',
        description: 'Get 30% discount on all curry dishes every weekday',
        restaurant: restaurants[0]._id,
        discountType: 'percentage',
        discountValue: 30,
        validFrom: now,
        validTill: nextMonth,
        isActive: true,
        tags: ['curry', 'discount', 'weekday']
      },
      {
        title: 'Buy 1 Get 1 Free Momos',
        description: 'Order any plate of momos and get another plate free',
        restaurant: restaurants[1]._id,
        discountType: 'bogo',
        discountValue: 0,
        validFrom: now,
        validTill: nextMonth,
        isActive: true,
        tags: ['momos', 'bogo', 'chinese']
      },
      {
        title: 'Burger + Fries Combo at Rs.149',
        description: 'Any burger with fries and a cold drink at flat Rs.149',
        restaurant: restaurants[2]._id,
        discountType: 'flat',
        discountValue: 149,
        originalPrice: 250,
        offerPrice: 149,
        validFrom: now,
        validTill: nextMonth,
        isActive: true,
        tags: ['burger', 'combo', 'fast food']
      },
      {
        title: '2 Tandoori Rotis Free with any Main Course',
        description: 'Order any main course and get 2 tandoori rotis absolutely free',
        restaurant: restaurants[3]._id,
        discountType: 'freeitem',
        discountValue: 0,
        validFrom: now,
        validTill: nextMonth,
        isActive: true,
        tags: ['roti', 'free', 'tandoor']
      },
      {
        title: 'Rs.50 Off on Sweets Box above Rs.300',
        description: 'Get Rs.50 off when you order any sweets box worth Rs.300 or more',
        restaurant: restaurants[4]._id,
        discountType: 'flat',
        discountValue: 50,
        validFrom: now,
        validTill: nextMonth,
        isActive: true,
        tags: ['sweets', 'bengali', 'discount']
      },
      {
        title: '20% Off on Weekend Brunch',
        description: 'Enjoy 20% off on our special weekend brunch menu',
        restaurant: restaurants[0]._id,
        discountType: 'percentage',
        discountValue: 20,
        validFrom: now,
        validTill: nextMonth,
        isActive: true,
        tags: ['brunch', 'weekend', 'discount']
      },
      {
        title: 'Free Soup with Fried Rice',
        description: 'Order any fried rice and get a free bowl of soup',
        restaurant: restaurants[1]._id,
        discountType: 'freeitem',
        discountValue: 0,
        validFrom: now,
        validTill: nextMonth,
        isActive: true,
        tags: ['soup', 'free', 'chinese']
      }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log(`Admin email: admin@dealdish.com`);
    console.log(`Admin password: admin123456`);
    console.log(`Restaurants created: ${restaurants.length}`);
    console.log(`Owners created: ${owners.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();