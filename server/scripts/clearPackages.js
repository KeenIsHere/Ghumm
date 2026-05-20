require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function clearPackages() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await mongoose.connection.collection('packages').deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} packages from the database.`);
  await mongoose.disconnect();
}

clearPackages().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
