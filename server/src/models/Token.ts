import * as mongoose from 'mongoose';
const { Schema } = mongoose;
const tokenSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: String,
    tokenSecret: String,
    tokenType: String
});

mongoose.model('Token', tokenSchema);
``