import { IFrontPageEntity } from './../../../models/frontpage';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';
import { FrontPageFacade } from './../../../store/frontpage/facade/frontpage.facade';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})
export class FrontPageComponent implements OnInit, OnDestroy {

  frontPagePostsSubscription$: Subscription;
  frontpageEntities: IFrontPageEntity[];

  constructor(private frontPageFacade: FrontPageFacade) {
    this.frontPagePostsSubscription$ = this.frontPageFacade.frontPagePosts$.pipe(untilDestroyed(this)).subscribe((frontpageEntities: IFrontPageEntity[]) => {
      this.frontpageEntities = frontpageEntities;

    });
  }

  loadFeedsPosts(entity: IFrontPageEntity) {
    // console.log(entity);
  }

  ngOnInit() {
    // this.frontPageFacade.getFrontPagePosts();
  }

  ngOnDestroy() {}

}
