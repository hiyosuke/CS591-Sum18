//this file was originally named "index.js". it has since been refactored into its current name

const express = require('express');
const router = express.Router();
//const request = require('request');

router.route('/:name')

.get (function (req, res, next) {
    req.params.name = {
        string: `${req.params.name}`,
        length: req.params.name.length
    }
    res.json(req.params.name)
})

router.route('/')

.post (function (req, res, next) {
    let name  = {
        string: req.body.string,
        length: req.body.string.length
    }
    res.json(name)
})

module.exports = router;
