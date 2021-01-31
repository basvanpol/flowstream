import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

const userSchema: Schema = new Schema({
    credits: {
        type: Number,
        default: 0
    },
    local: {
        email: String,
        password: String,
        username: String
    },
    google: {
        googleId: String
    },
    twitter: {
        twitterId: String,
        token: String,
        tokenSecret: String
    },
    isVerified: Boolean,
    forgotPasswordToken: String,
    feedSubscriptions: [{}]
});


// generating a hash
userSchema.methods.generatePasswordHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.generateForgotPasswordToken = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
// userSchema.methods.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

mongoose.model('User', userSchema);