import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import oauthSignature from 'oauth-signature';

@Injectable({
    providedIn: 'root'
})
export class BaseTwitterHttpService {

    constructor() { }

    protected getHttpHeaders(method: string, baseUrl: string, key: string, keyValue: string) {
        // NB HttpHeader is immutable
        // const token: string = localStorage.getItem('token');
        const oauth_consumer_key = 'Y8vgUUXb0PKnANZBaZS2uw';
        const oauth_nonce = this.randomString(10);
        const oaut_signature_method = 'HMAC-SHA1';
        const oauth_timestamp = new Date().getTime().toString();
        const oauth_token = '378751182-osBanchlb3uXld55fvplBW6weEChmQBbOrhmPb2r';
        const oauth_version = '1.0';

        const oauth_consumer_secret = 'SPT5yvYchZYWA7RASGbS1gz3637IBYC9XmNJ4McQQ';
        const oauth_token_secret = 'QxPyt7u4cx25kH0KHnZWCfbk2kxceYALhtyAasw4kNk';

        const httpMethod = method;
        const url = baseUrl;
        const parameters = {
            oauth_consumer_key: oauth_consumer_key,
            oauth_token: oauth_token,
            oauth_nonce: oauth_nonce,
            oauth_timestamp: oauth_timestamp,
            oauth_signature_method: oaut_signature_method,
            oauth_version: oauth_version,
        };
        parameters[key] = keyValue;
        console.log('parameters', parameters);
        const encodedSignature = oauthSignature.generate(httpMethod, url, parameters, oauth_consumer_secret, oauth_token_secret, { encodeSignature: false });

        console.log('encodedSignature', encodedSignature);

        if (oauth_token) {
            return new HttpHeaders({
                'Content-Type': 'application/json', 'Authorization':
                    'OAuth ' +
                    encodeURIComponent('oauth_consumer_key') + '=' + oauth_consumer_key +
                    ',' + encodeURIComponent('oauth_nonce') + '=' + encodeURIComponent(oauth_nonce) +
                    ',' + encodeURIComponent('oauth_signature') + '=' + encodedSignature +
                    ',' + encodeURIComponent('oauth_signature_method') + '=' + encodeURIComponent(oaut_signature_method) +
                    ',' + encodeURIComponent('oauth_timestamp') + '=' + encodeURIComponent(oauth_timestamp) +
                    ',' + encodeURIComponent('oauth_token') + '=' + encodeURIComponent(oauth_token) +
                    ',' + encodeURIComponent('oauth_version') + '=' + encodeURIComponent(oauth_version)
            });
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

    public randomString = function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}

