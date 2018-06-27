const express = require('express')
const router = express.Router()
const request = require('request-promise')
const async = require('async')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/est')
const db = mongoose.connection
db.once('open', function () {
    console.log('Connection successful.')
})

const Schema = mongoose.Schema
const estdbSchema = new Schema({
    date: String,
    weatherState: String,
    temp: Number,
    price: String,
    time: Number
})
const estdb = mongoose.model('estdb', estdbSchema)

router.route('/')
    // this route is called after user logs into uber and the app is auth'd
    // see uber.js line 41

    .get(function (req, res) {
        async.waterfall([getWeather, getPrice], function (err, today) {
            if (err) {
                console.log(err)
            }
            else {
                estdb.find({date: today}, function (err, results) {
                    res.json({"message": `Today is ${results[0].date}. 
                    The temp is ${results[0].temp} and the weather state is ${results[0].weatherState}. 
                    An UberX ride from Warren Towers to Boston Logan Airport Terminal E will take ${results[0].time} seconds and costs ${results[0].price}.`})
                })
            }
        })
    })

const getWeather = function (cb) {
    //weather api call
    const weatherURL = 'https://www.metaweather.com/api/location/2367105/' //location is based on woeid (where on earth id); id here is for Boston

    request.get(weatherURL)
        .then(function (res) {
            let wx = JSON.parse(res)

            cb(null, wx)
        })
}

const getPrice = function (wx, cb) {
    //uber price est api call
    const patURL = 'http://localhost:3000/uber/pat' //for testing purposes only
    const priceURL = 'http://localhost:3000/uber/v1.2/estimates/price'
    request.get(priceURL)
        .then(function (res) {
            let up = JSON.parse(res)
            let today = wx.consolidated_weather[0].applicable_date
            let newEst = new estdb(
                {
                    date: wx.consolidated_weather[0].applicable_date,
                    weatherState: wx.consolidated_weather[0].weather_state_name,
                    temp: wx.consolidated_weather[0].the_temp,
                    price: up.prices[1].estimate,
                    time: up.prices[1].duration
                }
            )
            newEst.save().then(
                console.log(newEst)
            )

            cb (null, today)
        })
}

module.exports = router;