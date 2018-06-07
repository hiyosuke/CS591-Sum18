const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testspace')
const db = mongoose.connection
db.once('open', function () {
    console.log('Connection successful.')
})

const Schema = mongoose.Schema
const stringSchema = new Schema({
    name: String,
    length: Number
})
const string = mongoose.model('string', stringSchema)

router.route('/:name')

    .get(function (req, res, next) {
        let search = req.params.name
        string.find({name: search}, {_id: 0, __v: 0}, function (err, results) {
            if (results.length === 0) {
                //console.log('word does not exist in db')
                let newString = new string({name: search, length: search.length}, {__v: 0})
                newString.save().then(res.json(newString))
            }
            else {
                //console.log('word does exist')
                res.json(results)
            }
        })
    })

    .delete(function (req, res, next) {
        let search = req.params.name
        string.findOneAndRemove({name: search, length: search.length}, (err, results) => {
            if (results) {
                res.send('String successfully deleted')
            }
            else {
                res.send('String not found')
            }
        })
    })

router.route('/')

    .get(function (req, res, next) {
        string.find({}, {_id:0, __v:0}, function (err, results) {
            res.json(results)
        })
    })

    .post(function (req, res, next) {
        let search = req.body.string
        string.find({name: search}, {_id: 0, __v: 0}, function (err, results) {
            if (results.length === 0) {
                //console.log('word does not exist in db')
                let newString = new string({name: search, length: search.length})
                newString.save().then(res.json(newString))
            }
            else {
                //console.log('word does exist')
                res.json(results)
            }
        })
    })

module.exports = router;
