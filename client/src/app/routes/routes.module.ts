import { AuthenticatingComponent } from './../components/features/auth/authenticating/authenticating.component';
import { FlowDataResolver } from './../services/resolvers/flow-data-resolver.service';
import { FrontPageComponent } from './../components/features/front-page/front-page.component';
import { FeedPageComponent } from '../components/features/feed-page/feed-page.component';
import { AuthGuard } from '../services/guards/auth-guard.service';
import { SharedModule } from '../components/shared/shared.module';
import { SigninComponent } from '../components/features/auth/signin/signin.component';
import { MainUserComponent } from '../components/features/main-user/main-user.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlowPageComponent } from '../components/features/flow-page/flow-page.component';
const appRoutes: Routes = [
  {
    path: '', component: MainUserComponent, pathMatch: 'prefix', canActivate: [AuthGuard], children:
      [
        { path: 'frontpage', component: FrontPageComponent, canActivate: [AuthGuard]},
        { path: 'feed', component: FeedPageComponent , canActivate: [AuthGuard]},
        { path: 'flow', component: FlowPageComponent , canActivate: [AuthGuard], resolve: {isDataRequested: FlowDataResolver}, runGuardsAndResolvers: 'always'}
      ]
  },
  { path: 'signin', component: SigninComponent },
  { path: 'loading', component: AuthenticatingComponent },
  { path: '**', redirectTo: 'signin' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    SigninComponent,
    MainUserComponent,
    AuthenticatingComponent
  ],
  providers: [AuthGuard],
  exports: [
    RouterModule
  ]
})
export class RoutesModule { }
