import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const feedSchema = new Schema({
    feedName: String,
    feedType: String,
    feedId: String,
    feedIcon: String
});

mongoose.model('Feed', feedSchema);