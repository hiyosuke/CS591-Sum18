const express = require('express')
const router = express.Router()
const uberKeys = require('../config/uberKeys')
const Uber = require('node-uber')

const uber = new Uber({
    uberKeys
})

router.route('/v1.2/login')

    .get(function (req, res) {
        //gets the uber login page for the client
        const url = uber.getAuthorizeUrl(['history', 'places'])
        res.redirect(url) //url is: http://login.uber.com/oauth/v2/authorize?client_id=<my_client_id>&response_type=code
    })

router.route('/v1.2/callback')

    .get(function (req, res, next) {
        //obtains the client-specific access token
        console.log('hello') //testing to see if route entered this part of code or not
        uber.authorizationAsync({authorization_code: req.query.code})
            .spread(function (access_token, refresh_token, authorizedScopes, tokenExpiration) {
                // store the user id and associated access_token, refresh_token, scopes and token expiration date
                console.log('New access_token retrieved: ' + access_token);
                console.log('... token allows access to scopes: ' + authorizedScopes);
                console.log('... token is valid until: ' + tokenExpiration);
                console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

                // redirect the user back to your actual app
                res.redirect('http://localhost:3000/main')
            })
            .error(function (err) {
                console.error(err)
            })
    })

router.route('/v1.2/estimates/price')

    .get(function (req, res, next) {
        let query = url.parse(req.url, true).query

        if (!query || !query.lat || !query.lng) {
            res.sendStatus(400)
        }
        else {
            uber.estimates.getPriceForRouteAsync(42.349341, -71.103982, 42.369133, -71.021338) //start at 700CommAve (BU); end at BostonLoganAirportTerminalE
                .then(function(res) {
                    res.json(res)
                })
                .error(function(err) {
                    console.error(err)
                    res.sendStatus(500)
                })
        }
    })

module.exports = router