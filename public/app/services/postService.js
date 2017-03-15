angular.module('postService',[])
		.factory('Post',function($http){
			
			var postFactory={};

            postFactory.create=function(post){                
                return $http.post('/api/blogPost',post);
            };

            postFactory.update=function(post_id,post){
			    return $http.put('/api/getIndvdlBlogpost/'+post_id,post);
		    };

             postFactory.all=function(){                
                return $http.get('/api/blogPost');
            };


             postFactory.allPosts=function(){                
                return $http.get('/api/allPosts');
            };

            postFactory.upload=function(){                
                return $http.post('/api/Upload');
            };

            postFactory.approve=function(post_id){
			return $http.put('/api/approveBlogpost/'+post_id);
		    };

            postFactory.getPost=function(post_id){
                return $http.get('/api/getIndvdlBlogpost/'+post_id);
            };

            postFactory.IncreaseViews=function(post_id){
            return $http.put('/api/IncrementPostViews/'+post_id);
            };

             postFactory.getUsers=function(){
                return $http.get('/api/users');
            };

            postFactory.getUserPosts=function(username){
                return $http.get('/api/getUserBlogposts/'+username);
            };

            postFactory.saveComment=function(post_id,comment){
            return $http.post('/api/saveComment/'+post_id,comment);
            };

			postFactory.delete=function(id){
				return $http.delete('/api/getIndvdlBlogpost/'+id)
			};
            return postFactory;	
            
		});


