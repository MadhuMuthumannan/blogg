angular.module('app.routes',['ngRoute'])
		.config(function($routeProvider,$locationProvider){
			$routeProvider
				.when('/',{
					templateUrl:'app/views/pages/home.html',
					controller : 'homeController',
					controllerAs: 'home'
				})

				.when('/login', {
					templateUrl : 'app/views/pages/login.html',
					controller : 'mainController',
					controllerAs: 'main',
					abstract: false
				})

				.when('/users',{
					templateUrl : 'app/views/pages/users/all.html',
					controller : 'userController',
					controllerAs: 'user'
				})
				
				.when('/users/create',{
					templateUrl : 'app/views/pages/users/single.html',
					controller: 'userCreateController',
					controllerAs: 'user' 	
				})

				.when('/users/createpost',{
					templateUrl : 'app/views/pages/users/createp.html',
					controller: 'createController',
					controllerAs: 'create' 	
				})
				
				.when('/bpost', {
					templateUrl: 'app/views/pages/bpost.html',
					controller: 'bpostController',
					controllerAs: 'post'
				})

				.when('/detailed/:post_id', {
					templateUrl : 'app/views/pages/users/detailedview.html',
					controller  : 'indPostsController'
				})

				.when('/editpost/:post_id', {
					templateUrl : 'app/views/pages/users/editpost.html',
					controller  : 'postEditController'
				})

				.when('/users/manageposts', {
					templateUrl : 'app/views/pages/users/manageposts.html',
					controller  : 'managePostController',
					controllerAs  : 'manage'
				})

				.when('/users/:user_id',{
					templateUrl : 'app/views/pages/users/single.html',
					controller : 'userEditController',
					controllerAs:'user'
				})

				.when('/register',{
					templateUrl : 'app/views/pages/users/signup.html',
					controller : 'signupcontroller',
					controllerAs: 'sign'
				});

			$locationProvider.html5Mode(true);	

		});

		
