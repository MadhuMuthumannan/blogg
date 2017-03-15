angular.module('userCtrl',['userService'])
		.controller('userController',function(User){
			var vm=this;
			vm.processing=true;

			User.all()
				.success(function(data){
					console.log(data)
					vm.processing=false;
					vm.users=data;
				});

			vm.deleteUser =  function(id){
				vm.processing=true;
				User.delete(id)
						.success(function(data){
							User.all()
								.success(function(data){
									vm.processing=false;
									vm.users=data;
								});
						});
			};			
		})

		.controller('userCreateController',function(User){
			var vm=this;

			vm.type='create';
			vm.saveUser=function(){
				vm.processing=true;
				vm.message='';

				User.create(vm.userData)
					.success(function(data){
						vm.processing=false;
						vm.userData={};
						vm.message=data.message;
					});	
			};

			vm.saveNewUser=function(){
				vm.processing=true;
				vm.message='';

				User.create(vm.userData)
					.success(function(data){
						vm.processing=false;
						vm.userData={};
						vm.message=data.message;
					});	
			};
		})

		.controller('signupcontroller',function(User, $location){
			var vm=this;

			vm.type='create';
			vm.saveUser=function(){
				console.log("save user function called at controller")
					User.createNewUser(vm.userData)
					.success(function(data){					
						if(data.success){
							console.log(data.success);
							$location.path('/login');
						}							
						else{

							vm.error=data.message;
						}

					});
			};
		})
		
		
		.controller('userEditController',function($routeParams,User){
			var vm=this;
			vm.type='edit';

			User.get($routeParams.user_id)
				.success(function(data){
					vm.userData = data;
				});

			vm.saveUser =function(){
				vm.processing =true;
				vm.message='';

				User.update($routeParams.user_id,vm.userData)
						.success(function(data){
							vm.processing = false;
							vm.userData = {};
							vm.message = data.message;
						});
			};

		});
