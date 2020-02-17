import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feed-resource-date',
  templateUrl: './feed-resource-date.component.html',
  styleUrls: ['./feed-resource-date.component.scss']
})
export class FeedResourceDateComponent implements OnInit {

  @Input() date: string;

  constructor() { }

  ngOnInit() {
  }

}
