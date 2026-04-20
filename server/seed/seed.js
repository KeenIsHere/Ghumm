const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

const connectDB = require('../config/db');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Review.deleteMany({});
  await Payment.deleteMany({});
  await Booking.deleteMany({});
  await User.deleteMany({});
  await Package.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin',
    email: 'admin.ghummghamm@gmail.com',
    password: adminPassword,
    role: 'admin',
    isAccountVerified: true,
  });

  // Create test users (Gmail only)
  const userPassword = await bcrypt.hash('user123', 10);
  const users = await User.insertMany([
    {
      name: 'Test User',
      email: 'ghummghamm.user@gmail.com',
      password: userPassword,
      role: 'user',
      isAccountVerified: true,
    },
    {
      name: 'Aasha Gurung',
      email: 'aasha.gurung@gmail.com',
      password: userPassword,
      role: 'user',
      isAccountVerified: true,
    },
    {
      name: 'Prakash Thapa',
      email: 'prakash.thapa@gmail.com',
      password: userPassword,
      role: 'user',
      isAccountVerified: true,
    },
    {
      name: 'Sita Rana',
      email: 'sita.rana@gmail.com',
      password: userPassword,
      role: 'user',
      isAccountVerified: true,
    }
  ]);

  // Create sample packages
  const packages = [
    {
      title: 'Annapurna Base Camp Trek',
      description: 'Experience the majestic Annapurna range on this classic trek to the base camp at 4,130m. Walk through lush rhododendron forests, traditional Gurung villages, and witness breathtaking mountain panoramas.',
      location: 'Pokhara, Nepal',
      difficulty: 'Moderate',
      duration: 10,
      maxGroupSize: 15,
      price: 25000,
      premiumPrice: 22000,
      elevation: '4,130m',
      season: 'March-May, September-November',
      includes: ['Accommodation', 'Meals (Breakfast, Lunch, Dinner)', 'Experienced Guide', 'Porter Service', 'TIMS Card', 'National Park Permit'],
      excludes: ['Travel Insurance', 'Personal Equipment', 'Tips', 'Drinks'],
      itinerary: [
        { day: 1, title: 'Pokhara to Nayapul to Tikhedhunga', description: 'Drive to Nayapul and trek to Tikhedhunga.' },
        { day: 2, title: 'Tikhedhunga to Ghorepani', description: 'Trek through rhododendron forests to Ghorepani.' },
        { day: 3, title: 'Poon Hill and trek to Tadapani', description: 'Early morning hike to Poon Hill for sunrise views.' },
        { day: 4, title: 'Tadapani to Chhomrong', description: 'Trek through forests and terraced fields.' },
        { day: 5, title: 'Chhomrong to Dovan', description: 'Descend and trek along the Modi Khola.' },
        { day: 6, title: 'Dovan to Deurali', description: 'Continue along the valley.' },
        { day: 7, title: 'Deurali to Annapurna Base Camp', description: 'Arrive at the stunning base camp!' },
        { day: 8, title: 'ABC to Bamboo', description: 'Begin descent back.' },
        { day: 9, title: 'Bamboo to Jhinu Danda', description: 'Trek to hot springs.' },
        { day: 10, title: 'Jhinu Danda to Nayapul to Pokhara', description: 'Final trek and drive back.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1585409677983-0f6c41128c6b?w=800',
      images: [],
      availableSlots: 15,
      startDates: [new Date('2026-03-15'), new Date('2026-04-10'), new Date('2026-10-05')],
      createdBy: admin._id
    },
    {
      title: 'Mardi Himal Trek',
      description: 'A hidden gem offering spectacular views of Machhapuchhre (Fishtail) and the Annapurna range. Less crowded than ABC with equally stunning scenery.',
      location: 'Pokhara, Nepal',
      difficulty: 'Moderate',
      duration: 6,
      maxGroupSize: 12,
      price: 15000,
      premiumPrice: 13000,
      elevation: '4,500m',
      season: 'March-May, October-December',
      includes: ['Accommodation', 'Meals', 'Guide', 'Porter', 'Permits'],
      excludes: ['Travel Insurance', 'Personal Equipment', 'Tips'],
      itinerary: [
        { day: 1, title: 'Pokhara to Kande to Deurali', description: 'Drive to Kande and begin trek.' },
        { day: 2, title: 'Deurali to Forest Camp', description: 'Trek through beautiful forests.' },
        { day: 3, title: 'Forest Camp to High Camp', description: 'Ascend to high camp.' },
        { day: 4, title: 'High Camp to Mardi Himal Base Camp', description: 'Summit day with panoramic views.' },
        { day: 5, title: 'Base Camp to Siding', description: 'Descend via alternate route.' },
        { day: 6, title: 'Siding to Pokhara', description: 'Final descent and return.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      images: [],
      availableSlots: 12,
      startDates: [new Date('2026-03-20'), new Date('2026-04-15'), new Date('2026-10-10')],
      createdBy: admin._id
    },
    {
      title: 'Poon Hill Trek',
      description: 'The classic short trek perfect for beginners. Famous for its stunning sunrise views over the Annapurna and Dhaulagiri ranges from Poon Hill viewpoint.',
      location: 'Pokhara, Nepal',
      difficulty: 'Easy',
      duration: 4,
      maxGroupSize: 20,
      price: 10000,
      premiumPrice: 8500,
      elevation: '3,210m',
      season: 'Year-round (best Mar-May, Oct-Nov)',
      includes: ['Accommodation', 'Meals', 'Guide', 'Permits'],
      excludes: ['Travel Insurance', 'Equipment', 'Tips'],
      itinerary: [
        { day: 1, title: 'Pokhara to Nayapul to Tikhedhunga', description: 'Drive and begin gentle trek.' },
        { day: 2, title: 'Tikhedhunga to Ghorepani', description: 'Ascend through forests and villages.' },
        { day: 3, title: 'Poon Hill sunrise and trek to Tadapani', description: 'Early morning Poon Hill visit.' },
        { day: 4, title: 'Tadapani to Nayapul to Pokhara', description: 'Descend and return.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=800',
      images: [],
      availableSlots: 20,
      startDates: [new Date('2026-02-01'), new Date('2026-03-01'), new Date('2026-11-01')],
      createdBy: admin._id
    },
    {
      title: 'Royal Trek',
      description: 'A relaxed trek through picturesque Gurung villages with panoramic views. Named after Prince Charles who trekked this route in 1981.',
      location: 'Pokhara, Nepal',
      difficulty: 'Easy',
      duration: 3,
      maxGroupSize: 20,
      price: 8000,
      premiumPrice: 7000,
      elevation: '1,700m',
      season: 'Year-round',
      includes: ['Accommodation', 'Meals', 'Guide'],
      excludes: ['Tips', 'Personal Items'],
      itinerary: [
        { day: 1, title: 'Pokhara to Bijaypur Danda', description: 'Drive and trek to first camp.' },
        { day: 2, title: 'Bijaypur to Chisapani', description: 'Walk through villages with mountain views.' },
        { day: 3, title: 'Chisapani to Begnas Tal to Pokhara', description: 'Descend to lake and return.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800',
      images: [],
      availableSlots: 20,
      startDates: [new Date('2026-01-15'), new Date('2026-04-01'), new Date('2026-09-15')],
      createdBy: admin._id
    },
    {
      title: 'Annapurna Circuit Trek',
      description: 'The legendary full circuit around the Annapurna massif, crossing the Thorong La Pass at 5,416m. One of the world\'s greatest long-distance treks.',
      location: 'Pokhara, Nepal',
      difficulty: 'Difficult',
      duration: 18,
      maxGroupSize: 10,
      price: 45000,
      premiumPrice: 40000,
      elevation: '5,416m',
      season: 'March-May, October-November',
      includes: ['Accommodation', 'Meals', 'Guide', 'Porter', 'Permits', 'First Aid Kit'],
      excludes: ['Travel Insurance', 'Equipment', 'Emergency Evacuation', 'Tips'],
      itinerary: [
        { day: 1, title: 'Pokhara to Besisahar to Bhulbhule', description: 'Long drive to trailhead.' },
        { day: 2, title: 'Bhulbhule to Chamje', description: 'Trek along Marsyangdi River.' },
        { day: 3, title: 'Chamje to Bagarchap', description: 'Enter Manang district.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      images: [],
      isPremiumOnly: false,
      availableSlots: 10,
      startDates: [new Date('2026-03-25'), new Date('2026-10-15')],
      createdBy: admin._id
    },
    {
      title: 'Dhampus-Sarangkot Panoramic Trek',
      description: 'A short and easy village trek ideal for families and beginners, offering great views of the Annapurna range and Phewa Lake.',
      location: 'Pokhara, Nepal',
      difficulty: 'Easy',
      duration: 2,
      maxGroupSize: 25,
      price: 5000,
      premiumPrice: 4000,
      elevation: '1,600m',
      season: 'Year-round',
      includes: ['Accommodation', 'Meals', 'Guide'],
      excludes: ['Personal Items'],
      itinerary: [
        { day: 1, title: 'Pokhara to Dhampus', description: 'Short drive and trek to Dhampus village.' },
        { day: 2, title: 'Dhampus to Sarangkot to Pokhara', description: 'Trek to viewpoint and return.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800',
      images: [],
      availableSlots: 25,
      startDates: [new Date('2026-01-01'), new Date('2026-06-01'), new Date('2026-12-01')],
      createdBy: admin._id
    },
    {
      title: 'Ghandruk Village Trek',
      description: 'A classic short trek to the beautiful Gurung village of Ghandruk with close-up views of Annapurna South and Machhapuchhre.',
      location: 'Pokhara, Nepal',
      difficulty: 'Easy',
      duration: 3,
      maxGroupSize: 18,
      price: 9000,
      premiumPrice: 8000,
      elevation: '1,940m',
      season: 'Year-round (best Oct-Nov, Mar-Apr)',
      includes: ['Accommodation', 'Meals', 'Guide', 'Permits'],
      excludes: ['Travel Insurance', 'Equipment', 'Tips'],
      itinerary: [
        { day: 1, title: 'Pokhara to Ghandruk', description: 'Drive to Nayapul and trek to Ghandruk.' },
        { day: 2, title: 'Ghandruk to Landruk', description: 'Trek through terraced fields and forests.' },
        { day: 3, title: 'Landruk to Pokhara', description: 'Descend to trailhead and return.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
      images: [],
      availableSlots: 18,
      startDates: [new Date('2026-02-10'), new Date('2026-03-18'), new Date('2026-11-05')],
      createdBy: admin._id
    },
    {
      title: 'Australian Camp Trek',
      description: 'A scenic and easy trek from Pokhara to Australian Camp, perfect for families and first-time trekkers.',
      location: 'Pokhara, Nepal',
      difficulty: 'Easy',
      duration: 2,
      maxGroupSize: 25,
      price: 6000,
      premiumPrice: 5200,
      elevation: '2,060m',
      season: 'Year-round',
      includes: ['Accommodation', 'Meals', 'Guide'],
      excludes: ['Personal Items', 'Tips'],
      itinerary: [
        { day: 1, title: 'Pokhara to Australian Camp', description: 'Drive to Kande and trek to camp.' },
        { day: 2, title: 'Australian Camp to Pokhara', description: 'Descend via Dhampus and return.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800',
      images: [],
      availableSlots: 25,
      startDates: [new Date('2026-01-20'), new Date('2026-04-20'), new Date('2026-10-20')],
      createdBy: admin._id
    },
    {
      title: 'Khopra Danda Trek',
      description: 'A quieter alternative to Poon Hill with dramatic ridge views and the sacred Khayer Lake nearby.',
      location: 'Pokhara, Nepal',
      difficulty: 'Moderate',
      duration: 7,
      maxGroupSize: 12,
      price: 18000,
      premiumPrice: 16000,
      elevation: '3,660m',
      season: 'March-May, October-November',
      includes: ['Accommodation', 'Meals', 'Guide', 'Permits'],
      excludes: ['Travel Insurance', 'Equipment', 'Tips'],
      itinerary: [
        { day: 1, title: 'Pokhara to Ghandruk', description: 'Drive and trek to Ghandruk.' },
        { day: 2, title: 'Ghandruk to Tadapani', description: 'Trek through forests.' },
        { day: 3, title: 'Tadapani to Dobato', description: 'Ascend to ridge villages.' },
        { day: 4, title: 'Dobato to Khopra Danda', description: 'Reach the panoramic ridge.' },
        { day: 5, title: 'Khopra to Swanta', description: 'Descend through remote villages.' },
        { day: 6, title: 'Swanta to Ghorepani', description: 'Trek via traditional trails.' },
        { day: 7, title: 'Ghorepani to Pokhara', description: 'Return to Pokhara.' }
      ],
      coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
      images: [],
      availableSlots: 12,
      startDates: [new Date('2026-03-05'), new Date('2026-04-25'), new Date('2026-10-01')],
      createdBy: admin._id
    }
  ];

  const createdPackages = await Package.insertMany(packages);

  // Create sample bookings (all pending) and payments (all pending)
  const sampleBookings = [
    {
      user: users[0]._id,
      package: createdPackages[0]._id,
      startDate: new Date('2026-04-10'),
      numberOfPeople: 2,
      totalPrice: createdPackages[0].price * 2,
      status: 'pending',
      paymentStatus: 'unpaid',
      specialRequests: 'Vegetarian meals preferred.',
      contactPhone: '+977-9800000001'
    },
    {
      user: users[1]._id,
      package: createdPackages[2]._id,
      startDate: new Date('2026-03-01'),
      numberOfPeople: 3,
      totalPrice: createdPackages[2].price * 3,
      status: 'pending',
      paymentStatus: 'unpaid',
      specialRequests: '',
      contactPhone: '+977-9800000002'
    },
    {
      user: users[2]._id,
      package: createdPackages[5]._id,
      startDate: new Date('2026-06-01'),
      numberOfPeople: 1,
      totalPrice: createdPackages[5].price,
      status: 'pending',
      paymentStatus: 'unpaid',
      specialRequests: 'Early start requested.',
      contactPhone: '+977-9800000003'
    },
    {
      user: users[3]._id,
      package: createdPackages[7]._id,
      startDate: new Date('2026-10-20'),
      numberOfPeople: 2,
      totalPrice: createdPackages[7].price * 2,
      status: 'pending',
      paymentStatus: 'unpaid',
      specialRequests: '',
      contactPhone: '+977-9800000004'
    }
  ];

  const createdBookings = await Booking.insertMany(sampleBookings);

  const samplePayments = createdBookings.map((booking) => ({
    booking: booking._id,
    user: booking.user,
    amount: booking.totalPrice,
    method: 'esewa',
    transactionId: `SEED-${booking._id}`,
    status: 'pending'
  }));

  await Payment.insertMany(samplePayments);

  console.log('Seed data inserted successfully!');
  console.log('Admin: admin.ghummghamm@gmail.com / admin123');
  console.log('Users (all Gmail): ghummghamm.user@gmail.com, aasha.gurung@gmail.com, prakash.thapa@gmail.com, sita.rana@gmail.com / user123');
  process.exit();
};

seedData();
