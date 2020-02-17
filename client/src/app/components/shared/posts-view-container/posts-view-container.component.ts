import { IPost } from '../../../models/post';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-posts-view-container',
  templateUrl: './posts-view-container.component.html',
  styleUrls: ['./posts-view-container.component.scss']
})
export class PostsViewContainerComponent implements OnInit {

  @Input() currentPosts: IPost[];

  constructor() { }

  ngOnInit() {
  }

}
