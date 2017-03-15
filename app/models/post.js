var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema =new Schema({
        title: String,
        author: String,
        time:{ type: Date, default: Date.now },
        status:{type:String,default:"pending"},
        views : {type:Number,default:0},
        likes : {type:Number,default:0},
        body : String,
        file_name : String,
        comments: [
	  { 
	  	commentedBy:String,
	  	body: String, 
	  	date: {type :Date,default:Date.now },
	  }
	   ]	
});

module.exports = mongoose.model('Post',PostSchema);