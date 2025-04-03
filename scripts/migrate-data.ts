const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Notice Schema
const NoticeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  position: { type: String, required: true },
  color1: { type: String, required: true },
  color2: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
});

const Notice = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);

async function migrateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read the existing notices from JSON file
    const dataFilePath = path.join(process.cwd(), 'data', 'notices.json');
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const notices = JSON.parse(fileData);

    // Clear existing notices in MongoDB
    await Notice.deleteMany({});
    console.log('Cleared existing notices');

    // Insert all notices
    await Notice.insertMany(notices);
    console.log('Successfully migrated notices to MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData(); 