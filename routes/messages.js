var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Message = require('../models/message');

router.get('/', function (req, res, next) {
  Message.find()
    .populate('user', 'firstName')
    .exec(function(err, messages) {
      if(err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err        
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: messages
      });
    });
});

router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, 'secret', function(err, decoded) {
    if(err) {
      return res.status(401).json({
        title: 'Not authenticated',
        error: err
      });
    }
    // continue on to the requested route that requires authenticated user
    next();
  })
})

router.post('/', function(req, res, next) {
  var decoded = jwt.decode(req.query.token);
  User.findById(decoded.user._id, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    //console.log("in post: request body content: " + req.body.content);
    var message = new Message({
      content: req.body.content,
      user: user
    });
    message.save(function(err, result) {
      if(err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      // put newly created message in messages for the current user
      user.messages.push(message);
      user.save();
      // 201: resource created
      res.status(201).json({
        message: 'Saved message',
        obj: result
      });
    });
  
  });
});

// Patch will update the changed fields in the existing message
router.patch('/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  Message.findById(req.params.id, function (err, message) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!message) {
      return res.status(500).json({
        title: "No Message Found!",
        error: {message: 'Message not found'}
      });
    }
    if(message.user != decoded.user._id) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: {message: 'Users do not match'}
      });      
    }
    message.content = req.body.content;
    message.save(function(err, result) {
      if(err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Updated message',
        obj: result
      });
    });
  });
});

router.delete('/:id', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  Message.findById(req.params.id, function (err, message) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!message) {
      return res.status(500).json({
        title: "No Message Found!",
        error: {message: 'Message not found'}
      });
    }
    if(message.user != decoded.user._id) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: {message: 'Users do not match'}
      });      
    }
    message.remove(function(err, result) {
      if(err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Deleted message',
        obj: result
      });
    });
  });
});

module.exports = router;
