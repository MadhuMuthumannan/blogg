angular.module('userService',[])
		.factory('User',function($http){
			
			var userFactory = {};
			//api/users with id
			userFactory.get=function(id){
				return $http.get('/api/users/'+id);
			};

			//api/users/
			userFactory.all=function(){
				console.log("calling user get");
				return $http.get('/api/users');
			};	

			//api/users/
			userFactory.create=function(userData){
				return $http.post('/api/users/',userData);
			};

			//api/users/
			userFactory.createNewUser=function(userData){
				console.log(userData)
				return $http.post('/api/userss/',userData);
			};

			//api/users/
			userFactory.createNew=function(userData){
				return $http.post('/api/newusers/',userData);
			};

			//api/users with id
			userFactory.update=function(id,userData){
				return $http.put('/api/users/'+id,userData);
			};
			//api/users with id
			userFactory.delete=function(id){
				return $http.delete('/api/users/'+id)
			};
			return userFactory;	
		});