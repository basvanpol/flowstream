import { dateFormat } from './../../models/date';
import { HttpClient } from '@angular/common/http';
import { VideoType } from './../../models/content';
import { ContentType, IPost } from './../../models/post';
import { Injectable } from '@angular/core';
import { promise } from '../../../../node_modules/protractor';
import { environment } from 'src/app/environments/environment';

@Injectable()
export class ParserService {

  constructor(private http: HttpClient) { }


  public parseContent(post, showFull) {
    if (typeof showFull === 'undefined') {
      showFull = false;
    }

    let thumbFound = false;
    let textFound = false;
    let titleFound = false;
    let imageFound = false;
    let videoFound = false;
    let linkFound = false;
    let link;
    let contents = [...post.contents];
    contents = contents.map(c => {
      const content = {...c};
      content.postType = post.postType;
      if (content.mainType === ContentType.TEXT) {
        textFound = true;
        let parsedContent = "";
        if (content.type === ContentType.TEXT_RSS) {
          parsedContent = this.getRssHTML(content.source, showFull);
        } else if (content.type === ContentType.TEXT_TWITTER) {
          parsedContent = this.getDescription(content.source);
        } else if (content.type === ContentType.TEXT_TITLE) {
          titleFound = true;
          parsedContent = this.getTitle(content.source);
        } else  {
          parsedContent = this.getDefaultText(content.source);
        }

        content.htmlContent = parsedContent;
        content.htmlSummaryContent = parsedContent;


      } else if (content.mainType === ContentType.LINK) {
        linkFound = true;
        link = content.source;
        content.location = this.getResourceLocation(content.source);
      } else if (content.mainType === ContentType.IMAGE) {
        imageFound = true;
      } else if (content.mainType === ContentType.THUMB) {
        thumbFound = true;
      } else if (content.mainType === ContentType.LINK) {
        linkFound = true;
      } else if (content.mainType === ContentType.VIDEO) {
        videoFound = true;
        const urlVideo = content.source.search('http') > -1 && content.source.search('.mp4') > -1;
        const iframeVideo = content.source.search('http') > -1 && content.source.search('iframe') > -1;
        const httpVideo = content.source.search('http') > -1 && !urlVideo;
        // console.log('1: source = ', content.source);
        // console.log('2: httpVideo = ', httpVideo, 'urlVideo = ', urlVideo, 'iframeVideo = ', iframeVideo);

        if (urlVideo) {
          content.videoType = VideoType.TYPE_URL;
        }

        if (iframeVideo) {
          content.videoType = VideoType.TYPE_FACEBOOK;
        }

        if (!urlVideo && !httpVideo && !iframeVideo) {
          content.videoType = VideoType.TYPE_YOUTUBE;
        }

        if (content.videoType === VideoType.TYPE_YOUTUBE) {
          content.htmlContent = content.source;
        } else if (content.videoType === VideoType.TYPE_URL) {
          content.jwOptions = {
            options: {
              type: 'mp4',
              image: content.thumb,
              height: 260,
              width: 300,
              // advertising: {
              //     client: "vast",
              //     tag: content.thumb
              // }
            },
            file: content.source
            // file: this.$sce.trustAsResourceUrl(content.source)
          };
        } else if (content.videoType === VideoType.TYPE_FACEBOOK) {
          content.htmlContent = content.source;
          // content.htmlContent = this.$sce.trustAsHtml(content.source);
        } else {
          // content.htmlContent = this.$sce.trustAsResourceUrl(content.source);
          content.htmlContent = content.source;
        }
      }
      return content;

    });


    if (!titleFound && !!post.title) {

      /**
       * also create extra text field for to parse scraped title
       */
      const contentDescription = {
        date: null,
        location: 0,
        mainType: "TEXT_TITLE",
        platformClass: "TEXT_TITLE",
        postType: "TEXT_TITLE",
        thumb: null,
        type: "TEXT_TITLE",
        isPromisedDescription: true,
        source: post.title
      };

      contents.unshift(contentDescription);

    }

    return contents;
  }

