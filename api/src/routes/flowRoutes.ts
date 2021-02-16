import * as OAuth from 'oauth';
import * as mongoose from 'mongoose';
const Flow = mongoose.model('Flow');
const Post = mongoose.model('Post');

export interface IFlow extends mongoose.Document {
    _user: string,
    title: string,
    flowViewType: string
}

export default (app) => {

    app.get('/invite/:hash', (req, res) => {
        res.redirect(`/flow?flowId=5e62aa1c32da1c0011942357`);
    });

    app.post('/api/flows/', (req, res) => {
        
        if (req.body && (req.body.title || req.body.flowTitle)) {
            Flow.findOne({ '_Id': req.body.flowId }, async (err, flow) => {
                if (err) {
                    res.status(500).send('Something broke!')
                }
                // if (flow && flow._userId === req.body.userId) {
                //     const feedObjectId = flow._id;
                //     // save flow
                // } else {
                
                const newFlow: IFlow = await Flow() as IFlow;
                newFlow._id = new mongoose.Types.ObjectId();
                newFlow._user = req.user._id;
                newFlow.title = (req.body.title) ? req.body.title : req.body.flowTitle;
                // newFlow.flowViewType = req.body.flowViewType;
                
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
            //         
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
        
        if (req.params && req.params.flowId ) {
            Flow.findOne({ '_id': req.params.flowId }, async (err, flow) => {
                if (err) {
                    res.status(500).send('Something broke!')
                }
                
                if(flow){
                    
                    Flow.deleteOne({ '_id': req.params.flowId }, {}, function (err) {
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