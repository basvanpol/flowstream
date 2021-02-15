import * as FlowActions from './store/flow/actions/flow.actions';
import * as GroupActions from './store/group/actions/group.actions';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IAuthState } from './store/auth/reducers/auth.reducer';
import { getAuthState } from './store/auth/selectors/auth.selectors';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { IAppState } from './store/flow/selectors/flow.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';

  authSubscription: Subscription;
  authState: IAuthState;
  userId: string;

  constructor(private http: HttpClient, private router: Router, private store: Store<IAppState>) { }

  ngOnInit() {
    this.store.pipe(untilDestroyed(this), select(getAuthState)).subscribe((state: IAuthState) => {
      this.authState = state;

      if (this.authState._id !== null && this.authState._id !== this.userId) {
        this.userId = this.authState._id;
        this.initApplicationData();
      }
    });
  }

  initApplicationData() {
    this.store.dispatch(new FlowActions.RetrieveFlows());
  }

  ngOnDestroy() { }

}
