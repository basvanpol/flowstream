import * as mongoose from 'mongoose';
import { FeedFunctions } from '../features/feeds/feedFunctions';
const feedFunctions = new FeedFunctions();

export default (app) => {

    app.post('/api/feeds/subscribe', async (req, res) => {
        await feedFunctions.handleFeed(req, res);
        await feedFunctions.handleUser(req, res);
        await feedFunctions.handleSubscription(req, res);
        await feedFunctions.getAllFeaturedFeeds(req, res);
    });

    app.post('/api/feeds/unsubscribe', async(req, res) => {
        await feedFunctions.handleFeed(req, res);
        await feedFunctions.handleUser(req, res);
        await feedFunctions.handleSubscription(req, res);
        await feedFunctions.getAllFeaturedFeeds(req, res)
    });

    app.post('/api/feeds/feature', async (req, res) => {
        await feedFunctions.handleFeed(req, res);
        await feedFunctions.removeFeature(req, res)
        await feedFunctions.savefeature(req, res)
        await feedFunctions.handleUser(req, res)
        await feedFunctions.handleSubscription(req, res)
        await feedFunctions.getAllFeaturedFeeds(req, res) 
    })

    app.get('/api/feeds/featured', async(req, res) => {
        await feedFunctions.getAllFeaturedFeeds(req, res)
    })

    // app.get('/api/feeds/usersubscriptions', async(req, res))


}