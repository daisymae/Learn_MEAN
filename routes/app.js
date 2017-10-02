var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    // back to the original:
    res.render('index');

});

module.exports = router;
