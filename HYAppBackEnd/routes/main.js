const express = require('express')
const router = express.Router()
const request = require('request-promise')
const async = require('async')
const mongoose = require('mongoose')
//const estdb = require('./estdb') NOT PART OF CODE

mongoose.connect('mongodb://localhost/estInfo')
const db = mongoose.connection
db.once('open', function () {
    console.log('Connection successful.')
})

const Schema = mongoose.Schema
const estdbSchema = new Schema({
    date: String,
    weatherState: String,
    temp: Number,
    price: Number,
    time: Number
})
const estdb = mongoose.model('estdb', estdbSchema)

router.route('/')
//user must be logged into uber and the app auth'd before calling this route
    .get(function (req, res) {
        async.waterfall([getWeather, storeWeather, getPrice], function (err, today) {
            if (err) {
                console.log(err)
            }
            else {
                estdb.find({date: today}, {_id: 0, __v: 0}, function (err, results) {
                    console.log(results)
                    let todayTemp = results[0].temp
                    res.send(`Today is ${today} and the temp is ${todayTemp}.`) //An UberX ride from Warren Towers to Boston Logan Airport Terminal E will take ${uberInfo.time} seconds and costs ${uberInfo.price}.`)
                })
            }
        })
    })

const getWeather = function (cb) {
    //weather api call
    const weatherURL = 'https://www.metaweather.com/api/location/2367105/'

    request.get(weatherURL)
        .then(function (res) {
            let wx = JSON.parse(res)

            cb(null, wx)
        })
}

const storeWeather = function (wx, cb) {
    //store in mongodb
    let today = wx.consolidated_weather[0].applicable_date
    let newWeather = new estdb(
        {
            date: wx.consolidated_weather[0].applicable_date,
            weatherState: wx.consolidated_weather[0].weather_state_name,
            temp: wx.consolidated_weather[0].the_temp
        },
        {__v: 0})
    newWeather.save().then(console.log(newWeather))

    cb(null, today)
}

const getPrice = function (today, cb) {
    //uber price est api call
    cb(null, today)

    // request.get('http://localhost:3000/uber/v1.2/login') //uri: http://localhost:3000/uber/v1.2/estimates/price
    //     .then(function (res) {
    //
    //         cb(null, wx)
    //     })
}

module.exports = router;