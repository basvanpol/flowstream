import { untilDestroyed } from 'ngx-take-until-destroy';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AddPostComponent } from './../../../features/add-post/add-post.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from './../../../../services/http/auth.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IGeneralSelectionState } from '../../../../store/general/reducers/general-selection.reducer';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss']
})
export class HeaderTopComponent {

  showHeader = true;
  dialogRef: MatDialogRef<any>;
  @Input() headerTop: number;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<any>) {
  }

  onLogOut() {
    this.authService.logout();
  }

  onSignInGoogle() {
    this.authService.onSignInGoogleUser();
  }

  onAddPost() {
    this.dialogRef = this.dialog.open(AddPostComponent, {
      width: '488px',
      maxWidth: '488px',
      data: { callBack: () => {
        this.closeDialog();
      } },
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }

  goHome() {
    this.router.navigate(['/frontpage']);
  }

}
