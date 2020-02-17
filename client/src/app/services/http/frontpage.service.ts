import { IUserFeedSubscription } from './../../models/feed';
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base.http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
@Injectable()
export class FrontPageService extends BaseHttpService {
    constructor(private http: HttpClient) {
        super();
    }

    public getFrontPagePosts(userFeedSubscriptions: IUserFeedSubscription[]) {
        // const url = `http://localhost:4200/graphql/`;
        // const requestObject = {
        //     "query": "{ frontpage }"
        // };
        const requestObject = {
            feedSubscriptions: userFeedSubscriptions
        };
        const url = `${environment.webApiUrl}/api/frontpage/posts`;
        return this.http.post(url, requestObject, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
}
