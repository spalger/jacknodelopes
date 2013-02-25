/**
 * Created with JetBrains WebStorm.
 * User: redaphid
 * Date: 3/9/13
 * Time: 1:39 PM
 * To change this template use File | Settings | File Templates.
 */
var socketIO = require("socket.io");
var express		 = require('express');
var app = express();
app.use( express.bodyParser() );
app.use( express.static( __dirname + "/lib" ) );
app.listen(1337);
