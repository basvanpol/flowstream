import * as passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import * as mongoose from 'mongoose';
// const keys = require('../config/keys');
const User = mongoose.model('User');
const Token = mongoose.model('Token');

//user here is what came back from the db
//this is used when logging in, after the user has been retrieved from the db. After this the cookie will be set
passport.serializeUser((user, done) => {
    // null here is an error object, but we don't define it
    // the user id is the id from the user from the db, which is not the googleId
    done(null, user.id)
});

// this is called when for example a call is made to the db, get some posts or so. the cookie is send,
// and from that encoded cookie a user is retrieved (magic!, hence the key), after that it is turned into a user model, bam!
// user is known, fancy shanzy, do something
// passport.deserializeUser((id, done) => {
//     User.findById(id)
//         .populate('feedSubscriptions._feed')
//         .populate('feedSubscriptions._group')
//         .exec(async (err, userModel) => {
//             done(null, userModel);
//         })
// });
passport.deserializeUser((id, done) => {
    User.findById(id)
        .exec(async (err, userModel) => {
            done(null, userModel);
        })
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.twitterConsumerKey,
    consumerSecret: process.env.twitterConsumerSecret,
    callbackURL: process.env.twitterCallbackUrl,
    proxy: true
},
    async (twitterToken, twitterTokenSecret, profile, done) => {
        const existingUser = await User.findOne({ 'twitter.twitterId': profile.id })
            .populate('feedSubscriptions._feed')
            .populate('feedSubscriptions._group')
            .exec(async (err, existingUser) => {
                if (err) {
                    console.log(err)
                }
                
                if (existingUser) {
                    //user exists!
                    existingUser.twitter.token = twitterToken;
                    existingUser.twitter.tokenSecret = twitterTokenSecret;
                    existingUser.save();

                    Token.findOne({ _user: existingUser._id, tokenType: 'twitter' }, (err, token) => {
                        if (token) {
                            token.token = twitterToken;
                            token.tokenSecret = twitterTokenSecret;
                            token.save();
                        } else {
                            const newToken = new Token();
                            newToken._user = existingUser._id;
                            newToken.tokenType = 'TWITTER';
                            newToken.token = twitterToken;
                            newToken.tokenSecret = twitterTokenSecret;
                            newToken.save();
                        }
                    })
                    done(null, existingUser);
                } else {
                    //we don't have that user, save the user

                    const newUser = await new User();
                    newUser._id = new mongoose.Types.ObjectId();
                    newUser.twitter.twitterId = profile.id;
                    newUser.twitter.token = twitterToken;
                    newUser.twitter.tokenSecret = twitterTokenSecret;
                    newUser.save();

                    const newToken = new Token();
                    newToken._user = newUser._id;
                    newToken.tokenType = 'TWITTER';
                    newToken.token = twitterToken;
                    newToken.tokenSecret = twitterTokenSecret;
                    newToken.save();

                    done(null, newUser);
                }

            });
    }
));

//      Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
    new GoogleStrategy({
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: '/api/auth/google/callback',
        proxy: true
        //proxy: true needed for deploying on heroku on prod, since it acts as a proxy, and google auth callback will fail. other option is to                       //add a full callback url path instead of relative
    }, async (accessToken, refreshToken, profile, done) => {

        const existingUser = await User.findOne({ 'google.googleId': profile.id });

        if (existingUser) {
            //user exists!
            done(null, existingUser);
        } else {
            //we don't have that user, save the user
            const newUser = await new User();
            newUser.google.googleId = profile.id
            newUser.save();
            done(null, newUser);
        }

    })
);


passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {

    User.findOne({ 'local.email': username }, (err, user) => {

        if (err)
            return done(err);

        if (!user)
            return done(null, false, { authFail: true, wrongPassword: false, message: 'Incorrect username.' });

        if (!user.validPassword(password)) {
            return done(null, false, { authFail: true, wrongPassword: true, message: 'Incorrect password.' });
        }

        return done(null, user);

    });
})
);



