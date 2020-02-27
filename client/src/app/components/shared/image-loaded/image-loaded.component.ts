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
    this.imageSource = value;
    if (!this.promisedImage) {
      this.imageUrl = this.parseSrc(this.imageSource);
    } else {
      this.parserService.scrapeMeta(this.scrapeLink).then((body) => {
        const metaData: any = body;

        this.imageUrl = this.parseSrc(metaData.imageUrl);
        // this.$scope.$emit("meta:scraped", { source: metaData });
        this.metaScraped.emit({ source: metaData });

      }, (err) => {

      });
    }
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
