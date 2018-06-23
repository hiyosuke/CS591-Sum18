// NOT PART OF CODE
// DO NOT CHECK THIS

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

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

router.route('/:wx')

    .get(function (req, res, next) {
        //specifically built to serve the main waterfall
        let search = req.params.wx
        let today = search.consolidated_weather[0].applicable_date
        estdb.find({date: today}, {_id: 0, __v: 0}, function (err, results) {
            if (results.length === 0) {
                //console.log('word does not exist in db')
                let newWeather = new estdb(
                    {
                        date: search.consolidated_weather[0].applicable_date,
                        weatherState: search.consolidated_weather[0].weather_state_name,
                        temp: search.consolidated_weather[0].the_temp
                    },
                    {__v: 0})
                newWeather.save().then(res.json(newWeather))
            }
            else {
                //console.log('word does exist')
                res.json(results)
            }
        })
    })

    .delete(function (req, res, next) {
        //specifically built to delete entry created during waterfall after printing output to user
        let search = req.params.wx
        let today = search.consolidated_weather[0].applicable_date
        estdb.findOneAndRemove({date: today}, (err, results) => {
            if (results) {
                res.send('String successfully deleted')
            }
            else {
                res.send('String not found')
            }
        })
    })

module.exports = estdb