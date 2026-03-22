import mongoose from 'mongoose';

const KeySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    hwid: { type: String, default: null },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Key || mongoose.model('Key', KeySchema);