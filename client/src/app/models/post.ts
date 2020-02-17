export interface IPost {
    _id: string;
    title?: string;
    contents: any[];
    metaData: {
        authorThumb: string;
        authorName: string;
        name: string;
    };
    date: string;
    postType: string;
    comments: any[];
    feedId: string;
    flows: any[];
    tagData: any[];
    users: any[];
}

export enum ContentType {
    IMAGE = "IMAGE",
    IMAGE_GOOGLE = "IMAGE_GOOGLE",
    IMAGE_TWITTER = "IMAGE_TWITTER",
    IMAGE_SNAPSHOT = "IMAGE_SNAPSHOT",
    IMAGE_RSS = "IMAGE_RSS",
    VIDEO = "VIDEO",
    VIDEO_YOUTUBE = "VIDEO_YOUTUBE",
    VIDEO_TWITTER = "VIDEO_TWITTER",
    TEXT = "TEXT",
    TEXT_TWITTER = "TEXT_TWITTER",
    TEXT_RSS = "TEXT_RSS",
    TEXT_EXT = "TEXT_EXT",
    LINK = "LINK",
    THUMB = "THUMB",
    RICH_TEXT = "RICH_TEXT",
    POST_TWITTER = "POST_TWITTER",
    NOTE = "NOTE",
    MULTIPLE = "MULTIPLE",
    MULTIPLE_TWITTER = "MULTIPLE_TWITTER",
    LOCATION = "LOCATION",
    COMMENT = "COMMENT",
    LIKE = "LIKE",
    DEEPLINK = "DEEPLINK"
}
