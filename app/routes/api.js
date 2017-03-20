var bodyParser = require('body-parser');
var User = require('../models/user');
var Post = require('../models/post');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var superSecret = config.secret;
var multer = require('multer');



module.exports = function(app,express){
	var apiRouter = express.Router();
	/*var sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/empod_db');*/
	//route for authenticating users
	var storage = multer.diskStorage({ //multers disk storage settings
	    destination: function (req, file, cb) {
	        cb(null, './public/uploads/')
	    },
	    filename: function (req, file, cb) {
	    	console.log("Ddaaaaaaaaaa")
	        var datetimestamp = Date.now();
	        cb(null, datetimestamp + '.' + file.originalname)
	    }
	});


	var upload = multer({ //multer settings
	    storage: storage
	}).single('file');

	apiRouter.post('/userss',function(req,res){
				console.log(req.body)
				var user =new User();
				user.name=req.body.name;
				user.username=req.body.username;
				user.password=req.body.password;
				user.save(function(err){
					if(err){
						if (err.code == 11000)
							return res.json({ success: false, message: 'A user with that username already exists. '});
						else				
							return res.send(err);
					}		
						res.json({message:'User Created', success: true});
				});	
		});


	apiRouter.post('/authenticate',function(req,res){

	// console.log("1");	
	/*sequelize
	  .authenticate()
	  .then(function(err) {
	    console.log('-------------Connection has been established successfully.');
	  })
	  .catch(function (err) {
	    console.log('============Unable to connect to the database:', err);
	  });*/
	 console.log("2"); 

		User.findOne({
			username:req.body.username
		}).select('name username password').exec(function(err,user){
			if(err) throw err;

			if(!user){
				res.json({
					success:false,
					message:'Authentication Falied. User not found'
				});
			}else if(user){
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.json({
						success: false,
						message: 'Authentication Failed. Wrong Password'
					});
				}else{
					var token = jwt.sign({
						name:user.name,
						username:user.username
						},superSecret,{
							expiresInMinutes:1440
						});

					res.json({
						success: true,
						message: 'Good Luck!',
						token:token
					});
				}
			}
		});
	});


	//middleware
	apiRouter.use(function(req,res,next){
		console.log("Handling all requests");

		var token =req.body.token || req.param('token') || req.headers['x-access-token'];

		if(token){
			jwt.verify(token,superSecret,function(err,decoded){
				if(err){
					return res.status(403).send({
						success:false,
						message:'Failed to Authenticate token'
					});
				}
				else{
					req.decoded=decoded;
					next();
				}
			});
		}
		else{
			return res.status(403).send({
				success:false,
				message:'No token provided'
			});
		}	
	});

	apiRouter.get('/', function(req, res) {
			res.json({ message: 'hooray! welcome to our api!' });
	});

	//route for saving comments
	apiRouter.route('/saveComment/:post_id')
		.post(function(req,res){
			
			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				post.comments.push(req.body);
				post.save(function (err,post) {
				  if (err) {
						return err;
				  }
				  else {
				  	console.log("Comment saved");
				  }
				  res.json(post);
				});		

			});
		});


		//route for incrementing views
	apiRouter.route('/IncrementPostViews/:post_id')
		.put(function(req,res){
			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				post.views=post.views+1;
				post.save(function(err){
					if(err) res.send(err);
					res.json({message:'views increased'});
				});
			});
		});



	apiRouter.route('/users')
		.post(function(req,res){
				var user =new User();
				user.name=req.body.name;
				user.username=req.body.username;
				user.password=req.body.password;
				user.save(function(err){
					if(err){
						if (err.code == 11000)
							return res.json({ success: false, message: 'A user with that username already exists. '});
						else				
							return res.send(err);
					}		
						res.json({message:'User Created'});
				});	
		})
		
	

	
		.get(function(req,res){
				console.log("calling today2");
				User.find({},function(err, users) {
					console.log("calling node today");
					if (err) res.send(err);
					res.json(users);
			});	
		});


		apiRouter.route('/blogPost')
		.post(function(req,res){		
				var post =new Post();
				post.title=req.body.title;
				post.body=req.body.body;
				post.author=req.body.author;
				post.file_name = req.body.uploadedFileName;
				console.log(req.body);
				console.log("<=========>");				
				if(req.body.author == 'admin'){
					post.status = 'Approved';
				}
				post.save(function(err){
					if(err){
						if (err.code == 11000)
							return res.json({ success: false, message: 'A user with that username already exists. '});
						else				
							return res.send(err);
					}		
						res.json({message:'Post Created', success: true});
				});	
		})
		.get(function(req,res){
				Post.find({status: 'Approved'}).sort('-time').exec(function(err, posts) {						
					console.log("calling node today");
					if (err) res.send(err);
					res.json(posts);
			});	

			})

		
		
		.put(function(req,res){
			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);

				if(req.body.title) post.title =req.body.title;
				if(req.body.author) post.author = req.body.author;
				if(req.body.body) post.body=req.body.body;

				Post.save(function(err){
					if(err) res.send(err);
					res.json({message:'Post Updated',success: true});
				});
			});
		});
			
			
			
		// apiRouter.route('/getUserNames')	
		// .get(function(req,res){
		// 		Post.find({},function(err, users) {
		// 			console.log("calling node to get authors");
		// 			if (err) res.send(err);
		// 			res.json(users);
		// 	});	

		// });


		apiRouter.route('/allPosts')
		.get(function(req,res){
			    Post.find({}).sort('-time').exec(function(err, posts) {				
					console.log("calling node today");
					if (err) res.send(err);
					res.json(posts);
			});	

		});

	apiRouter.route('/users/:user_id')
		.get(function(req,res){
			User.findById(req.params.user_id,function(err,user){
				if(err) res.send(err);
				res.json(user);
			});
		})

		.put(function(req,res){
			User.findById(req.params.user_id,function(err,user){
				if(err) res.send(err);

				if(req.body.name) user.name =req.body.name;
				if(req.body.username) user.username=req.body.username;
				if(req.body.password) user.password=req.body.password;

				user.save(function(err){
					if(err) res.send(err);
					res.json({message:'User Updated'});
				});
			});
		})	

		.delete(function(req, res) {
				User.remove({_id: req.params.user_id}, function(err, user) {
					if (err) return res.send(err);
					res.json({ message: 'Successfully deleted' });
				});
		});	

		apiRouter.get('/self',function(req,res){
		res.send(req.decoded);	
	});


 	//route for fetching individual post
	apiRouter.route('/getIndvdlBlogpost/:post_id')
 		.get(function(req,res){
 			console.log("getting individual post")
 			Post.findById(req.params.post_id,function(err,posts){
				if(err) res.send(err);
				res.json(posts);
			});
 		})

		 .put(function(req,res){
		 	console.log("put function called at api part");
 			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				console.log(">>=========>")
				console.log(req.body);

				if(req.body.title) post.title =req.body.title;
				if(req.body.body) post.body=req.body.body;
				if(req.body.author) post.author=req.body.author;
				if(req.body.file_name) post.file_name=req.body.file_name;
				post.save(function(err){
					if(err) res.send(err);
					res.json({message:'post Updated', success: true});
				});
			});
		})

		.delete(function(req, res) {
				Post.remove({_id: req.params.post_id}, function(err, post) {
					console.log('inside delete')
					if (err) return res.send(err);
					res.json({ message: 'Post deleted' });
				});
		});	
 		
 	// //route for fetching single user posts
	apiRouter.route('/getUserBlogposts/:username')
		.get(function(req,res){
			Post.find({author:req.params.username},function(err, posts) {
					if (err) res.send(err);
					res.json(posts);
			});
 		});

	//route for approving post
	apiRouter.route('/approveBlogpost/:post_id')
		.put(function(req,res){
			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				post.status="Approved";
				post.save(function(err){
					if(err) res.send(err);
					res.json({message:'post approved'});
				});

			});
		});
		
	apiRouter.get('/self',function(req,res){
		res.send(req.decoded);
		console.log(req.decoded);	
	});

	

	/** API path that will upload the files */
	apiRouter.post('/upload', function(req, res) {
		console.log("upload api called")
	    upload(req,res,function(err){
	    console.log("----------->>");
	    console.log(req.file.filename);
	        if(err){
	             res.json({error_code:1,err_desc:err});
	             return;
	        }
	         res.json({error_code:0,err_desc:null, filename :req.file.filename});
	    })
	});


	return apiRouter;
};