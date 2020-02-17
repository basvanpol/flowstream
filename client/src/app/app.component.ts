import * as FlowActions from './store/flow/actions/flow.actions';
import * as GroupActions from './store/group/actions/group.actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IAuthState } from './store/auth/reducers/auth.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';

  authSubscription: Subscription;
  authState: IAuthState;
  userId: string;

  constructor(private http: HttpClient, private router: Router, private store: Store<IAuthState>) {}

  ngOnInit() {
    this.authSubscription = this.store.select('auth').subscribe((state: IAuthState) => {
        this.authState = state;

        if (this.authState._id !== null && this.authState._id !==  this.userId) {
          this.userId = this.authState._id;
          this.initApplicationData();
        }
    });
  }

  initApplicationData() {
    this.store.dispatch(new FlowActions.RetrieveFlows() );
  }

}
