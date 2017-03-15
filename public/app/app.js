angular.module('sampleApp',['ngAnimate','ngRoute','app.routes','authService','mainCtrl','userCtrl','userService','bpostCtrl','ui.bootstrap','postService','textAngular','ui.grid','ui.grid.pagination'])
		
		.filter('startFrom', function() {
			return function(input, start) {
				if (!input || !input.length) { return; }
				start = +start; //parse to int
				return input.slice(start);
			}
		}

		)
				
		.config(function($httpProvider){
			$httpProvider.interceptors.push('AuthInterceptor');	
		});
