const express = require('express')
const router = express.Router()
const uberKeys = require('../config/uberKeys')
const patKey = require('../config/patKey')
const Uber = require('node-uber') //I am using node-uber npm package to assist with my app auth
const rp = require('request-promise')

const uber = new Uber({
    client_id: uberKeys.client_id,
    client_secret: uberKeys.client_secret,
    server_token: uberKeys.server_token,
    redirect_uri: uberKeys.redirect_uri,
    name: uberKeys.name,
    language: uberKeys.language // optional, defaults to en_US
    //sandbox: true, // optional, defaults to false
    //proxy: 'PROXY URL' // optional, defaults to none
})

router.route('/v1.2/login')

    .get(function(req, res) {
        //gets the uber login page for the client
        const url = uber.getAuthorizeUrl(['history', 'places'])
        res.redirect(url)
    })

router.route('/v1.2/callback')

    .get(function (req, res, next) {
        //obtains the client-specific access token
        uber.authorizationAsync({authorization_code: req.query.code})
            .spread(function (access_token, refresh_token, authorizedScopes, tokenExpiration) {
                // store the user id and associated access_token, refresh_token, scopes and token expiration date
                console.log('New access_token retrieved: ' + access_token);
                console.log('... token allows access to scopes: ' + authorizedScopes);
                console.log('... token is valid until: ' + tokenExpiration);
                console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

                // redirects to my two API calls
                // user will receive final output of the below route
                res.redirect('http://localhost:3000/main')
            })
            .error(function (err) {
                console.error(err)
            })
    })

router.route('/v1.2/estimates/price')

    .get(function (req, res, next) {
        // let query = url.parse(req.url, true).query
        //
        // if (!query || !query.lat || !query.lng) {
        //     res.sendStatus(400)
        // }
        // else {
        //     uber.estimates.getPriceForRouteAsync(42.349341, -71.103982, 42.369133, -71.021338) //start at 700CommAve (BU); end at BostonLoganAirportTerminalE
        //         .then(function(res) {
        //             res.json(res)
        //         })
        //         .error(function(err) {
        //             console.error(err)
        //             res.sendStatus(500)
        //         })
        // }
        uber.estimates.getPriceForRouteAsync(42.349341, -71.103982, 42.369133, -71.021338) //start at 700CommAve (BU); end at BostonLoganAirportTerminalE
            //based on chosen location for obtaining the weather
            .then(function(response) {
                res.json(response)
            })
            .error(function(err) {
                console.error(err)
                res.sendStatus(500)
            })
    })

router.route('/pat')
    // this route is for testing purposes only
    // this route is NOT CALLED in the final app product
    .get(function (req, res, next) {
        const options = {
            uri: 'https://api.uber.com/v1.2/estimates/price?start_latitude=42.349341&start_longitude=-71.103982&end_latitude=42.369133&end_longitude=-71.021338&access_token=' + patKey.pat,
            json: true
        }
        rp(options)
            .then(function (response) {
                res.json(response)
            })
    })

module.exports = router