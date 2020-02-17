import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
    memberCount: Number,
    feed: { type: Schema.Types.ObjectId, ref: 'Feed' },
    sinceId: String
});

mongoose.model('Subscription', subscriptionSchema);