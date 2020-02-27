import { IPost } from '../../../../models/post';
import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges, HostListener } from '@angular/core';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})
export class PaperComponent implements OnInit, OnChanges {

  @Input() posts: IPost[];

  screenHeight: number;
  screenWidth: number;
  firstIndex: number;
  secondIndex: number;
  firstPosts: IPost[];
  secondPosts: IPost[];
  scrollPosts: IPost[];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.setSize();
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    // this.setPosts();


    this.setSize();
  }

  setSize() {
    const windowWidth: number = window.innerWidth;
    const isMobile = windowWidth < 849;
    const isTablet = windowWidth <= 1300;
    const isDesktop = windowWidth > 1300;
    this.firstIndex = isDesktop ? 5 : isTablet ? 5 : 5;
    this.secondIndex = isDesktop ? 10 : isTablet ? 10 : 10;
    this.setPosts();
  }

  setPosts() {
    this.firstPosts = [];
    this.secondPosts = [];
    this.scrollPosts = [];
    if (this.posts && this.posts.length > 0) {
      const postsLength = this.posts.length;
      if (postsLength >= this.secondIndex) {
        const paperPosts = this.posts.slice(0, this.secondIndex);
        this.firstPosts = paperPosts;
        this.secondPosts = paperPosts;
        this.scrollPosts = this.posts.slice(0, this.posts.length);
      } else {
        this.firstPosts = this.posts;
      }
    }
  }

}
