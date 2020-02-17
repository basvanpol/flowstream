'use strict';

var express = require('express');
var request = require('request');
var cheerio = require("cheerio");
// var metascraper = require("metascraper");
const Metascraper = require('metascraper')
var queryRouter = express.Router();

export default (app) => {

    app.post('/api/scrapedcontent/', async (req, res) => {
        req.header("Access-Control-Allow-Origin", "*");
        req.header("Access-Control-Allow-Headers", "X-Requested-With");
        var oReq = req.body;
        var sType = oReq.type;
        var imageUrl;
        var title;
        var description;
        var publisher;

        console.log('url', req.body.url);

        const metadata = await Metascraper.scrapeUrl(req.body.url);
        if (metadata) {
            if (sType == "twitter") {
                console.log('twitter description', metadata.description);
                var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                const description = metadata.description;
                var regex = new RegExp(expression);
                let aUrl;
                if(description){
                    aUrl = description.match(regex);
                }
                if (aUrl && aUrl.length > 0) {
                    const indirectArticleUrl = aUrl[0];
                    console.log('URL array', indirectArticleUrl);
                    const indirectMetadata = await Metascraper.scrapeUrl(indirectArticleUrl);
                    if (indirectMetadata) {
                        imageUrl = indirectMetadata.image;
                        console.log('whoehei!', imageUrl);
                    }
                } else {
                    if (metadata.image) {
                        console.log('metadata.image', metadata.image);
                        imageUrl = metadata.image;
                    } else {
                        request(req.body.url, function (error, response, body) {
                            if (!error) {
                                var $ = cheerio.load(body);
                                var $image;
                                $image = $('meta[property="og:image"]');
                                console.log('$image', $image);
                                if ($image != undefined) {
                                    imageUrl = $image.attr('content')
                                    console.log('>> imageUrl', imageUrl);
                                } else {
                                    $image = $('article').find('img');
                                    if ($image != undefined) {
                                        imageUrl = getImageUrl($image);
                                    }
                                }
                            } else {
                                console.log("We’ve encountered an error: " + error);
                            }
    
                        })
                    }
                }
            } else {
                if (metadata.image) {
                    imageUrl = metadata.image;
                } else {
                    request(req.body.url, function (error, response, body) {
                        if (!error) {
                            var $ = cheerio.load(body);
                            var $image;
                            $image = $('meta[property="og:image"]');
                            console.log('$image', $image);
                            if ($image != undefined) {
                                imageUrl = $image.attr('content')
                            } else {
                                $image = $('article').find('img');
                                if ($image != undefined) {
                                    imageUrl = getImageUrl($image);
                                }
                            }
                        } else {
                            console.log("We’ve encountered an error: " + error);
                        }

                    })
                }
            }


            console.log('meta data', metadata);
            title = (metadata.title) ? metadata.title : '';
            description = (metadata.description) ? metadata.description : '';
            publisher = (metadata.publisher) ? metadata.publisher : '';


            res.json({
                imageUrl: imageUrl,
                title: title,
                description: description,
                publisher: publisher
            })
        }
    })
}


var getImageUrl = function ($image) {
    console.log('get $image', $image);
    var imageUrl = $image.attr('src');
    if (imageUrl == undefined) {
        imageUrl = $image.attr('srcset');
        if (imageUrl != undefined) {
            var aImageUrl = imageUrl.split(',', 1);
            imageUrl = aImageUrl[0].split(" ")[0];
        }
    }

    return imageUrl;
};
