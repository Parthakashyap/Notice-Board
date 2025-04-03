import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  position: { type: String, required: true },
  color1: { type: String, required: true },
  color2: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
});

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema); 