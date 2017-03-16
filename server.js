console.log('starting server');

var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var morgan=require('morgan');
var mongoose=require('mongoose');
var config = require('./config');
var path= require('path');
var multer = require('multer');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, X-Requested-With, Authorization');
		next();
});

app.use(morgan('dev'));
mongoose.connect(config.database);
app.use(express.static(__dirname+'/public'));

var apiRouter = require('./app/routes/api')(app,express);
app.use('/api', apiRouter);

app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});




app.listen(config.port);
console.log('Magic happens on port ' + config.port);



