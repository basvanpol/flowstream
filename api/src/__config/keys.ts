// figure out what credentials to return


if(process.env.NODE_ENV === 'production'){
    //we are in prod, return prod keys
    module.exports = require('./prod');
}else{
    //we are not in production, but in dev, return dev keys
    module.exports = require('./dev');
}

