import * as PostsActions from './../../../../store/posts/actions/posts.actions';
import { IPost } from './../../../../models/post';
import { AuthFacade } from './../../../../store/auth/facade/auth.facade';
import { FlowVM } from './../../../../models/flow';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FlowFacade } from './../../../../store/flow/facade/flow.facade';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SelectConfirmationModalComponent } from 'src/app/components/shared/modals/select-confirmation-modal/select-confirmation-modal.component';
import { IAuthState } from '../../../../store/auth/reducers/auth.reducer';
import { IFlowState } from '../../../../store/flow/reducers/flow.reducers';

@Component({
  selector: 'app-post-thumb-options',
  templateUrl: './post-thumb-options.component.html',
  styleUrls: ['./post-thumb-options.component.scss']
})
export class PostThumbOptionsComponent implements OnInit, OnDestroy {

  @Input() post: IPost;
  flowSubscription$: Subscription;
  flows: FlowVM[];
  authState: IAuthState;
  authStateSubscription$: Subscription;

  constructor(
    private store: Store<any>,
    public selectConfirmDialog: MatDialog,
    private flowFacade: FlowFacade,
    private authFacade: AuthFacade) {
    this.flowSubscription$ = this.flowFacade.flows$.pipe(untilDestroyed(this)).subscribe((flows: FlowVM[]) => {
      console.log('flows', flows);
      this.flows = flows;
    });
    this.authStateSubscription$ = this.authFacade.authState$.pipe(untilDestroyed(this)).subscribe((authState: IAuthState) => {
      this.authState = authState;
    });
  }

  ngOnInit() {
  }

  addToFlow($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.selectConfirmDialog.open(SelectConfirmationModalComponent, {
      width: '420px',
      maxHeight: '500px',
      data: {
        selectionList: this.flows,
        // selectedIdsOnLoaded: this.flows.map(flowVM => flowVM._id),
        selectedIdsOnLoaded: [],
        callback: (selectedItems: FlowVM[]) => {
          console.log('selectedItems', selectedItems);
          console.log(' this.post', this.post);
          let toBeSavedPost: IPost;
          if (this.userInPost()) {
            toBeSavedPost = {
              ...this.post,
              flows: [
                ...selectedItems.map((selectedItem: FlowVM ) => selectedItem._id)
              ]
            };
            if (selectedItems.length > 0) {
              console.log('update post', toBeSavedPost);
              this.store.dispatch(new PostsActions.UpdatePost(toBeSavedPost));
            } else {
              // TODO: should be delete post
              console.log('delete post', toBeSavedPost);
              this.store.dispatch(new PostsActions.DeletePost(toBeSavedPost));
            }
          } else {
            toBeSavedPost = {
              ...this.post,
              users: [
                this.authState._id
              ],
              flows: [
                ...selectedItems.map((selectedItem: FlowVM ) => selectedItem._id)
              ]
            };
            this.store.dispatch(new PostsActions.SavePost(toBeSavedPost));
          }
        }
      }
    });
  }

  userInPost() {
    console.log('this.post.users', this.post.users);
    console.log('this.authState._id', this.authState._id);
    console.log('exist? ', this.post.users.includes(this.authState._id));
    return this.post.users.includes(this.authState._id);
  }

  onConfirm() {

  }

  ngOnDestroy() { }

}
