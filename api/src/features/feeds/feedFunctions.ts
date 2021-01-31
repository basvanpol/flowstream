import * as mongoose from 'mongoose';
import { resolve } from 'url';
import { IUser } from '../../services/passport';

const Feed = mongoose.model('Feed');
const FeedFeature = mongoose.model('FeedFeature');
const User = mongoose.model('User');
const Subscription = mongoose.model('Subscription');
const UserFeedSubscription = mongoose.model('UserFeedSubscription');

interface IFeed extends mongoose.Document {
    feedName: string,
    feedType: string,
    feedId: string,
    feedIcon: string
}

interface IFeateredFeed extends mongoose.Document {
    _feed: string,
    _user: string,
    _group: string,
    active: {
        type: boolean,
    }      
}

interface IUserFeedSubscription extends mongoose.Document {
    _feed: string,
    _user: string,
    _group: string
}

interface ISubscription extends mongoose.Document {
    memberCount: number,
    feed: string,
    sinceId: string
}

export class FeedFunctions {

    groups: any[] = [];
    numGroups: number;
    processedGroups: number;
    errorSend: boolean;
    feedObjectId: string;
    userId: string;
    numFeedSubscriptionMutation = 0;
    updatedUser: {} = null;

    constructor() { }

    handleFeed = async (req, res, finalCB) => {
        this.groups = req.body.groups;
        this.numGroups = this.groups.length;
        this.processedGroups = 0;
        this.errorSend = false;
        this.userId = req.body.userId.toString();
        const requestFeed = {
            ...req.body.feed
        };
        
        return new Promise((resolve, reject) => {
            Feed.findOne({ 'feedId': requestFeed.feedId }, async (err, feed) => {
                if (err) {
                    if (!this.errorSend) {
                        reject(err.message);
                        this.errorSend = true;
                        res.status(500).send('Something broke!')
                    }
                }
                if (feed) {
                    this.feedObjectId = feed._id;
                    resolve('found feed');
                } else {
                    // const newFeed = await new Feed();
                    const newFeed: IFeed = new mongoose.Document() as IFeed;
                    newFeed._id = new mongoose.Types.ObjectId();
                    newFeed.feedName = requestFeed.feedName;
                    newFeed.feedId = requestFeed.feedId;
                    newFeed.feedType = req.body.feedType;
                    newFeed.feedIcon = req.body.feedIcon;

                    

                    this.feedObjectId = newFeed._id;
                    await newFeed.save((err) => {
                        if (err) {
                            if (!this.errorSend) {
                                reject(err.message);
                                this.errorSend = true;
                                res.status(500).send({ msg: err.message });
                            }
                        }
                        // new feed saved, add to User
                        resolve('saved new feed');
                    });
                }
            })
        })
    }



    removeFeature = (req, res, finalCB) => {
        return new Promise((resolve, reject) => {
            FeedFeature.find({ '_feed': this.feedObjectId }, async (err, feedFeatures) => {
                if (err) {
                    if (!this.errorSend) {
                        reject(err.message);
                        this.errorSend = true;
                        res.status(500).send('Something broke!')
                    }
                }
                if (feedFeatures && feedFeatures.length > 0) {
                    const toBeRemovedFeaturedFeeds = feedFeatures.filter((feateredFeed: IFeateredFeed) => {
                        return !this.groups.includes(feateredFeed._feed.toString());
                    });
                    const numToBeRemoved = toBeRemovedFeaturedFeeds.length;
                    let numRemoved = 0;
                    toBeRemovedFeaturedFeeds.forEach(async (tbrFeaturedFeed: IFeateredFeed) => {
                        await FeedFeature.remove({ '_id': tbrFeaturedFeed._id }, (err) => {
                            if (err) {
                                if (!this.errorSend) {
                                    reject(err.message);
                                    this.errorSend = true;
                                    res.send(err);
                                }
                            }
                            numRemoved++;
                            if (numRemoved === numToBeRemoved) {
                                resolve('featured feed removed');
                            }
                        });
                    });

                } else {
                    resolve('no featured feeds');
                }
            });
        });
    }

