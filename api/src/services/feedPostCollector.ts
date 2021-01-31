const mongoose = require('mongoose');
var cheerio = require("cheerio");
const Metascraper = require('metascraper')
var request = require('request');
require('./../dbmodels/Subscription');
require('./../dbmodels/User');
require('./../dbmodels/Post');
const OAuth = require('oauth');
const Subscription = mongoose.model('Subscription');
const Token = mongoose.model('Token');
const User = mongoose.model('User');
const Post = mongoose.model('Post');


let feedPostRequestCounter = 0;

let feedPostTimer = 30000;

let latestTenFeedPosts = {};

const initFeedPostCollector = () => {
    // first get tokens
    getFeedPosts();
    setInterval(() => getFeedPosts(), feedPostTimer);
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
    if (tokens && tokens.length > 0) {
        // console.log('token!', tokens);
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

                    if (token) {
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
                                            console.error(err);
                                        } else {
                                            parseTwitterPostsData(currentSubscription, feed_id, data);
                                        }
                                    });

                            } else {
                                await oauth.get(
                                    `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${feed_id}&count=10}`,
                                    token.token, //test user token
                                    token.tokenSecret, //test user secret              
                                    (err, data, result) => {
                                        // console.log('without since id', feed_id);
                                        if (err) {
                                            console.error(err);
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

        // compare current text with previous post text to undouble on a basic level.
        // TODO: there should be a cleanup process that does a 'fulltext' search and undoubles in that way

        let previousPostText;
        let currentPostText;

        if (!latestTenFeedPosts[feedId]) {
            latestTenFeedPosts[feedId] = [];
        }

        for (let key in oData) {

            // console.log('postData', oData[key]);
            const postData = oData[key];

            currentPostText = postData.text.substring(0, 10);

            let latestTenFeedPostsArray = latestTenFeedPosts[feedId];

            if (!latestTenFeedPostsArray.includes(currentPostText)) {
                // console.log('latestFeedPosts[feedId]', latestTenFeedPosts[feedId]);
                /**
                 *  save latest ten feed posts' text to undouble trigger posts (publishers tend to send out the latest posts multiple times in a short period)
                 */
                latestTenFeedPosts[feedId].unshift(currentPostText);
                if (latestTenFeedPosts[feedId].length > 10) {
                    latestTenFeedPosts[feedId].length = 10;
                }

                /**
                *  check for retweets, ignore them.
                */

                if (postData.id_str !== subscription.sinceId) {
                    let aContent
                    try {
                        aContent = await parseContent(oData, key)
                    }
                    catch (error) {
                        console.error(error);
                        aContent = [];
                    }

                    const newPost = await new Post();
                    newPost.feedId = feedId;
                    newPost.date = new Date(postData.created_at);
                    newPost.contents = aContent;
                    newPost.title = oData[key].text;
                    const oUser = oData[key].user;
                    let metaData = {
                        "authorname": "@" + oUser.screen_name,
                        "authorThumb": oUser.profile_image_url,
                        "name": oUser.name
                    };
                    newPost.metaData = metaData;
                    // save new post, but only if there's content. RT's often don't have any content, so don't save them.
                    if (newPost.contents.length > 0) {
                        // console.log('save it', newPost);
                        await newPost.save((err) => {
                            if (err) {
                                if (err) { 
                                    // console.log(err) 
                                }
                            }
                        })
                    } else {
                        // console.log('dont save it', newPost);
                    }
                } else {
                    // console.log(' hey maar, toch n dubbele!', postData.text);
                }
            }

            if (i === newestPostIndex) {

                const sinceId = postData.id_str;
                /// console.log('sinceId', sinceId);
                /// console.log('postData', postData);
                /// console.log('new date', new Date(postData.created_at).getTime())
                if (!subscription.sinceId || (subscription.sinceId && subscription.sinceId.toString() !== sinceId.toString())) {
                    subscription.sinceId = sinceId;
                    await subscription.save((err) => {
                        if (err) { 
                            // console.log(err) 
                        }
                    })
                }
            };

            i++;
        }

    }
}

const parseContent = (oData: any, key: any) => {
    return new Promise(async (resolve, reject) => {
        let aContent = [];
        const entities = oData[key].entities;
        let imageFound = false;
        let scrapedContent;

        if (entities.urls) {
            const urls = entities.urls;
            const firstUrl = entities.urls[0] ? entities.urls[0].expanded_url : null;
            if (!!firstUrl) {
                const oLink = { "mainType": "LINK", "type": "LINK_TWITTER", "source": firstUrl, "date": null, "location": null, "thumb": null }
                aContent.push(oLink);
                try {
                    scrapedContent = await getScrapedContent(firstUrl, "twitter")
                    /// console.log('scrapedContent', scrapedContent);
                }
                catch (error) {
                    console.error(error);
                    reject('Parse Error');
                }
            }
        }

        const description = (scrapedContent && scrapedContent.description) ? scrapedContent.description : '';
        if (!!description) {
            const oText = { "mainType": "TEXT", "type": "TEXT_TWITTER", "source": description, "date": null, "location": null, "thumb": null }
            aContent.push(oText);
        }


        const imageUrl = (scrapedContent && scrapedContent.imageUrl) ? scrapedContent.imageUrl : '';

        if (!!imageUrl) {
            imageFound = true;
            const oMedia = { "mainType": "IMAGE", "type": "IMAGE_TWITTER", "source": imageUrl, "date": null, "location": null, "thumb": null };
            aContent.push(oMedia);
        }

        if (aContent.length > 0 && !!imageFound) {

            // only show title when there's already content, we want to return an empty array when no other content is found, to ignore RT's without images
            const title = (scrapedContent && scrapedContent.title) ? scrapedContent.title : (oData[key] && oData[key].text) ? oData[key].text : '';
            if (!!title) {
                const oTitleText = { "mainType": "TEXT", "type": "TEXT_TITLE", "source": title, "date": null, "location": null, "thumb": null }
                aContent.unshift(oTitleText);
            }
        } else {
            aContent = [];
        }

        /// console.log('resolve');
        resolve(aContent);

    });


}

const getScrapedContent = async (url, sType) => {

    var imageUrl;
    var title;
    var description;
    var publisher;

    return new Promise(async (resolve, reject) => {
        let metadata;
        try {
            metadata = await Metascraper.scrapeUrl(url);
        } catch (e) {
            /// console.log('meta data error');
            return reject('meta data error');
        }
        if (metadata) {
            // console.log('meta', metadata);
            let redirectedMetadata;
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

                    try {
                        /// console.log('redirected media', indirectArticleUrl);
                        Metascraper.scrapeUrl(indirectArticleUrl).then(value => {
                            // console.log('yeah!', value);
                            redirectedMetadata = value;
                        }, reason => {
                            // console.log('oh no!');
                        });
                    }
                    catch (e) {
                        // console.log('meta scraper error', e);
                        return reject('meta scraper error');
                    }

                    // console.log('redirectedMetadata', redirectedMetadata);

                    if (redirectedMetadata) {
                        imageUrl = redirectedMetadata.image;
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
                                return reject('scrape meta cheerio error');
                            }

                        })
                        // imageUrl = "";
                    }
                }
            } else {
                if (metadata.image) {
                    imageUrl = metadata.image;
                } else {
                    // imageUrl = "";
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
                            return reject('scrape meta cheerio error 2');
                        }
                    })
                }
            }


            title = (redirectedMetadata && redirectedMetadata.title) ? redirectedMetadata.title : (metadata && metadata.title) ? metadata.title : '';
            description = (redirectedMetadata && redirectedMetadata.description) ? redirectedMetadata.description : (metadata && metadata.description) ? metadata.description : '';
            publisher = (metadata.publisher) ? metadata.publisher : '';
        } else {
            // no meta data or incorrect url
            // console.log('no meta data');
            return reject('no meta');
        }

        const scrapedContent = {
            title,
            description,
            publisher,
            imageUrl
        }
        /// console.log('resolve meta');
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

