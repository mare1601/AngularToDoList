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

    // load the configuration ====================
    mongoose.connect(database.url);

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(methodOverride());

    // load the routes
    require('./app/routes')(app);

    // listen (start app with node server.js) =============
    app.listen(8080);
    console.log('Magic is happening on port' + port);