    savefeature = (req, res, finalCB) => {
        return new Promise((resolve, reject) => {
            if (this.groups.length > 0) {
                this.groups.forEach((groupId) => {
                    FeedFeature.findOne({ '_feed': this.feedObjectId, '_group': groupId }, async (err, feedFeature) => {
                        if (err) {
                            if (!this.errorSend) {
                                reject(err.message);
                                this.errorSend = true;
                                res.status(500).send('Something broke!')
                            }
                        }
                        if (feedFeature) {
                            await feedFeature.update({
                                '$set': { 'active': true }
                            }, (err, result) => {
                                if (err) {
                                    if (!this.errorSend) {
                                        reject(err.message);
                                        this.errorSend = true;
                                        res.send(err);
                                    }

                                }
                            });
                            this.processedGroups++;
                            if (this.processedGroups === this.numGroups) {
                                resolve(' saved feature');
                            }
                        } else {
                            const newFeedFeature: IFeateredFeed = await new mongoose.Document() as IFeateredFeed
                            newFeedFeature._id = new mongoose.Types.ObjectId();
                            newFeedFeature._feed = this.feedObjectId;
                            newFeedFeature._user = this.userId;
                            newFeedFeature._group = groupId;
                            await newFeedFeature.save((err) => {
                                if (err) {
                                    if (!this.errorSend) {
                                        res.status(500).send({ msg: err.message });
                                        this.errorSend = true;
                                    }
                                }
                                this.processedGroups++;
                                if (this.processedGroups === this.numGroups) {
                                    this.processedGroups = 0;
                                    resolve(' saved feature');
                                }
                            });
                        }
                    })
                })
            } else {
                resolve(' saved feature');
            }
        })
    }

    handleUser = (req, res, finalCB) => {
        return new Promise((resolve, reject) => {
            User.findOne({ '_id': this.userId }, async (err, user) => {
                if (err) {
                    if (!this.errorSend) {
                        this.errorSend = true;
                        const errorMessage = 'Something broke finding a user';
                        reject(errorMessage)
                        res.status(500).send({ msg: errorMessage });
                    }
                }

                if (user) {
                    // let oldNumFeedSubscriptions = user.feedSubscriptions.length;
                    // let newNumFeedSubscriptions = 0;
                    let userFeedSubscription;
                    this.groups.forEach(async (groupId) => {
                        // add user subscriptions
                        if (req.body.actionType === 'subscribe' || req.body.actionType === 'feature') {
                            // user = await this.subscribeFeedToUser(user, groupId);
                            userFeedSubscription = await this.createUserSubscription(user, groupId, res);
                        } else if (req.body.actionType === 'unsubscribe') {
                            // user = await this.unsubscribeFeedFromUser(user, groupId)
                            userFeedSubscription = await this.removeUserSubscription(user, groupId, res);
                        }
                    });

                    if (req.body.actionType === 'feature') {
                        // if (user.feedSubscriptions && user.feedSubscriptions.length > 0) {
                        //     user.feedSubscriptions = user.feedSubscriptions.filter((feed) => {
                        //         return (feed._feed.toString() === this.feedObjectId.toString() && this.groups.includes(feed._group.toString())) || feed._feed.toString() !== this.feedObjectId.toString();
                        //     })
                        //     newNumFeedSubscriptions = user.feedSubscriptions.length;
                        // }
                    } else if (req.body.actionType === 'subscribe' || req.body.actionType === 'unsubscribe') {
                        // if (user.feedSubscriptions && user.feedSubscriptions.length > 0) {
                        //     const userFeedSubscriptions = user.feedSubscriptions.find((feed) => {
                        //         return (feed._feed.toString() === this.feedObjectId.toString());
                        //     })
                        //     newNumFeedSubscriptions = user.feedSubscriptions.length;
                        // }
                    }

                    // UserSubscription.find({ '_user': this.userId })
                    //     .populate('_feed')
                    //     .populate('_group')
                    //     .exec(async (err, userSubscriptions) => {
                    //         user.feedSubscriptions = [];

                    //         await user.save((err) => {
                    //             if (err) {
                    //                 if (!this.errorSend) {
                    //                     this.errorSend = true;
                    //                     reject(err.message);
                    //                     res.status(500).send({ msg: err.message });
                    //                 }
                    //             }

                    //             // this.numFeedSubscriptionMutation = newNumFeedSubscriptions - oldNumFeedSubscriptions;
                    //             this.updatedUser = user;
                    //             
                    //             resolve('handle user done');
                    //         });

                    //     });

                    resolve('handle user done');

                }
            });
        })
    }

    createUserSubscription(user, groupId, res) {
        
        return new Promise((resolve, reject) => {
            UserFeedSubscription.findOne({ '_feed': this.feedObjectId, '_group': groupId, '_user': this.userId }, async (err, userFeedSubscription) => {
                if (!userFeedSubscription) {
                    const userFeedSubscription: IUserFeedSubscription = await new mongoose.Document() as IUserFeedSubscription;
                    userFeedSubscription._id = new mongoose.Types.ObjectId();
                    userFeedSubscription._feed = this.feedObjectId;
                    userFeedSubscription._user = this.userId;
                    userFeedSubscription._group = groupId;
                    await userFeedSubscription.save((err) => {
                        if (err) {
                            reject('err.message')
                        }
                        resolve(userFeedSubscription);
                    });
                }

            })
        });
    }


    removeUserSubscription(user, groupId, res) {
        return new Promise((resolve, reject) => {
            UserFeedSubscription.deleteOne({ '_feed': this.feedObjectId, '_group': groupId, '_user': this.userId }, {}, async (err) => {
                if (err) {
                    reject('error deleting subscription');
                }
                resolve(null);
            })
        });
    }

