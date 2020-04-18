require('dotenv').config();
import * as mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const fs = require('fs');
const path = require('path');
const https = require('https');
require('./models/Token');
const collector = require('./services/feedPostCollector');
const cluster = require('cluster');

import './models/Flow';
import './models/Feed';
import './models/FeedFeature';
import './models/User';
import './models/UserFeedSubscription';
import './models/Group';

const corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};


mongoose.Promise = global.Promise;

mongoose.connect(process.env.mongoURI, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

if (cluster.isMaster) {
    cluster.fork();
    cluster.fork();
    cluster.fork();
    collector.initFeedPostCollector();
} 


 