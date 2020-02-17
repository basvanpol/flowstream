import * as mongoose from 'mongoose';
import { resolve } from 'url';
const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Subscription = mongoose.model('Subscription');

export class PostFunctions {

    errorSend: boolean;
    userId: string;

    constructor() { }

    savePost = (req, res) => {
        const reqPost = req.body.newPost;
        console.log('reqPost: ', reqPost);
        return new Promise(async (resolve, reject) => {
            const newPost = await new Post();
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
                console.log('post saved: ', newPost);
                resolve(' saved post');
            });
        })
    }

    getFrontPagePosts = (req, res) => {
        // console.log(req.body)
        const groups = {};
        const feedSubscriptions = req.body.feedSubscriptions
        feedSubscriptions.forEach((subscription) => {
            console.log('feedSubscriptions', feedSubscriptions);
            if(!!subscription._group){
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
            console.log('mappedSubscriptions')
            mappedSubscriptions.forEach((groupFeeds) => {
                const groupFeedIds = groupFeeds.map((groupFeed) => groupFeed._feed.feedId);
                facetQuery = {
                    ...facetQuery,
                    [groupFeeds[0]._group.title]: [{ $match: { feedId: { $in: groupFeedIds } } },{ $sort: { date: -1 }}, {$limit: 7}]
                }
            })
            const groupFeeds = mappedSubscriptions[0];
            const groupFeedIds = groupFeeds.map((groupFeed) => groupFeed._feed.feedId);
            // console.log('groupFeedIds', groupFeedIds);
            // const posts = await Post.find({
            //     feedId: {
            //         $in: groupFeedIds
            //     }
            // }).limit(15);
            console.log('facetQuery ', facetQuery)
            const posts = await Post.aggregate([
                {
                    $facet: facetQuery
                }
            ])
            // console.log('posts', posts);
            resolve(posts);
        })
    }
}