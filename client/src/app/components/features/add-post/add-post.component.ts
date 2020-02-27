import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as PostsActions from './../../../store/posts/actions/posts.actions';
import { Store } from '@ngrx/store';
import { IAuthState } from './../../../store/auth/reducers/auth.reducer';
import { OnDestroy, Inject } from '@angular/core';
import { FlowVM } from './../../../models/flow';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FlowFacade } from './../../../store/flow/facade/flow.facade';
import { Subscription } from 'rxjs';
import { IPost } from './../../../models/post';
import { FormGroup, FormControl } from '@angular/forms';
import { ParserService } from './../../../services/parser/parser.service';
import { Component, OnInit } from '@angular/core';
import { AuthFacade } from '../../../store/auth/facade/auth.facade';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit, OnDestroy {

  addPostStep = 0;
  postUrl = '';
  formGroup: FormGroup;
  post: IPost;
  postParsed = false;
  postIsParsing = false;
  flowSubscription$: Subscription;
  authStateSubscription$: Subscription;
  flows: FlowVM[];
  selectedIdsOnLoaded: number[];
  selectedItems: {
    _id: any,
    title: string
  }[];
  authState: IAuthState;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private store: Store<any>, private parserService: ParserService, private flowFacade: FlowFacade, private authFacade: AuthFacade) {
    this.flowSubscription$ = this.flowFacade.flows$.pipe(untilDestroyed(this)).subscribe((flows: FlowVM[]) => {
      this.flows = flows;
      // this.selectedIdsOnLoaded = this.flows.map(flowVM => flowVM._id);
      this.selectedIdsOnLoaded = [];


    });
    this.authStateSubscription$ = this.authFacade.authState$.pipe(untilDestroyed(this)).subscribe((authState: IAuthState) => {
      this.authState = authState;
    });
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'postUrl': new FormControl(null)
    });
  }

  save() {
    const toBeSavedPost: IPost = {
      ...this.post,
      users: [
        this.authState._id
      ],
      flows: [
        ...this.selectedItems.map((selectedItem: FlowVM ) => selectedItem._id)
      ]
    };
    this.store.dispatch(new PostsActions.SavePost(toBeSavedPost));
    this.data.callBack();
  }

  /**
     * close the popup
     */
  close() {

  }

  cancel() {
    this.data.callBack();
  }

  next() {
    if (this.addPostStep === 0) {
      this.postUrl = this.formGroup.value.postUrl;
      if (!!this.postUrl) {
        this.getUrlMeta(this.postUrl);
      }
    } else {
      this.addPostStep = this.addPostStep + 1;
    }
  }

  getUrlMeta(url) {
    this.postIsParsing = true;
    this.parserService.scrapeMeta(url).then((body) => {
      const metaData: any = body;

      const description = metaData.description;
      // const imageUrl = this.parseSrc(metaData.imageUrl);
      const imageUrl = metaData.imageUrl;
      const title = metaData.title;
      const publisher = metaData.publisher;

      this.post = this.parserService.parsePostFromScraper(title, imageUrl, description, this.postUrl, publisher);
      this.postParsed = true;
      this.postIsParsing = false;
      this.addPostStep = this.addPostStep + 1;

    }, (err) => {

    });

  }

  onSelectedList(items: any) {
    this.selectedItems = items;

  }

  ngOnDestroy() { }

}
