import { Component, OnInit, Input } from '@angular/core';
import { FeedVM } from '../../../../models/feed';

@Component({
    selector: 'subscription-button',
    template: `<div [ngClass]="{'selected': feed && feed.subscribed}" class="add-feed__subscribe-button" (mouseenter)="mouseEnter()"  (mouseleave)="mouseLeave()"><span>{{buttonLabel}}</span>
    </div>`,
    styleUrls: ['subscription-button.component.scss']
})
export class SubscriptionButtonComponent implements OnInit {

    public buttonLabel = 'Subscribe';
    @Input() feed?: FeedVM;

    constructor() { };

    handleSubscription(feed: FeedVM ){

    }

    ngOnInit() {

    }

    mouseEnter(){
        console.log('this.feed', this.feed);
        if(this.feed && this.feed.subscribed){
            this.buttonLabel = 'Unsubscribe';
        }
    }

    mouseLeave() {
        this.buttonLabel = 'Subscribe';
    }
}
