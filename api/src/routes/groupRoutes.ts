import * as mongoose from 'mongoose';
const Group = mongoose.model('Group');
const UserFeedSubscription = mongoose.model('UserFeedSubscription');

export default (app) => {

    app.post('/api/groups/save', (req, res) => {
        if (req.body._id !== undefined) {
            Group.findOne({ '_id': req.body._id }, async (err, group) => {
                if (err) {
                    res.status(500).send('Something broke!')
                }
                if (group) {
                    res.status(500).send({msg: 'this group already exists'});
                    // save flow
                } else {
                    const newGroup = new Group();
                    newGroup._id = new mongoose.Types.ObjectId();
                    newGroup._user = req.user._id;
                    newGroup.title = req.body.title;
                    newGroup.icon = req.body.icon;
                    await newGroup.save((err) => {
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        // new flow saved
                        res.status(200).send({msg: 'new group saved'});
                    });
                }
            });
        }

    });


    app.delete('/api/groups/:groupId', (req, res) => {
        Group.findOne({ '_id': req.params.groupId }, async (err, group) => {
            if (err) {
                res.status(500).send('Something broke!')
            }
            if (group) {
                Group.deleteOne({ '_id': req.params.groupId }, function (err) {
                    if (err) {
                        res.status(500).send('delete fail!')
                    }
                });
                UserFeedSubscription.deleteMany({ 'group': req.params.groupId })
                .then(result => console.log(`Deleted ${result.deletedCount} item(s).`))
                .catch(err => console.error(`Delete failed with error: ${err}`));
                Group.find({ '_user' : '5e572e9024a3eaa2cfef89bf' }, async (err, groups) => {
                    if (err) {
                        res.status(500).send('Something broke!')
                    }
                    res.status(200).send({msg : 'all admin groups' , groups: groups,  } );
                });
            } 
        });
    });

    app.get('/api/admingroups', (req, res) => {
        // get groups 
        Group.find({ '_user' : '5eb1d665ece528543de4dd0f' }, async (err, groups) => {
            if (err) {
                res.status(500).send('Something broke!')
            }
            res.status(200).send({msg : 'all admin groups' , groups: groups } );
        });
    });
    
};