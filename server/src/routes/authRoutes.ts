import { nodemailer} from 'nodemailer';
import * as passport from 'passport';
import * as mongoose from 'mongoose';
import *  as crypto from 'crypto';
const path = require('path');
// const keys = require('../config/keys');

const User = mongoose.model('User');
const Token = mongoose.model('Token');
const UserFeedSubscription = mongoose.model('UserFeedSubscription');

export default (app) => {

    this.isExtension = false;


    app.get('/api/auth/twitter', (req, res, next) => {
        this.isExtension = false;
        
        passport.authenticate('twitter', (err, user, info) => {
            
            // res.redirect(`http://localhost:4200/authCallback/authcallbackredirect.html?userId=${req.user._id}`);
        },{ display: 'popup' })(req, res, next);
      });

    app.get('/api/auth/twitterextension', (req, res, next) => {
        this.isExtension = true;
        passport.authenticate('twitter', (err, user, info) => {
            
            // res.redirect(`http://localhost:4200/authCallback/authcallbackredirect.html?userId=${req.user._id}`);
        },{ display: 'popup' })(req, res, next);
      });

    app.get(
        '/api/auth/twitter/callback',
        passport.authenticate('twitter'),
        (req, res) => {
            if(this.isExtension){
                
                // res.redirect(`http://localhost:4200/authCallback/authcallbackredirect.html?userId=${req.user._id}`);
                res.redirect(`http://localhost:4200/static/authcallbackredirect.html?userId=${req.user._id}`);
            } else {
                
                res.redirect(`/connect/?twitter=ok&userId=${req.user._id}`);
            }
        }
    );

    app.get('/api/auth/google', passport.authenticate('google'));

    app.get(
        '/api/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/home')
        }
    );

    // app.post('/api/auth/local/signup', (req, res) => {
    //     User.findOne({'local.email': req.body.email}, async(err, user) => {
    //         if (err) {
    //             res.status(500).send('Something broke!')
    //         }

    //         if (user) {
    //             res.send({signUpFail: true, message: 'that user exists already'});
    //         } else {
    //             const newUser = await new User();

    //             newUser.local.email = req.body.email;
    //             newUser.local.password = newUser.generatePasswordHash(req.body.password);
    //             newUser.isVerified = false;
    //             // send email with activation link
    //             newUser.save((err) => {
    //                 if (err) {
    //                     
    //                     return res.status(500).send({msg: err.message});
    //                 }

    //                 // Create a verification token for this user
    //                 const newToken = new Token();
    //                 newToken._userId = newUser._id;
    //                 newToken.token = crypto.randomBytes(16).toString('hex');
    //                 newToken.tokenType = 'verification';

    //                 // Save the verification token
    //                 newToken.save(function (err) {
    //                     if (err) {
    //                         return res.status(500).send({msg: err.message});
    //                     }

    //                     // Send the email
    //                     var transporter = nodemailer.createTransport({
    //                         service: 'Sendgrid',
    //                         auth: {
    //                             user: keys.sendGridUsername,
    //                             pass: keys.sendGridPassword
    //                         }
    //                     });
    //                     var mailOptions = {
    //                         from: 'basvanpol@gmail.com',
    //                         to: newUser.local.email,
    //                         subject: 'Account Verification Token',
    //                         text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/auth\/local\/authorisation\/' + newToken.token + '.\n'
    //                     };
    //                     transporter.sendMail(mailOptions, function (err) {
    //                         if (err) {
    //                             return res.status(500).send({msg: err.message});
    //                         }
    //                         res.status(200).send('A verification email has been sent to ' + user.email + '.');
    //                     });

    //                     res.status(200).send('A verification email has been sent to ' + newUser.local.email + '.');
    //                 });
    //             });
    //         }
    //     });
    // });


    app.post('/api/auth/local/signin',
        (req, res, next) => {
            passport.authenticate('local-signin', function (err, user, info) {
                if (!user) {
                    if (info.wrongPassword) {
                        return res.status(200).json(info);
                    }
                    return res.status(200).json(info);
                } else {
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }

                        if (user.isVerified === false) {
                            return res.send({isNotVerified: true, message: 'this account needs to be verified first.'});
                        }

                        return res.status(200).json({user});
                    });
                }

            })(req, res, next);
        }
    );

    app.get('/api/auth/local/authorisation/:token',  (req, res) => {
        
        Token.findOne({ token: req.params.token, tokenType: 'verification' }, (err, token) => {
            if (!token) return res.status(400).send({ type: 'not-verified', message: 'We were unable to find a valid token.' });

            // If we found a token, find a matching user
            User.findOne({ _id: token._userId }, function (err, user) {
                // Verify and save the user
                user.isVerified = true;
                user.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    token.remove();
                    res.status(200).send("The account has now been verified. Please log in.");
                });
            });
        })
    });

    app.get('/api/logout', (req, res) => {
        
        req.logout();
        res.status(200).send({'isLoggedOut': true});
    });

    app.get('/api/current_user', (req, res) => {
        let currentUser = (req.user !== undefined )? req.user : null;
        // res.status(200).send(currentUser);
        if(!!currentUser) {
            UserFeedSubscription.find({ '_user': req.user.id })
            .populate('_feed')
            .populate('_group')
            .exec(async (err, userSubscriptions) => {
                currentUser.feedSubscriptions = userSubscriptions;
                res.status(200).send(currentUser);
            });
        }
    });

    // app.post('/api/auth/local/forgotPassword', (req, res, next) => {
    //     const email = req.body.email
    //     User.findOne({'local.email': req.body.email}, async(err, user) => {
    //         if (err) {
    //             res.status(500).send('Something broke!')
    //         }

    //         if (user) {
    //             // Create a verification token for this user
    //             const newToken = new Token();
    //             newToken._userId = user._id;
    //             newToken.token = crypto.randomBytes(16).toString('hex');
    //             newToken.tokenType = 'resetPassword';

    //             newToken.save(function (err) {
    //                 if (err) { return res.status(500).send({ msg: err.message }); }

    //                 //after token has been saved, create email with token in it

    //                 var transporter = nodemailer.createTransport({
    //                     service: 'Sendgrid',
    //                     auth: {
    //                         user: keys.sendGridUsername,
    //                         pass: keys.sendGridPassword
    //                     }
    //                 });
    //                 var mailOptions = {
    //                     from: 'basvanpol@gmail.com',
    //                     to: user.local.email,
    //                     subject: 'Reset your Cycly Password',
    //                     text: 'Hello,\n\n' + 'Reset your password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/resetPassword\/?hash=' + newToken.token + '.\n'
    //                 };
    //                 transporter.sendMail(mailOptions, function (err) {
    //                     if (err) {
    //                         return res.status(500).send({msg: err.message});
    //                     }

    //                     res.send({
    //                         tokenFail: false,
    //                         message: 'An email has been send to ' + user.local.email + 'with instructions to reset your password'
    //                     });
    //                 });


    //             });
    //         } else {
    //             res.send({
    //                 tokenFail: true,
    //                 message: 'that e-mail address doesn\'t exist in our database'
    //             });
    //         }
    //     });
    // });


    app.post('/api/auth/local/resetPassword', (req, res, next) => {
        const token = req.body.token;
        Token.findOne({ token: token, tokenType: 'resetPassword' }, (err, token) => {
            if (!token) {
                res.send({
                    tokenFail: true,
                    message: 'Unable to verify token'
                });
            }

            // If we found a token, find a matching user
            User.findOne({ _id: token._userId }, function (err, user) {
                if(err){
                    res.send({
                        tokenFail: true,
                        message: err.message
                    });
                }
                if(user){
                    // Verify and save the user's new password
                    user.local.password = user.generatePasswordHash(req.body.newPassword);
                    user.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        token.remove();
                        res.send({
                            tokenFail: false,
                            message: 'New password saved.'
                        });
                    });
                }else{
                    res.send({
                        tokenFail: true,
                        message: 'Unable to verify token'
                    });
                }
            });
        })
    });
};