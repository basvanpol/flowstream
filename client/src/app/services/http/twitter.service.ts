import { BaseHttpService } from './base.http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';


@Injectable()
export class TwitterService extends BaseHttpService {
    constructor(private http: HttpClient) {
        super();
    }

    public searchFeeds(query: string): Observable<any> {
        // const url = `${environment.twitterApiUrl}statuses/user_timeline.json/?q=${query}`;
        // const url = `https://api.twitter.com/1.1/users/search.json?q=${query}`;
        const url = `${environment.webApiUrl}/api/twitter/search?q=${query}`;
        return this.http.get(url, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
}
