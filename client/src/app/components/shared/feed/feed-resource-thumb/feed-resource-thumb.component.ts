import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feed-resource-thumb',
  templateUrl: './feed-resource-thumb.component.html',
  styleUrls: ['./feed-resource-thumb.component.scss']
})
export class FeedResourceThumbComponent implements OnInit {

  @Input() thumb: string;

  constructor() { }

  ngOnInit() {

  }

}
