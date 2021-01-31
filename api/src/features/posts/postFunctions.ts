import * as mongoose from 'mongoose';
import { resolve } from 'url';
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Subscription = mongoose.model('Subscription');

export interface IPost extends mongoose.Document {
    title: string,
    feedId: string,
    flows: string[],
    users: string[],
    thumb: string,
    location: string,
    contents: {}[],
    comment: any[],
    date: any,
    metaData: {},
    likeCount: number,
    likeScore: number,
    viewCount: number,
    private: boolean,
    tagData: {}[]
}

export class PostFunctions {

    errorSend: boolean;
    userId: string;

    constructor() { }

    savePost = (req, res) => {
        const reqPost = req.body.newPost;

        return new Promise(async (resolve, reject) => {
            const newPost: IPost = await new mongoose.Document() as IPost;
            newPost._id = new mongoose.Types.ObjectId();
            newPost.users = reqPost.users;
            const title = reqPost.contents.find((content) => content.mainType === 'TEXT').source;
            newPost.title = title;
            newPost.contents = reqPost.contents;
            newPost.flows = reqPost.flows.map((flowId) => {
                return new mongoose.Types.ObjectId(flowId);
            });
            newPost.date = reqPost.date;
            newPost.private = reqPost.private;
            await newPost.save((err) => {
                if (err) {
                    if (!this.errorSend) {
                        res.status(500).send({ msg: err.message });
                        this.errorSend = true;
                    }
                }

                resolve(' saved post');
            });
        })
    }

    getFeedPosts = async (req, res): Promise<any[]> => {

        let feedIds = req.query.feedId;
        let feedIdArray: string[];
        if(typeof(feedIds) === "string") {
            feedIdArray = [feedIds];
        } else{
            feedIdArray = feedIds;
        }

        const sinceDate = req.query.newSinceDate;
        let searchQuery;

        if (!!sinceDate) {
            searchQuery = [{ $match: { feedId: { $in: feedIdArray }, 'date': { $lte: new Date(sinceDate * 1000) } } }, { $sort: { '_id': -1 } }, { $limit: 51 }]
        } else {
            searchQuery = [{ $match: { feedId: { $in: feedIdArray }, 'date': { $lte: new Date() } } }, { $sort: { '_id': -1 } }, { $limit: 51 }]
        }

        return new Promise(async (resolve, reject) => {
            const posts: any[] = await Post.aggregate(searchQuery);
            if(!!posts){
                resolve(posts);
            } else {
                reject('no posts');
            }
        });
    }

    getFrontPagePosts = (req, res) => {
        // 
        const groups = {};
        const feedSubscriptions = req.body.feedSubscriptions
        feedSubscriptions.forEach((subscription) => {
            // 
            if (!!subscription._group) {
                const groupId = subscription._group._id;
                groups[groupId] = groups[groupId] || [];
                groups[groupId].push(subscription);
            }
        });
        const mappedSubscriptions = Object.keys(groups).map((group) => {
            return groups[group];
        });
        return new Promise(async (resolve, reject) => {
            let facetQuery = {};
            // 
            mappedSubscriptions.forEach((groupFeeds) => {
                const groupFeedIds = groupFeeds.map((groupFeed) => groupFeed._feed.feedId);
                facetQuery = {
                    ...facetQuery,
                    [groupFeeds[0]._group.title]: [{ $match: { feedId: { $in: groupFeedIds } } }, { $sort: { date: -1 } }, { $limit: 7 }]
                }
            })
            const groupFeeds = mappedSubscriptions[0];
            const groupFeedIds = groupFeeds.map((groupFeed) => groupFeed._feed.feedId);
            // 
            // const posts = await Post.find({
            //     feedId: {
            //         $in: groupFeedIds
            //     }
            // }).limit(15);
            // 
            const posts = await Post.aggregate([
                {
                    $facet: facetQuery
                }
            ])
            // 
            resolve(posts);
        })
    }
}