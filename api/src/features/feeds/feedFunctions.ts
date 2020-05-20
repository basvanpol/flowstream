import * as mongoose from 'mongoose';
import { resolve } from 'url';
import { UserRoles } from '../../tsmodels/userRoles';
const Feed = mongoose.model('Feed');
const FeedFeature = mongoose.model('FeedFeature');
const User = mongoose.model('User');
const Subscription = mongoose.model('Subscription');
const UserFeedSubscription = mongoose.model('UserFeedSubscription');

export class FeedFunctions {

    groups: any[] = [];
    numGroups: number;
    processedGroups: number;
    errorSend: boolean;
    feedObjectId: string;
    userId: string;
    numFeedSubscriptionMutation = 0;
    updatedUser: {} = null;
    isUserFeedAdmin = false;
    adminUserIds: number[];

    constructor() { }

    handleFeed = async (req, res, finalCB) => {
        this.groups = req.body.groups;
        this.numGroups = this.groups.length;
        this.processedGroups = 0;
        this.errorSend = false;
        this.userId = req.body.userId.toString();
        this.isUserFeedAdmin = (req.user && req.user.permissions && req.user.permissions.feeds && req.user.permissions.feeds === UserRoles.ADMIN);
        const adminUsers = await User.find({ 'permissions.feeds': UserRoles.ADMIN }, (err, users) => {
            if (err) {
                res.status(500).send('Something broke!')
            }
            return users;
        });
        this.adminUserIds = adminUsers.map(adminUser => adminUser._id);
        
        
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
                    const newFeed = await new Feed();
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
        return new Promise(async (resolve, reject) => {
            const userId = req.user._id;

            let userIds = [];
            if (!!this.isUserFeedAdmin) {
                userIds = [...this.adminUserIds, userId]
            } else {
                userIds = [userId];
            }
            // if user is not a feed admin, retrieve just his own featured feeds

            FeedFeature.find({ '_user': { $in: userIds }, '_feed': this.feedObjectId }, async (err, feedFeatures) => {
                if (err) {
                    if (!this.errorSend) {
                        reject(err.message);
                        this.errorSend = true;
                        res.status(500).send('Something broke!')
                    }
                }
                if (feedFeatures && feedFeatures.length > 0) {
                    const toBeRemovedFeaturedFeeds = feedFeatures.filter((feateredFeed) => {
                        return !this.groups.includes(feateredFeed._group.toString());
                    });
                    const numToBeRemoved = toBeRemovedFeaturedFeeds.length;
                    if (numToBeRemoved > 0) {
                        let numRemoved = 0;
                        toBeRemovedFeaturedFeeds.forEach(async (tbrFeaturedFeed) => {
                            await FeedFeature.remove({ '_id': tbrFeaturedFeed._id }, (err, result) => {
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
                        resolve('nothing to remove');
                    }
                } else {
                    resolve('no featured feeds');
                }
            });
        });
    }

    savefeature = (req, res, finalCB) => {
        return new Promise((resolve, reject) => {
            if (this.groups.length > 0) {
                const userId = req.user._id;
                this.groups.forEach((groupId) => {
                    let userIds;
                    if (!this.isUserFeedAdmin) {
                        userIds = [...this.adminUserIds, userId]
                    } else {
                        userIds = [...this.adminUserIds]
                    }
                    /*
                    * if user is feed admin, search all featuredfeeds created by feedadmin, otherwise search all featuredfeeds created by feedadmins, AND user
                    */
                    FeedFeature.findOne({ '_user': { $in: userIds }, '_feed': this.feedObjectId, '_group': groupId }, async (err, feedFeature) => {
                        if (err) {
                            if (!this.errorSend) {
                                reject(err.message);
                                this.errorSend = true;
                                res.status(500).send('Something broke!')
                            }
                        }
                        if (feedFeature) {
                            console.log('found feedFeature!', feedFeature);
                            try {
                                await feedFeature.updateOne({ _id: feedFeature._id }, { $set: { 'active': true } });
                             } catch (e) {
                                if (!this.errorSend) {
                                    reject(err.message);
                                    this.errorSend = true;
                                    res.send(err);
                                }
                             }
                        
                            this.processedGroups++;
                            if (this.processedGroups === this.numGroups) {
                                resolve(' saved feature');
                            }
                        } else {
                            const newFeedFeature = await new FeedFeature();
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
                    const userFeedSubscription = await new UserFeedSubscription();
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
            UserFeedSubscription.deleteOne({ '_feed': this.feedObjectId, '_group': groupId, '_user': this.userId }, async (err) => {
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
                    const newSubscription = await new Subscription();
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

    getAllFeeds = (req, res) => {
        this.userId = req.user._id;
        return new Promise(async (resolve, reject) => {
            /**
             * first, find all users that have admin permissions for feeds.
             */
            const adminUsers = await User.find({ 'permissions.feeds': UserRoles.ADMIN }, (err, users) => {
                if (err) {
                    res.status(500).send('Something broke!')
                }
                return users;
            })
            let adminUserIds = adminUsers.map(adminUser => adminUser._id);
            let userIds = [];
            if (!!adminUserIds && adminUserIds.length > 0) {
                userIds = [...adminUserIds, req.user._id]
            } else {
                userIds = [req.user._id];
            }

            FeedFeature.find({ '_user': { $in: userIds }, 'active': true }).
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
                        const mappedFeatureFeeds = featuredFeeds.map(featuredFeed => {
                            return {
                                ...featuredFeed,
                                canUserEdit: ((this.isUserFeedAdmin && this.adminUserIds.includes(featuredFeed._user) ) || featuredFeed._user === this.userId)
                            }
                        })
                        User.findOne({ '_id': this.userId })
                            .exec((err, user) => {
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
                                                    featuredFeeds: [...mappedFeatureFeeds]
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