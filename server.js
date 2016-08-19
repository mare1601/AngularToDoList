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
    //var path = require('path');
    var ObjectID = mongo.ObjectID;

    // load the configuration ====================
    var db = mongoose.connect(database.url);

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(methodOverride());
    app.use(stormpath.init(app,{
      postLogoutHandler: function (account, req, res, next) {
        console.log('User', account.fullName, 'just logged out!');
        account.getCustomData(function(err, customData) {
            if(customData.group === 'DriveBar'){
              console.log('winning');
            };
        });
        next();
      },
      postLoginHandler: function (account, req, res, next) {
        account.getCustomData(function(err, customData) {
          if(customData.group === 'DriveBar'){
            nextUri: '/todo.html'
          }
          else {
            nextUri: 'index.html'
          };
        });
        next();
      },
      enableForgotPassword: true,
      web: {
        me: {
          expand: {
            customData: true
          }
        },
        register: {
          nextUri: '/login.html'
        },
        login: {
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

    // load the routes
    require('./app/routes')(app);

    app.on('stormpath.ready', function () {
      console.log('Stormpath Ready');
    });

    // listen (start app with node server.js) =============
    app.listen(8080);
    console.log('Magic is happening on port' + port);
