import * as mongoose from 'mongoose';
import { Schema} from 'mongoose';

const tokenSchema: Schema = new Schema({
    _user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: String,
    tokenSecret: String,
    tokenType: String
});

mongoose.model('Token', tokenSchema);
``