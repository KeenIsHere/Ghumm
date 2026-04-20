require('dotenv').config();
const mongoose = require('mongoose');
const PremiumTier = require('../models/PremiumTier');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error('DB Connection error:', err.message);
    process.exit(1);
  }
};

const premiumTiers = [
  {
    name: 'silver',
    displayName: 'Silver',
    monthlyPrice: 1300,
    annualPrice: 13000,
    discount: 10,
    priorityDays: 2,
    rewardMultiplier: 1,
    exclusivePackageCount: 0,
    cancellationDays: 0,
    insuranceIncluded: false,
    supportLevel: 'standard',
    features: [
      '10% discount on all packages',
      'Priority booking 2 days in advance',
      '1x reward points on bookings',
      'Email support',
      'Standard booking policies'
    ],
    description: 'Perfect for casual trekkers. Get discounts on all packages.'
  },
  {
    name: 'gold',
    displayName: 'Gold',
    monthlyPrice: 1700,
    annualPrice: 17000,
    discount: 15,
    priorityDays: 5,
    rewardMultiplier: 2,
    exclusivePackageCount: 2,
    cancellationDays: 3,
    insuranceIncluded: false,
    supportLevel: 'priority',
    features: [
      '15% discount on all packages',
      'Priority booking 5 days in advance',
      '2x reward points on bookings',
      'Chat support (24/7)',
      'Access to 2 exclusive premium packages',
      'Flexible cancellation (3 days)',
      'Monthly surprise discounts'
    ],
    description: 'Great value for regular trekkers. Get better discounts and exclusive packages.'
  },
  {
    name: 'platinum',
    displayName: 'Platinum',
    monthlyPrice: 2500,
    annualPrice: 25000,
    discount: 20,
    priorityDays: 999,
    rewardMultiplier: 3,
    exclusivePackageCount: 5,
    cancellationDays: 7,
    insuranceIncluded: true,
    supportLevel: 'vip',
    features: [
      '20% discount on all packages',
      'Unlimited priority booking',
      '3x reward points on bookings',
      'VIP 24/7 dedicated support',
      'Access to all exclusive premium packages (5+)',
      'Flexible cancellation (7 days)',
      'Monthly loyalty bonuses',
      'Included travel & accident insurance',
      'Priority customer service',
      'Early access to new packages',
      'Special birthday discounts'
    ],
    description: 'Ultimate experience for adventure enthusiasts. Maximum benefits and VIP treatment.'
  }
];

const seedPremiumTiers = async () => {
  try {
    await connectDB();

    // Clear existing tiers
    await PremiumTier.deleteMany({});
    console.log('Cleared existing premium tiers');

    // Insert new tiers
    await PremiumTier.insertMany(premiumTiers);
    console.log('✅ Premium tiers seeded successfully');

    // Show seeded data
    const tiers = await PremiumTier.find();
    console.log('\nSeeded tiers:');
    tiers.forEach(tier => {
      console.log(`- ${tier.displayName} (₹${tier.monthlyPrice}/month or ₹${tier.annualPrice}/year)`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedPremiumTiers();
