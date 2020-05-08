import * as OAuth from 'oauth';
// const keys = require('./../config/keys');
const mongoose = require('mongoose');
const Token = mongoose.model('Token');

export default async(app) => {

    const oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        process.env.twitterConsumerKey,
        process.env.twitterConsumerSecret,
        '1.0A',
        null,
        'HMAC-SHA1'
    );

    const tokens = await Token.find({}).limit(2);
    let subQueue = [];
    let tooManyRequests = false;
    if (tokens && tokens.length > 0) {
        let token = tokens[0];
        if (token) {
            app.get('/api/twitter/search', (req, res) => {
                oauth.get(
                    `https://api.twitter.com/1.1/users/search.json?q=${req.query.q}&page=1`,
                    token.token, //test user token
                    token.tokenSecret, //test user secret            
                    (e, data, result) => {
                        if (e) console.error(e);
                        const parsedData = parseData(data);
                        res.status(200).send({ data: parsedData, message: 'ok' });
                    });
            });
        }
    }


    // app.post('/api/twitter/search', (req, res) => {
    //     oauth.get(
    //         `https://api.twitter.com/1.1/users/search.json?q=${req.query.q}&page=1`,
    //         '378751182-osBanchlb3uXld55fvplBW6weEChmQBbOrhmPb2r', //test user token
    //         'QxPyt7u4cx25kH0KHnZWCfbk2kxceYALhtyAasw4kNk', //test user secret            
    //         (e, data, result) => {
    //             if (e) console.error(e);
    //             const parsedData = parseData(data);
    //             //console.log('res', res);   
    //             res.status(200).send({ data: parsedData, message: 'ok' });
    //         });

    // });

    const parseData = ((data) => {
        const jsonData = JSON.parse(data);
        const parsedData = [];
        for (let key in jsonData) {
            const value = jsonData[key];
            // console.log('search value', value);
            if (value['id_str']) {
                const parsedDataItem = {
                    feedId: value['id_str'],
                    feedName: value['name'],
                    feedType: 'TWITTER',
                    feedIcon: value.profile_image_url.toString()
                }
                parsedData.push(parsedDataItem);
            }
        }
        return parsedData;
    })



};