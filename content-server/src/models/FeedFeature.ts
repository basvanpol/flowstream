import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const feedfeatureSchema = new Schema({
    _feed: { type: Schema.Types.ObjectId, ref: 'Feed' },
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _group: { type: Schema.Types.ObjectId, ref: 'Group' },
    active: {
        type: Boolean,
        default: true
    }
});

mongoose.model('FeedFeature', feedfeatureSchema);