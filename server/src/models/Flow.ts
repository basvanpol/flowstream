import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const flowSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    flowViewType: String
});

mongoose.model('Flow', flowSchema);