import { environment } from './../../../../environments/environment';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

    twitterSignInUrl = `${environment.webApiUrl}/api/auth/twitter`;
    hide = true;
    signinForm: FormGroup;
    path = '';

    constructor(private router: Router, private route: ActivatedRoute, private store: Store<any>) {
      console.log('${environment.webApiUrl', environment.webApiUrl);
    }

    ngOnInit() {
        this.signinForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, Validators.required)
        });
    }

    onSubmit(form: NgForm) {

        // const aUser = <User>{
        //     ...form.value
        // };

        // console.log(aUser);
        // this.store.dispatch(new AuthActions.UserSignin(aUser));
    }



}
