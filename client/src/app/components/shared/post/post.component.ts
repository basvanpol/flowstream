import { ModalPostComponent } from './../post-views/modal-post/modal-post.component';
import * as GeneralSelectionActions from './../../../store/general/actions/general-selection.actions';
import * as PostsActions from '../../../store/posts/actions/posts.actions';
import { PostsState } from '../../../store/posts/reducers/posts.reducer';
import { Store } from '@ngrx/store';
import { FilterService } from './../../../services/filter/filter.service';
import { ParserService } from './../../../services/parser/parser.service';
import { dateFormat } from './../../../models/date';
import { IPost } from '../../../models/post';
import { OnInit, Input, Component } from '@angular/core';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  _post: IPost;

  @Input() set post(value: IPost) {
    this._post = {...value};
    this._post.postType = this.parserService.parsePostType(this._post);
    this._post.contents = this.filterService.filterSortContent(this._post.contents);
    this._post.contents = this.parserService.parseContent(this._post, this.showFull);
    this.parsePostData();
  }

  @Input() showFull = false;
  @Input() showOverlay = true;

  isVisible = false;
  postContents: any[];
  postData: IPost;
  title = '';
  authorThumb: string;
  feedName: string;
  postDate: string;

  constructor(private parserService: ParserService, private filterService: FilterService, private store: Store<PostsState>) { }

  ngOnInit() {
  }

  parsePostData() {
    this.authorThumb = (this._post && this._post.metaData) ? this._post.metaData.authorThumb : '';
    this.feedName = (this._post && this._post.metaData) ? this._post.metaData.name : '';
    this.postDate = (this._post && this._post.date) ? this.parseDateTimeLabel(this._post.date) : '';
    this.setExternalFeed();
  }

  parseDateTimeLabel(dateString: string) {
    const date = this.getDate(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const sMonth = dateFormat.i18n.monthNames[month];
    const day = date.getDate();
    const hour = date.getHours();
    const sHour = hour > 9 ? hour : "0" + hour;
    const minute = date.getMinutes();
    const sMinute = minute > 9 ? minute : "0" + minute;
    const second = date.getSeconds();

    return day + " " + sMonth + " " + year + " - " + sHour + ":" + sMinute;
  }

  openPost($event: Event) {
    if (!this.showFull) {
      $event.stopPropagation();
      $event.preventDefault();
      this.store.dispatch(new PostsActions.SelectPost(this._post));
      this.store.dispatch(new GeneralSelectionActions.LoadDynamicModalComponent(ModalPostComponent));
    }
  }

  getDate(dateString) {
    return new Date(dateString);
  }

  setExternalFeed() {
    if (this._post) {
      // console.log(this._post);
    }
  }
  onImageUpdated(content: any) {
    this.store.dispatch(new PostsActions.UpdatePost(this._post));
  }

}
