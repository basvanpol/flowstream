import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const groupSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    icon: {}
});

mongoose.model('Group', groupSchema);