  scrapeMeta(link) {
    const q = new Promise((resolve, reject) => {
      // this.http.post("https://express-rest-stuu.herokuapp.com/queries",
      this.http.post(`${environment.webApiUrl}/api/scrapedcontent/`,
        {
          "url": link,
          "type": (link.indexOf("twitter") > -1) ? "twitter" : "web"
        }).subscribe(function successCallback(response: {
          data: any
        }) {
          // this callback will be called asynchronously
          // when the response is available
          resolve(response);

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    });



    return q;
  }

  parsePostFromScraper(title, imageUrl, description, url, publisher): IPost {
    const content = [];

    if (title !== '') {
      const parsedContent = this.getScraperPostHTML(title);
      const htmlContent = parsedContent;

      const titleContentObject = {
        date: null,
        location: null,
        mainType: "TEXT",
        htmlContent: htmlContent,
        htmlSummaryContent: htmlContent,
        postType: "TEXT",
        source: parsedContent,
        thumb: null,
        type: "TEXT"
      };

      content.push(titleContentObject);
    }

    if (imageUrl !== '') {
      const imageContentObject = {
        date: null,
        location: 0,
        mainType: "IMAGE",
        postType: "IMAGE",
        source: imageUrl,
        thumb: null,
        type: "IMAGE"
      };

      content.push(imageContentObject);
    }

    if (description !== '') {
      const descriptionContentObject = {
        date: null,
        location: 0,
        mainType: "TEXT_EXT",
        postType: "TEXT_EXT",
        source: description,
        thumb: null,
        type: "TEXT_EXT"
      };

      content.push(descriptionContentObject);
    }

    const linkContentObject = {
      date: null,
      location: "",
      mainType: "LINK",
      postType: "TEXT",
      source: url,
      thumb: null,
      type: "LINK"
    };

    content.push(linkContentObject);

    const date = new Date();
    const publisherName: string = this.getShortSummary(publisher);
    const post: IPost = {
      contents: content,
      _id: '0',
      date: date.toString(),
      postType: "TEXT",
      metaData: {
        authorName: publisherName,
        authorThumb: "",
        name: publisherName
      },
      comments: [],
      flows: [],
      tagData: [],
      users: [],
      feedId: '0'
    };

    return post;
  }

  parsePostType(post) {
    let textFound = false;
    let imageFound = false;
    let videoFound = false;
    let linkFound = false;

    let postType = "";
    let numContent = 0;
    post.contents.map(c => {
      numContent++;

      const content = {
        ...c
      };

      const contentType = content.type;
      if (contentType.search("IMAGE") > -1) {
        imageFound = true;
        content.mainType = ContentType.IMAGE;
        postType = ContentType.IMAGE;
      } else if (contentType.search("TEXT") > -1) {
        textFound = true;
        content.mainType = ContentType.TEXT;
        if (postType === '') {
          postType = ContentType.TEXT;
        }
      } else if (contentType.search("VIDEO") > -1) {
        videoFound = true;
        content.mainType = ContentType.VIDEO;
        postType = ContentType.VIDEO;
      } else if (contentType.search("LINK") > -1) {
        linkFound = true;
        content.mainType = ContentType.LINK;
        postType = ContentType.LINK;
      }

      if (numContent > 1) {
        postType = ContentType.MULTIPLE;

        if (imageFound && !videoFound) { // image with text
          postType = ContentType.IMAGE;
        }

        if (textFound && linkFound && !imageFound && !videoFound) { // text only
          postType = ContentType.TEXT;
        }

        if (!imageFound && videoFound) { // video only
          postType = ContentType.VIDEO;
        }
      }

      return content;
    });

    return postType;
  }


  checkSetResourceThumb(feed, authorThumb) {
    if (feed) {
      return feed.thumb;
    }
    return authorThumb;
  }

  /**
   * get html markup for images
   */
  getCoverImageHTML(content) {
    const contentSource = content.source;
    const htmlString = `<div style='background-color: rgb(255, 255, 255);
                                background-image: url(${contentSource});
                                background-repeat: no-repeat; background-attachment: scroll;
                                background-position: top center; background-clip: border-box; background-origin: padding-box;
                                background-size: cover;'></div>`;
    return htmlString;
  }

  getImageHTML(cssName, contentArray, sizeClass) {
    let htmlString = "";
    const size = (sizeClass !== undefined) ? (" " + sizeClass) : "";
    const contentClass = cssName + "GalleryImage" + size;
    const imageClass = cssName + "MaxSized" + size;

    const contentLength = contentArray.length;
    for (let i = 0; i < contentLength; i++) {
      const contentSource = contentArray[i].source;
      htmlString += "<div class='" + contentClass + "'><img class='" + imageClass + "' src='" + contentSource + "'/></div>";
    }
    return htmlString;
  }


  getRssHTML(text, bShowFull) {
    if (typeof bShowFull === 'undefined') {
      bShowFull = true;
    }

    let rawText = text;
    if (!rawText) {
      return "";
    }

    if (rawText.search("<br") > -1) {
      rawText = rawText.substring(0, rawText.search("<br"));
    }

    rawText = rawText.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
    rawText = rawText.replace(/(&#60;p[^&#62;]+?&#62;|&#60;p&#62;|&#60;\/p&#62;)/img, "");
    rawText = rawText.replace(/(^&;$)/g, ' ');

    if (!bShowFull) {
      rawText = this.getSummary(rawText);
    }

    return rawText;
  }



  getScraperPostHTML(text) {

    let rawText = text;
    if (!rawText) {
      return "";
    }
    const summaryText = this.getLongSummary(rawText);
    rawText = this.getRichTitle(summaryText);


    rawText = this.parseLinks(rawText);
    rawText = this.parseUsernames(rawText);
    rawText = this.parseHashtags(rawText);
    return '<div class="scrape-post-title"><b><p>' + rawText + '</p><b></div>';
  }

  parseLinks(rawText) {
    const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig;
    const urlRegexFS = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:flowstream.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/ig;

    if (rawText.search(urlRegex) > -1 && rawText.search(urlRegexFS) > -1) {
      rawText = rawText.replace(urlRegex, (url) => {
        let refLabel = "", refTitle = "";
        const linkClass = "flowstream-deeplink";
        if (url.search("@") > -1) {
          refLabel = url;
          refTitle = "Mail to";
        } else {
          refLabel = url;
          refTitle = "Go to website";

        }
        const target = "_blank";
        if (url.search('www') > -1) {
          if (url.search('http://') > -1) {
            return '<a class="' + linkClass + '" title="' + refTitle + '" href="' + url + '" target="' + target + '">' + refLabel + '</a>';
          } else {
            return '<a class="flowstream-deeplink" title="' + refTitle + '" href="http://' + url + '" target="' + target + '">' + refLabel + '</a>';
          }

        } else if (url.search("@") > -1) {
          return '<a class="flowstream-deeplink" title="' + refTitle + '" href=mailto:"' + url + '" target="' + target + '">' + refLabel + '</a>';
        } else {
          return '<a class="flowstream-deeplink" title="' + refTitle + '" href="' + url + '" target="' + target + '">' + refLabel + '</a>';
        }
      });
    }

    return rawText;
  }

  parseUsernames(rawText) {
    const usernameRegex = /(^|\W+)\@([\w\-]+)/gm;
    if (rawText.search(usernameRegex) > -1) {
      rawText = rawText.replace(usernameRegex, (url) => {
        const refLink = url.substring(url.search("@"), url.length);
        const refTitle = "Go to user timeline";
        return ' ' + '<a class="flowstream-deeplink-twitter-user" title="' + refTitle + '" href="https://www.twitter.com/' + refLink + '" target="_blank">' + refLink + '</a>';
      });
    }
    return rawText;
  }

  parseHashtags(rawText) {
    const hashtagRegex = /\#([\w\-]+)/gm;
    if (rawText.search(hashtagRegex) > -1) {
      rawText = rawText.replace(hashtagRegex, (url) => {
        const refLink = url;
        const refTitle = "Go to hashtag";
        return '<a class="flowstream-deeplink-hashtag" title="' + refTitle + '" href="https://www.twitter.com/' + refLink + '" target="_blank">' + refLink + '</a>';
      });
    }
    return rawText;
  }

  getDefaultText(rawText) {
    if (!!rawText) {
      return '<div class="TEXT"><p>' + rawText + '</p></div>';
    } else {
      return '';
    }
  }

  getTitle(rawText) {
    if (!!rawText) {
      return '<div class="post__title"><p>' + rawText + '</p></div>';
    } else {
      return '';
    }
  }

  getDescription(text) {
    let rawText = text;
    if (!rawText) {
      return "";
    }
    const summaryText = this.getLongSummary(rawText);
    rawText = this.getRichTitle(summaryText);
    rawText = this.parseLinks(rawText);
    rawText = this.parseUsernames(rawText);
    rawText = this.parseHashtags(rawText);
    return '<div class="post__description"><p>' + rawText + '</p></div>';
  }

  /**
   * find the first sentence
   */
  getSummary(rawText) {
    const res = rawText.match(/([^ \r\n][^!?\.\r\n]+[\w!?\.]+)/g);
    return res && res.length > 0 ? res[0] : "";
  }

  getTextSummary(rawText) {
    const res = rawText.match(/^.*?[\.!\?](?:\s|$)/);
    return res && res.length > 0 ? res[0] : "";
  }

  /**
   * find the first 200 chars, cut after word
   */
  getLongSummary(rawText) {
    const res = rawText.replace(/^(.{280}[^\s]*).*/, "$1");
    return res;
  }

  getShortSummary(rawText): string {
    const res = rawText.replace(/^(.{30}[^\s]*).*/, "$1");
    return res;
  }

  getRichTitle(text) {
    let rawText = text;
    /**
     * filter out <p> and </p>
     */
    rawText = rawText.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
    rawText = rawText.replace(/(&#60;p[^&#62;]+?&#62;|&#60;p&#62;|&#60;\/p&#62;)/img, "");

    /** filter out ' **/

    rawText = rawText.replace(/&#8217;/img, "'");
    rawText = rawText.replace(/&#8216;/img, "'");
    rawText = rawText.replace(/&#8221;/img, '"');

    rawText.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

    rawText = rawText.replace(/&#8220;/img, '"');
    rawText = rawText.replace(/&#8221;/img, '"');


    return rawText;
  }

  getResourceLocation(resourceNameString) {

    let domain;
    // find & remove protocol (http, ftp, etc.) and get domain
    if (resourceNameString.indexOf("://") > -1) {
      domain = resourceNameString.split('/')[2];
    } else {
      domain = resourceNameString.split('/')[0];
    }

    // find & remove port number
    domain = domain.split(':')[0];

    return domain;

  }

  /**
   * get current date minus previous interval
   */
  getCurrentPageDate(page) {
    let nextTime;
    const newDate = new Date();
    let nextDayTime = (60 * 60 * 24) * 1000; // 1 day in ms
    // let nextWeekTime = (60 * 60 * 24 * 7) * 1000; // 1 week in ms
    nextDayTime = nextDayTime * page;
    nextTime = newDate.getTime() - nextDayTime;
    let previousDate = new Date(nextTime);
    previousDate = new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate() + 1);
    // console.log("get current page date = ", ParserService.parseDateTimeLabel(previousDate), " for page = ", page);
    return previousDate;
  }

  parseDateLabel(dateString) {
    const date = this.getDate(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const sMonth = dateFormat.i18n.monthNames[month];
    const day = date.getDate();
    const sDay = (day < 10) ? "0" + day.toString() : day.toString();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return sDay + " " + sMonth + " " + year;
  }

  parseTimelineLabel(dateString) {
    const date = this.getDate(dateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const sMonth = month > 9 ? month : "0" + month;
    const day = date.getDate();
    const sDay = day > 9 ? day : "0" + day;
    return year + "-" + sMonth + "-" + sDay;
  }

  parseDateTimeLabel(dateString) {
    const date = this.getDate(dateString);

    const year = date.getFullYear();
    const month = date.getMonth();
    const sMonth = dateFormat.i18n.monthNames[month];
    const day = date.getDate();
    const hour = date.getHours();
    const sHour = hour > 9 ? hour : "0" + hour;
    const minute = date.getMinutes();
    const sMinute = minute > 9 ? minute : "0" + minute;
    const second = date.getSeconds();

    return day + " " + sMonth + " " + year + " - " + sHour + ":" + sMinute;
  }

  getDate(dateString) {
    return new Date(Number(dateString));
  }

  parseFeedResourceName(resourceNameString) {
    const path = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

    if (path.test(resourceNameString)) {

      let domain;
      // find & remove protocol (http, ftp, etc.) and get domain
      if (resourceNameString.indexOf("://") > -1) {
        domain = resourceNameString.split('/')[2];
      } else {
        domain = resourceNameString.split('/')[0];
      }

      domain = domain.split(':')[0];

      /**
       * if there's a www, rss or feeds in the url
       */
      if (domain.indexOf("www") > -1 || domain.indexOf("feeds") > -1 || domain.indexOf("rss") > -1) {
        domain = domain.split('.')[1];
      } else {
        domain = domain.split('.')[0];
      }
      return domain;
    } else {
      return resourceNameString;
    }
  }

  /**
   * get class based on the content of this post
   */
  parseSizeClassForContent(contentType) {
    let sizeClass;
    // console.log(' contentType', contentType);
    if (contentType.search(ContentType.MULTIPLE) > -1) {
      sizeClass = "big free";
    } else if (contentType === ContentType.TEXT_TWITTER) {
      sizeClass = "small";
    } else {
      sizeClass = "";
    }
    // console.log("tag helper, ------------------------- parse sizeClass for content = " + sizeClass);
    return sizeClass;
  }

}
