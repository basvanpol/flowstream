import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss']
})
export class PostContentComponent implements OnInit {

  @Input() content: any;
  @Input() showFull: boolean;
  @Output() imageUpdated: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onMetaScraped(event) {
    if (this.content.source === "") {
      this.content.source = (event.source.imageUrl !== "") ? event.source.imageUrl : "";
      delete this.content.isPromisedImage;
      delete this.content.scrapeLink;

      this.imageUpdated.emit(this.content);
    }
  }


}
