const mongoose = require('mongoose');
require('./../models/Subscription');
require('./../models/User');
require('./../models/Post');
const OAuth = require('oauth');
// const keys = require('./../config/keys');
const Subscription = mongoose.model('Subscription');
const Token = mongoose.model('Token');
const User = mongoose.model('User');
const Post = mongoose.model('Post');

let feedPostRequestCounter = 0;

let feedPostTimer = 30000;

const initFeedPostCollector = () => {
    // first get tokens
    // getFeedPosts();
    // setInterval(() => getFeedPosts(), feedPostTimer);
}

const getUser = async (id) => {
    return await User.findOne({ '_id': id }, (err, user) => {
        if (err) {
            return err;
        }
        if (user) {
            return user;
        } else {
            return null;
        }
    }).catch((error) => {
        if (error) {
            return error;
        }
    });

}

const getFeedPosts = async () => {
    const tokens = await Token.find({}).limit(2);
    let subQueue = [];
    let tooManyRequests = false;
    if (tokens && tokens.length > 0) {
        Subscription.find({ memberCount: { $gt: 0 } }, async (err, subscriptions) => {
            if (err) {
                console.log('something went wrong when searching subscription');
            }
            feedPostTimer = Math.floor((15*60*1000) / Math.floor(900 / subscriptions.length));
            subQueue = subscriptions;
            let tokenIndex = 0;
            if (subQueue.length > 0) {
                
                while (subQueue.length > 0) {
                    let token = tokens[tokenIndex];
                    let currentSubscription = subQueue.shift();

                    if (token && !tooManyRequests) {
                        // make the twitter call
                        const oauth = new OAuth.OAuth(
                            'https://api.twitter.com/oauth/request_token',
                            'https://api.twitter.com/oauth/access_token',
                            process.env.twitterConsumerKey,
                            process.env.twitterConsumerSecret,
                            '1.0A',
                            null,
                            'HMAC-SHA1'
                        );
                        const since_id = (currentSubscription.sinceId) ? currentSubscription.sinceId : '';
                        const max_id = (currentSubscription.maxId) ? currentSubscription.maxId : '';
                        const feed_id = (currentSubscription.feed.feedId) ? currentSubscription.feed.feedId : '';
                        // console.log('currentSubscription.feed', currentSubscription.feed);
                        if (feed_id) {
                            feedPostRequestCounter++;
                            if (since_id) {
                                await oauth.get(
                                    `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${feed_id}&count=10&since_id=${since_id}`,
                                    token.token, //test user token
                                    token.tokenSecret, //test user secret            
                                    (err, data, result) => {
                                        // console.log('with since id', feed_id);
                                        if (err) {
                                            // console.error(err);
                                        } else {
                                            parseTwitterPostsData(currentSubscription, feed_id, data);
                                        }
                                    });

                            } else {
                                await oauth.get(
                                    `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${feed_id}&count=10}`,
                                    '378751182-osBanchlb3uXld55fvplBW6weEChmQBbOrhmPb2r', //test user token
                                    'QxPyt7u4cx25kH0KHnZWCfbk2kxceYALhtyAasw4kNk', //test user secret            
                                    (err, data, result) => {
                                        // console.log('without since id', feed_id);
                                        if (err) {
                                            // console.error(err);
                                        } else {
                                            parseTwitterPostsData(currentSubscription, feed_id, data);
                                        }
                                    });
                            }

                        }
                    } else {
                        // find another way of getting a token
                    }
                }
            }
        }).populate('feed')
            .catch(function (error_open) {

            });
    }

    const parseTwitterPostsData = async (subscription, feedId, data) => {
        let oData = JSON.parse(data); //reverse since the oldest tweets need to be saved first, otherwise next time new tweets will be saved in wrong order after previously saved tweets
        if (oData.length > 0) {
            oData = [...oData].reverse();
        } else {
            return;
        }
        let i = 0;
        let newestPostIndex = oData.length - 1;
        console.log('data length ', oData.length);
        for (let key in oData) {
            // console.log(`if ${oData[key].id_str} !== ${subscription.sinceId}`)
            if (oData[key].id_str !== subscription.sinceId) {
                // console.log('oData[key]', oData[key]);

                let aContent = [];
                if (oData[key].text) {
                    const oText = { "mainType": "TEXT", "type": "TEXT_TWITTER", "source": oData[key].text, "date": null, "location": null, "thumb": null }
                    aContent.push(oText);
                }
                console.log('oData[key]', oData[key]);
                const entities = oData[key].entities;

                if (entities.urls) {
                    console.log('urls: ', entities.urls);
                    const urls = entities.urls;
                    const firstUrl = entities.urls[0];
                    if (firstUrl && firstUrl.expanded_url) {
                        const oLink = { "mainType": "LINK", "type": "LINK_TWITTER", "source": entities.urls[0].expanded_url, "date": null, "location": null, "thumb": null }
                        aContent.push(oLink);
                    }
                }

                if (entities.media) {
                    const oMedia = { "mainType": "IMAGE", "type": "IMAGE_TWITTER", "source": entities.media[0].media_url, "date": null, "location": null, "thumb": null };
                    aContent.push(oMedia);
                }

                const oUser = oData[key].user;
                let metaData = {
                    "authorname": "@" + oUser.screen_name,
                    "authorThumb": oUser.profile_image_url,
                    "name": oUser.name
                };

                const newPost = await new Post();

                newPost.feedId = feedId;
                newPost.date = new Date(oData[key].created_at);
                newPost.contents = aContent;
                newPost.metaData = metaData;
                // save feed post
                await newPost.save((err) => {
                    if (err) {
                        if (err) { console.log(err) }
                    }
                })
            } else {
                console.log(' hey maar, toch n dubbele!', oData[key].text);
            }

            if (i === newestPostIndex) {
                const sinceId = oData[key].id_str;
                if (subscription.sinceId && subscription.sinceId.toString() === sinceId.toString()) {
                    return;
                    // the data set is the same, don't do anything, since the sinceId is the most current
                } else {
                    subscription.sinceId = sinceId;
                    await subscription.save((err) => {
                        if (err) { console.log(err) }
                    })
                }
            };

            i++;
        }

    }
}




module.exports = {
    initFeedPostCollector
}
