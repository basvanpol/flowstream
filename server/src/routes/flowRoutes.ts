import * as OAuth from 'oauth';
import * as mongoose from 'mongoose';
const Flow = mongoose.model('Flow');
const Post = mongoose.model('Post');

export default (app) => {

    app.post('/api/flows/', (req, res) => {
        console.log(' create flow ', req.body);
        if (req.body && (req.body.title || req.body.flowTitle)) {
            Flow.findOne({ '_Id': req.body.flowId }, async (err, flow) => {
                if (err) {
                    res.status(500).send('Something broke!')
                }
                // if (flow && flow._userId === req.body.userId) {
                //     const feedObjectId = flow._id;
                //     // save flow
                // } else {
                console.log('req.user', req.user);
                const newFlow = await new Flow();
                newFlow._id = new mongoose.Types.ObjectId();
                newFlow._user = req.user._id;
                newFlow.title = (req.body.title) ? req.body.title : req.body.flowTitle;
                // newFlow.flowViewType = req.body.flowViewType;
                console.log('newflow', newFlow);
                await newFlow.save(async (err) => {
                    if (err) {
                        return res.status(500).send({ msg: err.message });
                    }
                    await Flow.find({ '_user': req.user._id }, async (err, flows) => {
                        if (err) {
                            if (!this.errorSend) {
                                res.status(500).send('Something broke!')
                            }
                        }
                        if (flows) {
                            res.status(200).send({
                                'message': 'new flow saved', data: {
                                    flows: flows
                                }
                            });
                        }
                    })
                })
            });
        };
    });

    app.get('/api/flows/', (req, res) => {
        if (req.user && req.user._id) {
            Flow.find({ '_user': req.user._id }, async (err, flows) => {
                if (err) {
                    if (!this.errorSend) {
                        res.status(500).send('Something broke!')
                    }
                }
                if (flows) {
                    res.status(200).send({
                        'message': 'fetch flows success', data: {
                            flows: flows
                        }
                    });
                }
            })
        }

    });
    // db.course.find({},
    //     {
    //         students:
    //         {
    //             $elemMatch:
    //             {
    //                 id: new mongoose.Types.ObjectId("51780f796ec4051a536015d0"),
    //                 name: "Sam"
    //             }
    //         }
    //     }
    // );

    app.get('/api/flows/posts/', async (req, res) => {
        for (const key in req.query) {
            const flowId = req.query[key];
            const ObjectFlowId = mongoose.Types.ObjectId(flowId);
            await Post.find({
                flows: {
                    $in:
                        [
                            ObjectFlowId
                        ]
                },
            }, null,
                {
                    sort: {
                        date: -1 //Sort by Date Added DESC
                    }
                }, async (err, posts) => {
                    if (err) {
                        if (!this.errorSend) {
                            res.status(500).send('Something broke!')
                        }
                    }
                    if (posts) {
                        res.status(200).send({
                            'message': 'posts flowing through', data: {
                                posts: posts
                            }
                        });
                    }
                })
            // await Post.find({ 'flows': flowId }, async (err, posts) => {
            //     if (err) {
            //         if (!this.errorSend) {
            //             res.status(500).send('Something broke!')
            //         }
            //     }
            //     if (posts) {
            //         console.log('posts: ')
            //         res.status(200).send({
            //             'message': 'posts flowing through', data: {
            //                 posts: posts
            //             }
            //         });
            //     }
            // })
        }
    })


    app.delete('/api/flows/:flowId', (req, res) => {
        console.log(' delete flow ', req.params);
        if (req.params && req.params.flowId ) {
            Flow.findOne({ '_id': req.params.flowId }, async (err, flow) => {
                if (err) {
                    res.status(500).send('Something broke!')
                }
                console.log(' found flow!', flow);
                if(flow){
                    console.log('found flow!', flow);
                    Flow.deleteOne({ '_id': req.params.flowId }, function (err) {
                        if (err) {
                            res.status(500).send('delete fail!')
                        }
                        if(req.user){
                            Flow.find({ '_user': req.user._id }, async (err, flows) => {
                                if (err) {
                                    if (!this.errorSend) {
                                        res.status(500).send('Something broke!')
                                    }
                                }
                                if (flows) {
                                    res.status(200).send({
                                        'message': 'delete flow successful. Fetch flows success', data: {
                                            flows: flows
                                        }
                                    });
                                } else {
                                    res.status(200).send({
                                        'message': 'delete flow successful. no flows available', data: {
                                            flows: []
                                        }
                                    });
                                }
                            })
                        } else {
                            res.status(200).send({ 'message': 'ok'  });
                        }
                    });
                }
            });
        };
    });
};