    // subscribeFeedToUser(user, groupId) {
    //     if (user.feedSubscriptions) {
    //         let subscribedGroupFeed;
    //         if (user.feedSubscriptions.length > 0) {
    //             subscribedGroupFeed = user.feedSubscriptions.find((feed) => {
    //                 return feed._group.toString() === groupId.toString() && feed._feed.toString() === this.feedObjectId.toString();
    //             })
    //         }
    //         if (subscribedGroupFeed === undefined) {
    //             let newFeed = {
    //                 _group: groupId,
    //                 frontpage: true,
    //                 _feed: this.feedObjectId
    //             }
    //             user.feedSubscriptions.push(newFeed);
    //         }
    //     } else {
    //         user.feedSubscriptions =
    //             [
    //                 {
    //                     _group: groupId,
    //                     frontPage: true,
    //                     _feed: this.feedObjectId
    //                 }
    //             ]

    //     }

    //     return user;
    // }

    // unsubscribeFeedFromUser(user, groupId) {
    //     if (user.feedSubscriptions) {
    //         let subscribedGroupFeedIndex;
    //         if (user.feedSubscriptions.length > 0) {
    //             subscribedGroupFeedIndex = user.feedSubscriptions.findIndex((feed) => {
    //                 return feed._group.toString() === groupId.toString() && feed._feed.toString() === this.feedObjectId.toString();
    //             })
    //         }
    //         if (subscribedGroupFeedIndex !== -1) {
    //             user.feedSubscriptions.splice(subscribedGroupFeedIndex, 1);
    //         }
    //     }
    //     return user;
    // }

    handleSubscription = (req, res, finalCB) => {
        this.processedGroups = 0;
        return new Promise((resolve, reject) => {
            Subscription.findOne({ 'feed': this.feedObjectId }, async (err, subscription) => {
                if (err) {
                    if (!this.errorSend) {
                        this.errorSend = true;
                        reject(err.message);
                        res.status(500).send({ msg: 'Something broke finding a subscription' });
                    }
                }
                if (subscription) {
                    // const memberCount = subscription.memberCount + this.numFeedSubscriptionMutation;
                    const memberCount = 1;
                    await subscription.update({
                        '$set': { 'memberCount': memberCount }
                    }, (err, result) => {
                        if (err) {
                            reject(err.message);
                            res.send(err);

                        }
                    });
                    resolve('subscription updated');
                } else {
                    const newSubscription : ISubscription = await new mongoose.Document() as ISubscription;
                    newSubscription._id = new mongoose.Types.ObjectId();
                    newSubscription.feed = this.feedObjectId;
                    // newSubscription.memberCount = this.numFeedSubscriptionMutation;
                    newSubscription.memberCount = 1;
                    await newSubscription.save((err) => {
                        if (err) {
                            if (!this.errorSend) {
                                this.errorSend = true;
                                reject(err.message);
                                res.status(500).send({ msg: err.message });
                            }
                        }
                        resolve('subscription updated');
                    });
                }
            });
        })

    }

    getAllFeaturedFeeds = (req, res) => {
        this.userId = req.user._id;
        return new Promise((resolve, reject) => {
            FeedFeature.find({ '_user': { $in: [mongoose.Types.ObjectId('5eb1d665ece528543de4dd0f'), mongoose.Types.ObjectId(req.user._id)] }, 'active': true }).
                populate('_feed').
                exec((err, featuredFeeds) => {
                    if (err) {
                        if (!this.errorSend) {
                            reject('Something broke!');
                            res.status(500).send('Something broke!')
                            this.errorSend = true;
                        }
                    }
                    if (featuredFeeds) {

                        User.findOne({ '_id': this.userId })
                            .exec((err, user: IUser) => {
                                if (err) {
                                    if (!this.errorSend) {
                                        reject('Something broke!');
                                        res.status(500).send('Something broke!')
                                        this.errorSend = true;
                                    }
                                }
                                if (user) {
                                    UserFeedSubscription.find({ '_user': req.user.id })
                                        .populate('_feed')
                                        .populate('_group')
                                        .exec(async (err, userSubscriptions) => {
                                            user.feedSubscriptions = userSubscriptions;
                                            // res.status(200).send(currentUser);
                                            this.updatedUser = user;
                                            res.status(200).send({
                                                'message': 'all good in the hood', data: {
                                                    user: this.updatedUser,
                                                    featuredFeeds: featuredFeeds
                                                }
                                            });
                                        });

                                }
                            })

                    } else {
                        const errorMessage = 'Shizzle my nizze, no featured feeds here';
                        reject(errorMessage);
                        res.status(500).send(errorMessage);
                    }
                });
        })
    }

}

module.exports = {
    FeedFunctions
};