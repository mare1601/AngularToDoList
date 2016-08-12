// server.js

    //set up ============================
    var express = require('express');
    var stormpath = require('express-stormpath');
    var app     = express();
    var mongoose  = require('mongoose');
    var mongo = require('mongodb');
    var port = process.env.PORT || 8080;
    var database = require('./config/database');
    var morgan    = require('morgan')
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var path = require('path');
    var monk = require('monk');
    var db = monk('localhost:8080/angulartodolist');
    var ObjectID = mongo.ObjectID;

    // load the configuration ====================
    mongoose.connect(database.url);

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(methodOverride());
    app.use(stormpath.init(app,{
      postLogoutHandler: function (account, req, res, next) {
        console.log('User', account.email, 'just logged out!');
        next();
      },
      postRegistrationHandler: function (account, req, res, next) {
        var collection = db.get('loginauth');
        var mongo_id = new ObjectID();
        collection.insert( { _id: mongo_id } );
        account.customData["mongo_id"] = mongo_id;
        account.customData.save(function(err) {
         if (err) {
             console.log('Did not save user!!');
             next(err);
         } else {
             console.log('Success! Data saved!');
         }
     });
        next();
    },
    enableForgotPassword: true,
    expandCustomData: true,
      web: {
        register: {
          nextUri: '/todo.html'
        },
        login: {
          nextUri: '/todo.html'
        },
        logout: {
          enabled: true,
          uri: '/logout',
        }
      },

    }));

    app.use(function(req,res,next) {
      req.db = db;
      next();
    });
    app.get('/DriveBar', stormpath.groupsRequired(['DriveBar']), function(req, res) {
      res.send('You are an admin!');
    });

    app.get('index.html', stormpath.loginRequired, function(req, res) {
      res.send('If you can see this page, you must be logged into your account!');
    });
    // load the routes
    require('./app/routes')(app);

    app.on('stormpath.ready', function () {
      console.log('Stormpath Ready');
    });

    // listen (start app with node server.js) =============
    app.listen(8080);
    console.log('Magic is happening on port' + port);
