const mongoose = require('mongoose');
var cheerio = require("cheerio");
const Metascraper = require('metascraper')
var request = require('request');
require('./../models/Subscription');
require('./../models/User');
require('./../models/Post');
const OAuth = require('oauth');
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
    console.log('get feed posts')
    const tokens = await Token.find({}).limit(2);
    let subQueue = [];
    let tooManyRequests = false;
    if (tokens && tokens.length > 0) {
        Subscription.find({ memberCount: { $gt: 0 } }, async (err, subscriptions) => {
            if (err) {
                console.log('something went wrong when searching subscription');
            }
            feedPostTimer = Math.floor((15 * 60 * 1000) / Math.floor(900 / subscriptions.length));
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
                                        console.log('with since id', feed_id);
                                        if (err) {
                                            console.error(err);
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
        console.log('parse twitter post')
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

                let aContent = await parseContent(oData, key)

                const newPost = await new Post();

                newPost.feedId = feedId;
                newPost.date = new Date(oData[key].created_at);
                newPost.contents = aContent;
                const oUser = oData[key].user;
                let metaData = {
                    "authorname": "@" + oUser.screen_name,
                    "authorThumb": oUser.profile_image_url,
                    "name": oUser.name
                };
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

const parseContent = (oData: any, key: any) => {
    let promise = new Promise(async (resolve, reject) => {
        const aContent = [];
        const entities = oData[key].entities;
        let scrapedContent
        if (entities.urls) {
            console.log('urls: ', entities.urls);
            const urls = entities.urls;
            const firstUrl = entities.urls[0] ? entities.urls[0].expanded_url : null;
            if (firstUrl) {
                const oLink = { "mainType": "LINK", "type": "LINK_TWITTER", "source": firstUrl, "date": null, "location": null, "thumb": null }
                aContent.push(oLink);
            }
            if(!!firstUrl){
                scrapedContent = await getScrapedContent(firstUrl, "twitter")
            }
        }

        console.log('scrapedContent', scrapedContent);
        const description = (scrapedContent && scrapedContent.description) ? scrapedContent.description : (oData[key].text) ? oData[key].text : '';
        if(!!description){
            const oText = { "mainType": "TEXT", "type": "TEXT_TWITTER", "source": description, "date": null, "location": null, "thumb": null }
            aContent.push(oText);
        }


        const imageUrl = (scrapedContent && scrapedContent.imageUrl) ? scrapedContent.imageUrl : (entities.media && entities.media[0].media_url) ? entities.media[0].media_url : ''

        if (!!imageUrl) {
            const oMedia = { "mainType": "IMAGE", "type": "IMAGE_TWITTER", "source": imageUrl, "date": null, "location": null, "thumb": null };
            aContent.push(oMedia);
        }

        resolve(aContent);

    });

    return promise;


}

const getScrapedContent = async (url, sType) => {

    var imageUrl;
    var title;
    var description;
    var publisher;

    console.log('url', url);
    return new Promise(async (resolve, reject) => {
        const metadata = await Metascraper.scrapeUrl(url);
        if (metadata) {
            if (sType == "twitter") {

                var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                const description = metadata.description;
                var regex = new RegExp(expression);
                let aUrl;
                if (description) {
                    aUrl = description.match(regex);
                }
                if (aUrl && aUrl.length > 0) {
                    const indirectArticleUrl = aUrl[0];

                    const indirectMetadata = await Metascraper.scrapeUrl(indirectArticleUrl);
                    if (indirectMetadata) {
                        imageUrl = indirectMetadata.image;

                    }
                } else {
                    if (metadata.image) {

                        imageUrl = metadata.image;
                    } else {
                        request(url, function (error, response, body) {
                            if (!error) {
                                var $ = cheerio.load(body);
                                var $image;
                                $image = $('meta[property="og:image"]');

                                if ($image != undefined) {
                                    imageUrl = $image.attr('content')

                                } else {
                                    $image = $('article').find('img');
                                    if ($image != undefined) {
                                        imageUrl = getImageUrl($image);
                                    }
                                }
                            } else {

                            }

                        })
                    }
                }
            } else {
                if (metadata.image) {
                    imageUrl = metadata.image;
                } else {
                    request(url, function (error, response, body) {
                        if (!error) {
                            var $ = cheerio.load(body);
                            var $image;
                            $image = $('meta[property="og:image"]');

                            if ($image != undefined) {
                                imageUrl = $image.attr('content')
                            } else {
                                $image = $('article').find('img');
                                if ($image != undefined) {
                                    imageUrl = getImageUrl($image);
                                }
                            }
                        } else {

                        }

                    })
                }
            }
        }
        
        title = (metadata.title) ? metadata.title : '';
        description = (metadata.description) ? metadata.description : '';
        publisher = (metadata.publisher) ? metadata.publisher : '';

        const scrapedContent = {
            title,
            description,
            publisher,
            imageUrl
        }
        resolve(scrapedContent);
    })


}

const getImageUrl = function ($image) {

    var imageUrl = $image.attr('src');
    if (imageUrl == undefined) {
        imageUrl = $image.attr('srcset');
        if (imageUrl != undefined) {
            var aImageUrl = imageUrl.split(',', 1);
            imageUrl = aImageUrl[0].split(" ")[0];
        }
    }

    return imageUrl;
};


module.exports = {
    initFeedPostCollector
};

