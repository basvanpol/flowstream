// content:[{"type":"IMAGE_INSTAGRAM","source":"https://scontent.cdninstagram.com/l/t51.2885-15/e15/11325301_1585673238388623_527492006_n.jpg?ig_cache_key=NDcwMzEzNjI2MDU0ODY2MDEx.2","date":null,"location":null,"thumb":"https://scontent.cdninstagram.com/l/t51.2885-15/s150x150/e15/11325301_1585673238388623_527492006_n.jpg?ig_cache_key=NDcwMzEzNjI2MDU0ODY2MDEx.2"},{"type":"LINK","source":"https://www.instagram.com/p/aG48BGBrRb/","date":null,"location":null,"thumb":null}], 

// meta_data: {"authorName":"@Koekie28","authorThumb":"http://pbs.twimg.com/profile_images/3208476859/33c26962f6d8a8931a2f9fc3ecc40905_normal.jpeg","feedResourceName":"#cruijff"}, 

import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    title: String,
    feedId: String,
    flows: [{ type: Schema.Types.ObjectId, ref: 'Flow' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    thumb: String,
    location: String,
    contents: [{}],
    comment: Array,
    date: Date,
    metaData: {},
    likeCount: Number,
    likeScore: Number,
    viewCount: Number,
    private: Boolean,
    tagData: [{}]
});

mongoose.model('Post', postSchema);
