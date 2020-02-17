export interface IUser {
    _id: number;
    twitter: {
        twitterId: String
    };
    isAdmin: {
        type: Boolean,
        default: false
    };
}
