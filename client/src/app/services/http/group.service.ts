import { GroupVM } from '../../models/group';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base.http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GroupService extends BaseHttpService {
    constructor(private http: HttpClient) {
        super();
    }

    public saveGroup(requestObject: GroupVM): Observable<any> {
        console.log('save group');
        const url = `${environment.webApiUrl}/api/groups/save`;
        return this.http.post(url, requestObject, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }

    public deleteGroup(groupId: string): Observable<any> {
        console.log('delete group', groupId);
        const url = `${environment.webApiUrl}/api/groups/${groupId}`;
        return this.http.delete(url, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }

    public loadAdminGroups(): Observable<any> {
        const url = `${environment.webApiUrl}/api/admingroups/`;
        return this.http.get(url, {
            observe: 'body',
            responseType: 'json',
            headers: this.getHttpHeaders()
        });
    }

}
