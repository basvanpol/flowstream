import { IPost } from './post';
export interface IFrontPageEntity {
    title: string;
    posts: IPost[];
}

export interface IFrontPageEntityObject {
    [title: string]: IPost[];
}

