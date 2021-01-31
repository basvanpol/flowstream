import { PostFunctions } from '../features/posts/postFunctions';
import * as mongoose from 'mongoose';
const Post = mongoose.model('Post');
const postFunctions = new PostFunctions();

export default (app) => {

    app.get('/api/posts/', async (req, res) => {
        const posts: any[] = await postFunctions.getFeedPosts(req, res);
        if (posts && posts.length > 0) {
            let newSinceDate;
            if (!!posts[50]) {
                const lastPost = posts[50];
                newSinceDate = lastPost.date.getTime() / 1000;
            }
            posts.pop();
            res.status(200).send({
                'message': 'feed posts retrieved',
                data: {
                    posts,
                    newSinceDate
                }
            });
        }
        
    });

    // app.get('/api/posts/', async (req, res) => {
    //     // for (const key in req.query) {
    //         const feedId = req.query.feedId;
    //         const sinceDate = req.query.newSinceDate;
    //         let searchQuery;
    //         // 
    //         if(sinceDate !== 'null'){
    //             searchQuery = { 'feedId': feedId, 'date': { $lte: new Date(sinceDate * 1000)} }
    //         } else{
    //             searchQuery = { 'feedId': feedId }
    //         }
    //         await Post.find(
    //             searchQuery
    //             , async (err, posts) => {
    //             if (err) {
    //                 if (!this.errorSend) {
    //                     res.status(500).send('Something broke!')
    //                 }
    //             }
    //             if (posts) {
    //                 let newSinceDate;
    //                 if(posts[50]){
    //                     const lastPost = posts[50];
    //                     // 
    //                     // 
    //                     newSinceDate = lastPost.date.getTime()/1000;
    //                 }
    //                 posts.pop();
    //                 res.status(200).send({
    //                     'message': 'posts flowing through', data: {
    //                         posts: posts,
    //                         newSinceDate: (newSinceDate) ? newSinceDate : null
    //                     }
    //                 });
    //             }
    //         }).sort({'_id':-1}).limit(51);
    //     // }
    // })

    app.post('/api/posts/', async (req, res) => {
        // 
        await postFunctions.savePost(req, res);
        res.status(200).send({
            'message': 'post saved'
        });
    });

    app.post('/api/frontpage/posts/', async (req, res) => {
        // 
        const frontPagePosts = await postFunctions.getFrontPagePosts(req, res);
        res.status(200).send({
            'message': 'frontpage posts retrieved',
            data: frontPagePosts
        });
    });

    app.post('/api/updatedpost/', async (req, res) => {
        // 
        req.header("Access-Control-Allow-Origin", "*");
        req.header("Access-Control-Allow-Headers", "X-Requested-With");
        await Post.findByIdAndUpdate(req.body._id, req.body, {}, (error, doc) => {
            // 
            res.status(200).send({ 'message': 'ok', data: { body: req.body } });
        });
    })

    app.post('/api/deletedpost/', async (req, res) => {
        const postId = req.body._id;
        const post = await Post.find({ '_id': postId, 'users': mongoose.Types.ObjectId(req.user._id) });
        if (post) {
            // 

            Post.deleteOne({ _id: postId }, {}, function (err) {
                if (err) {
                    res.status(500).send('delet fail!')
                }
                // 
                res.status(200).send({ 'message': 'ok', data: { body: req.body } });
            });

        }
    });
}