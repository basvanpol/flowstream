const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type RootQuery {
        frontpage: String!
    }

    schema {
        query: RootQuery
    }
`);

    // type PostMetaData {
    //     authorname: String
    //     authorThumb: String
    //     name: String
    // }

    // type PostContent {
    //     date: String
    //     mainType: String
    //     platformClass: String
    //     postType: String
    //     source: String
    //     thumb: String
    //     type: String
    // }

    // type Post {
    //     contents: [PostContent]
    //     date: String
    //     feedId: String
    //     flows: [String]
    //     metaData: PostMetaData
    //     postType: String
    //     _id: String
    // }

    // type PostGroup {
    //     postTitle: String
    //     posts: [Post]
    // }