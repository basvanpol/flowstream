import { ContentType } from './../../models/content';
import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {

  constructor() { }

  filterSortContent(mArray) {
    let sortArray = new Array();
    const mVideo = mArray.filter((item) => {
      return (item.type).search(ContentType.VIDEO) > -1;
    });
    const mImage = mArray.filter((item) => {
      return (item.type).search(ContentType.IMAGE) > -1;
    });
    const mText = mArray.filter((item) => {
      return (item.type).search(ContentType.TEXT) > -1;
    });
    const mLink = mArray.filter((item) => {
      return (item.type).search(ContentType.LINK) > -1;
    });
    sortArray = sortArray.concat(mVideo);
    sortArray = sortArray.concat(mImage);
    sortArray = sortArray.concat(mText);
    sortArray = sortArray.concat(mLink);
    return sortArray;
  }
}
