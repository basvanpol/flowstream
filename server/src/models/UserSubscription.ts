import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const userSubscriptionSchema = new Schema({
    _feed: { type: Schema.Types.ObjectId, ref: 'Feed' },
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _group: { type: Schema.Types.ObjectId, ref: 'Group' },
});

mongoose.model('UserSubscription', userSubscriptionSchema);