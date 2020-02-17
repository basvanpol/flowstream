import * as mongoose from 'mongoose';
const Group = mongoose.model('Group');

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
                    Group.find({ '_user' : '5e072c058967b6760cbab66f' }, async (err, groups) => {
                        if (err) {
                            res.status(500).send('Something broke!')
                        }
                        res.status(200).send({msg : 'all admin groups' , groups: groups } );
                    });
                });
            } 
        });
    });

    app.get('/api/admingroups', (req, res) => {
        // get groups 
        Group.find({ '_user' : '5e072c058967b6760cbab66f' }, async (err, groups) => {
            if (err) {
                res.status(500).send('Something broke!')
            }
            res.status(200).send({msg : 'all admin groups' , groups: groups } );
        });
    });
    
};