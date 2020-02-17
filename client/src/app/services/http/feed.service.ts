import { environment } from './../../environments/environment';
import { FeedSubscription } from '../../models/feed';
import { BaseHttpService } from './base.http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class FeedService extends BaseHttpService {
    constructor(private http: HttpClient) {
        super();
    }

    public subscribeToFeed(requestObject: FeedSubscription): Observable<any> {
        console.log('subscribe service', requestObject);
        const url = `${environment.webApiUrl}/api/feeds/subscribe`;
        return this.http.post(url, requestObject, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
    public unsubscribeFromFeed(requestObject: FeedSubscription): Observable<any> {
        console.log('subscribe service');
        const url = `${environment.webApiUrl}/api/feeds/unsubscribe`;
        return this.http.post(url, requestObject, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }


    public addToFeatureList(requestObject: FeedSubscription): Observable<any> {
        const url = `${environment.webApiUrl}/api/feeds/feature`;
        return this.http.post(url, requestObject, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
    public removeFromFeatureList(requestObject: FeedSubscription): Observable<any> {
        const url = `${environment.webApiUrl}/api/feeds/unfeature`;
        return this.http.post(url, requestObject, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
    public getFeaturedFeeds(): Observable<any> {
        const url = `${environment.webApiUrl}/api/feeds/featured`;
        return this.http.get(url, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
}
