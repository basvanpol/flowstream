import * as mongoose from 'mongoose';
import { FeedFunctions } from '../features/feeds/feedFunctions';
const feedFunctions = new FeedFunctions();

export default (app) => {

    app.post('/api/feeds/subscribe', async (req, res) => {
        await feedFunctions.handleFeed(req, res, this.getAllFeeds);
        await feedFunctions.handleUser(req, res, this.getAllFeeds);
        await feedFunctions.handleSubscription(req, res, this.getAllFeeds);
        await feedFunctions.getAllFeeds(req, res);
    });

    app.post('/api/feeds/unsubscribe', async(req, res) => {
        await feedFunctions.handleFeed(req, res, this.getAllFeaturedFeeds);
        await feedFunctions.handleUser(req, res, this.getAllFeaturedFeeds);
        await feedFunctions.handleSubscription(req, res, this.getAllFeaturedFeeds);
        await feedFunctions.getAllFeeds(req, res)
    });

    app.post('/api/feeds/feature', async (req, res) => {
        await feedFunctions.handleFeed(req, res, this.getAllFeaturedFeeds);
        await feedFunctions.removeFeature(req, res, this.getAllFeaturedFeeds)
        await feedFunctions.savefeature(req, res, this.getAllFeaturedFeeds)
        await feedFunctions.handleUser(req, res, this.getAllFeaturedFeeds)
        await feedFunctions.handleSubscription(req, res, this.getAllFeaturedFeeds)
        await feedFunctions.getAllFeeds(req, res) 
    })

    app.get('/api/feeds/featured', async(req, res) => {
        await feedFunctions.getAllFeeds(req, res)
    })

    // app.get('/api/feeds/usersubscriptions', async(req, res))


}