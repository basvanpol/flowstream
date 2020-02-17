import { IPost } from './../../models/post';
import { FeedSubscription } from '../../models/feed';
import { BaseHttpService } from './base.http.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';


@Injectable()
export class PostsService extends BaseHttpService {
    constructor(private http: HttpClient) {
        super();
    }

    public getFeedPosts(payload: {
        feedIds: string[],
        newSinceDate: number
    }): Observable<any> {
        let queryParamString = '';
        payload.feedIds.forEach((feedId, index) => {
            if (index === 0) {
                queryParamString = queryParamString + '?feedId=' + feedId;
            } else {
                queryParamString = queryParamString + '&feedId=' + feedId;
            }
        });
        queryParamString = queryParamString + '&newSinceDate=' + payload.newSinceDate;
        const url = `${environment.webApiUrl}/api/posts/${queryParamString}`;
        return this.http.get(url, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }

    public savePost(post: IPost): Observable<any> {
        console.log('post', post);
        const url = `${environment.webApiUrl}/api/posts/`;
        return this.http.post(url, {newPost: post}, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }

    public updatePost(post: IPost): Observable<any> {
        console.log(' update post');
        const url = `${environment.webApiUrl}/api/updatedpost/`;
        return this.http.post(url, post, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
    public deletePost(post: IPost): Observable<any> {
        console.log(' delete post', post);
        const url = `${environment.webApiUrl}/api/deletedpost/`;
        return this.http.post(url, post, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
}
