import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {

    constructor() { }

    protected getHttpHeaders() {
        // NB HttpHeader is immutable
        const token: string = localStorage.getItem('token');
        if (token) {
            return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        } else {
            return new HttpHeaders({ 'Content-Type': 'application/json' });
        }
    }

    protected handleError(error: any | any) {
        let errorMsg = error.message || `An unknown error has occurred while retrieving data. Please try again.`;
        if (error.error && error.error.message) {
            errorMsg = error.error.message;
        }

        // throw an application level error
        const e = new Error();
        e['status'] = error.status;
        e.message = errorMsg;
        return throwError(e);
    }

    public parseDate(date: Date) {
        const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
        const dMonth: number = date.getMonth() + 1;
        const month = (dMonth < 10) ? '0' + dMonth : dMonth;
        const year = date.getFullYear();
        const dateText = year + '-' + month + '-' + day;
        return dateText;
    }
}

