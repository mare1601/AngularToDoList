// server.js

    //set up ============================
    var express = require('express');
    var app     = express();
    var mongoose  = require('mongoose');
    var port = process.env.PORT || 8080;
    var database = require('./config/database');
    var morgan    = require('morgan')
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var stormpath = require('express-stormpath');
    var path = require('path');
    var ObjectID = mongoose.ObjectID;

    // load the configuration ====================
    mongoose.connect(database.url);

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(methodOverride());
    app.use(stormpath.init(app,{
      postRegistrationHandler: function (account, req, res, next) {
        var collection = database.get('loginauth');
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
      web: {
        spa: {
          enabled: true,
          view: path.join(__dirname, '..', 'client', 'index.html')
        }
      }
    }));


    // load the routes
    require('./app/routes')(app);

    app.on('stormpath.ready', function () {
      console.log('Stormpath Ready');
    });

    // listen (start app with node server.js) =============
    app.listen(8080);
    console.log('Magic is happening on port' + port);
