import { FlowVM } from '../../models/flow';
import { BaseHttpService } from './base.http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';


@Injectable()
export class FlowService extends BaseHttpService {
    constructor(private http: HttpClient) {
        super();
    }

    public saveFlow(requestObject: FlowVM): Observable<any> {
        // console.log('save flow');
        const url = `${environment.webApiUrl}/api/flows/`;
        return this.http.post(url, requestObject, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
    public deleteFlow(flowId: number): Observable<any> {
        // console.log('subscribe service');
        const url = `${environment.webApiUrl}/api/flows/${flowId}`;
        return this.http.delete(url, {

            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
    public retrieveFlows(): Observable<any> {
        // console.log('subscribe service');
        const url = `${environment.webApiUrl}/api/flows/`;
        return this.http.get(url, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
    public retrieveFlowPosts(flowId: number): Observable<any> {
        // console.log('subscribe service');
        const url = `${environment.webApiUrl}/api/flows/posts/?flowId=${flowId}`;
        return this.http.get(url, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }
}
