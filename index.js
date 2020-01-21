var cors = require('cors')
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var { appConfig } = require('./src/constants/appConfig');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors())
app.use(bodyparser({extended:true}));


var user = require('./src/routes/user');

app.use('/api/user/v1',user);

app.use('**', function(req, res) {
    res.status(400).json({
      success: false,
      error: 'Invalid request'
    });
  });


// Error Handling
app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message
    });
  });


app.listen(appConfig.port,()=>{

    console.log('listening on server =='+appConfig.port);


})

process.on('uncaughtException', function(err) {
    process.exit(1);
  });