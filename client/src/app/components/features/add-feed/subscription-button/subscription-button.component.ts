import { Component, OnInit, Input } from '@angular/core';
import { FeedVM } from '../../../../models/feed';

@Component({
  selector: 'subscription-button',
  template: `<div [ngClass]="{'selected': feedVM && feedVM.subscribed}" class="add-feed__subscribe-button" (mouseenter)="mouseEnter()"  (mouseleave)="mouseLeave()"><span>{{buttonLabel}}</span>
    </div>`,
  styleUrls: ['subscription-button.component.scss']
})
export class SubscriptionButtonComponent implements OnInit {

  public buttonLabel = 'Subscribe';
  @Input() set feed(value: FeedVM) {
    this.feedVM = value;

  }
  feedVM: FeedVM;

  constructor() { }

  handleSubscription(feed: FeedVM) {

  }

  ngOnInit() {

  }

  mouseEnter() {

    if (this.feed && this.feed.subscribed) {
      this.buttonLabel = 'Unsubscribe';
    }
  }

  mouseLeave() {
    this.buttonLabel = 'Subscribe';
  }
}
