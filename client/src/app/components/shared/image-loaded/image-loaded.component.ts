import { ParserService } from './../../../services/parser/parser.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-loaded',
  templateUrl: './image-loaded.component.html',
  styleUrls: ['./image-loaded.component.scss']
})
export class ImageLoadedComponent implements OnInit {
  @Output() metaScraped: EventEmitter<{}> = new EventEmitter();
  @Input() scrapeLink: string;
  @Input() promisedImage: string;
  @Input() showFull: string;
  @Input() set source(value: string) {
    this.imageUrl = value;
  }

  imageSource: string;
  imageUrl: string;

  constructor(private parserService: ParserService) { }

  ngOnInit() {
  }

  parseSrc(imageSource: string) {
    return imageSource;
    // return imageSource ? imageSource.search('http') > -1 ? imageSource : Config.flowUrl + source : "";
  }

}
