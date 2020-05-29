import { IGroup } from './../tsmodels/groups';
import * as mongoose from 'mongoose';
import { UserRoles } from '../tsmodels/userRoles';
const Group = mongoose.model('Group');
const User = mongoose.model('User');
const UserFeedSubscription = mongoose.model('UserFeedSubscription');

export default (app) => {

    app.post('/api/groups/save', (req, res) => {
        const sGroup = req.body;
        if (sGroup._id !== undefined) {
            Group.findOne({ '_id': sGroup._id }, async (err, group) => {
                if (err) {
                    res.status(500).send('Something broke!')
                }
                if (group) {
                    const userId = req.user._id.toString();
                    const canUserSave = (group._user.toString() === userId || (!!req.user.permissions && !!req.user.permissions.groups && req.user.permissions.groups === UserRoles.ADMIN));
                    if (!canUserSave) {
                        res.status(401).send("You don't have permission to delete this group");
                    }
                    // console.log('group to update', group)
                    await group.update({
                        '$set': {
                            'title': req.body.title,
                            'icon': {
                                ...req.body.icon
                            }
                        }
                    }, (err, result) => {
                        if (err) {
                            res.status(500).send(err);
                        }
                        // console.log('result', result);
                        res.status(200).send({ msg: 'group edited', group: sGroup });
                    });
                    // save flow
                } else {
                    const newGroup = new Group();
                    newGroup._id = new mongoose.Types.ObjectId();
                    newGroup._user = req.user._id;
                    newGroup.title = req.body.title;
                    newGroup.icon = req.body.icon;
                    // The one who created a group, can also edit it ;
                    await newGroup.save((err) => {
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        const updatedNewGroup = {
                            ...newGroup._doc,
                            canUserEdit: true
                        }
                        res.status(200).send({ msg: 'new group saved', group: updatedNewGroup });
                    });
                }
            });
        }

    });


    app.delete('/api/groups/:groupId', (req, res) => {
        // console.log('delete', req.params.groupId);
        const groupId = req.params.groupId;
        if (!groupId) res.status(400).send("no group id found in your request");

        Group.findOne({ '_id': groupId }, async (err, group) => {
            if (err) {
                res.status(500).send('Something broke!')
            }
            if (group) {
                const userId = req.user._id.toString();
                const canUserDelete = (group._user.toString() === userId || (!!req.user.permissions && !!req.user.permissions.groups && req.user.permissions.groups === UserRoles.ADMIN));
                if (!canUserDelete) {
                    res.status(401).send("You don't have permission to delete this group");
                } else {
                    Group.deleteOne({ '_id': groupId }, function (err) {
                        if (err) {
                            res.status(500).send('delete fail!')
                        }
                    });
                    UserFeedSubscription.deleteMany({ 'group': groupId })
                        .then(result => console.log(`Deleted ${result.deletedCount} item(s).`))
                        .catch(err => console.error(`Delete failed with error: ${err}`));
                    res.status(200).send({ msg: 'group deleted', groupId });
                }

            }
        });
    });

    app.get('/api/admingroups', async (req, res) => {
        /**
         * first, find all admin users. then, search for all groups that the admin users have created, plus the ones the user created
         */
        const userId = req.user._id;

        const adminUsers = await User.find({ 'permissions.groups': UserRoles.ADMIN }, (err, users) => {
            if (err) {
                res.status(500).send('Something broke!')
            }
            return users;
        });
        let adminUserIds = adminUsers.map(adminUser => adminUser._id);
        let userIds = [];
        if (!!adminUserIds && adminUserIds.length > 0) {
            userIds = [...adminUserIds, userId]
            // console.log("id's to search for ", userIds)
        } else {
            userIds = [userId];
        }

        const Query = [{ $match: { '_user': { $in: userIds } } }]

        let groups: IGroup[] = await Group.aggregate(Query);
        if (!!groups) {
            adminUserIds.forEach(element => {
                return element.toString();
            });
            const mappedGroups = groups.map((group: IGroup) => {
                return {
                    ...group,
                    canUserEdit: (group._user.toString() === userId.toString() || (!!req.user.permissions && !!req.user.permissions.groups && req.user.permissions.groups === UserRoles.ADMIN))  // TODO: check not only if user is owner of group or is admin user, but also if user is a manager and the group is part of a team that user manager of
                }
            });
            res.status(200).send({ msg: 'all admin groups', groups: mappedGroups });
        } else {
            res.status(200).send({ msg: 'no admin groups', groups: [] });
        }
    });

};
