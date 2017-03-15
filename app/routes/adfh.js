module.exports = function(app,express){	var apiRouter = express.Router();		
//route for authenticating users	
apiRouter.post('/register',function(req,res){
		var user =new User();				
		user.name=req.body.name;				
		user.username=req.body.username;				
		user.password=req.body.password;				
		user.save(function(err){					
			if(err){						
				if (err.code == 11000)							
					return res.json({ success: false, message: 'A user with that username already exists. '});					
				else											
					return res.send(err);					}								
				    res.json({success: true, message:'User Created'});				
				});		
	});	
apiRouter.post('/authenticate',function(req,res){