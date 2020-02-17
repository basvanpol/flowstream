import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feed-resource-name',
  templateUrl: './feed-resource-name.component.html',
  styleUrls: ['./feed-resource-name.component.scss']
})
export class FeedResourceNameComponent implements OnInit {

  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

}
