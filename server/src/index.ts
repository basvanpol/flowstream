require('dotenv').config();
import * as mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import * as express from 'express';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
// const keys = require('./config/keys');
import * as cors from 'cors';
const fs = require('fs');
const path = require('path');
const https = require('https');
require('./models/Token');
const collector = require('./services/feedPostCollector');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');


import './models/Flow';
import './models/Feed';
import './models/FeedFeature';
import './models/User';
import './models/Group';
import './services/passport';
import authRoutes from './routes/authRoutes';
import twitterRoutes from './routes/twitterRoutes';
import feedRoutes from './routes/feedRoutes';
import flowRoutes from './routes/flowRoutes';
import groupRoutes from './routes/groupRoutes';
import postRoutes from './routes/postRoutes';
import scrapeRoutes from './routes/scrapeRoutes';

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

collector.initFeedPostCollector();

const app = express();

// const certOptions = {
//     key: fs.readFileSync(path.resolve('certs/server.key')),
//     cert: fs.readFileSync(path.resolve('certs/server.crt'))
// }

// const server = https.createServer(certOptions, app)

app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json());
app.use(cors({
    origin: ['chrome-extension://gfjkeoihbpgjebcmcpmpjggcdcbihdng', 'http://localhost:3000', 'http://localhost:4200'],
    credentials: true
}))

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.cookieKey]
    })
);


app.use(passport.initialize());
app.use(passport.session());
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver
}))

authRoutes(app)
twitterRoutes(app);
feedRoutes(app);
flowRoutes(app);
groupRoutes(app);
postRoutes(app);
scrapeRoutes(app);
//another way of writing this would be: require('./routes/authRoutes')(app)
// the require function returns a function that we then immediately call with the app as variable


// if (process.env.NODE_ENV === 'production') {
//     // Express will serve up production assets like our main.js file
//     app.use(express.static('client/build'))
//     // Express will serve up the index.html file when it doesn't recognise the route
//     const path = require('path');
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     })
// }

//const PORT = process.env.PORT || 6000;



const PORT = 8090;
app.listen(PORT);