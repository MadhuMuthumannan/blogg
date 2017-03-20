angular.module('bpostCtrl',['postService','userService','authService','textAngular','ui.grid','startFilter','ui.bootstrap','ngFileUpload'])
		
    	.controller('createController',function(Post, $scope, Upload, $location,$rootScope){
    		$rootScope.pageLoading = false;
			var vm=this;
		      $scope.uploadedFileName = "";

		      	vm.savePost=function(){	
							console.log("save post function called");
							vm.processing=true;
							vm.message='';
							console.log(vm.postData)
							Post.create(vm.postData)
								.success(function(data){
									vm.processing=false;
									vm.postData={};
									vm.message=data.message;
									
			                       if(data.success){
			                       		
										$location.path('/bpost');
			                       }
									else
										vm.error=data.message;

								});		        

					}

		      $scope.upload = function (file_name) {
		      	console.log(file_name);
		      	console.log("upload function called at controller part");
		      	if(file_name) {
		      		console.log("inside upload part to service");
		      		Upload.upload({
                    url: 'api/upload', //webAPI exposed to upload the file
                    data:{file:file_name} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
	                if(resp.data.error_code === 0){ //validate success

	                	vm.postData.uploadedFileName = 'uploads/' + resp.data.filename;
	                	vm.savePost();
	                	console.log(resp.data.filename);	                	
	                    // console.log('Success ' + resp.data.filename + ' uploaded. Response: ');
	                } else {
	                    console.log('an error occured');
	                }
	            }, function (resp) { //catch error
	                console.log('Error status: ' + resp.status);
	                console.log('Error status: ' + resp.status);
	            }, function (evt) { 
	                console.log(evt);
	                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	                $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
	            });
            }

	            else{
	            	vm.postData.uploadedFileName = "uploads/no_image.jpg";
	            	vm.savePost();
	            }
	        };				

		})

		 
		.controller('indPostsController',function($scope,$routeParams,Post, Auth,$rootScope){		
			$scope.posts={};
			$scope.comment={};
			$scope.posts.comments = {};
			$scope.currentPage = 0;
			$scope.pageSize = 5;

			$rootScope.$on('$routeChangeStart',function(){				
					$rootScope.pageLoading = true;
				  }); 

			$scope.numberOfPages=function(){
				return Math.ceil($scope.post.comments.length/$scope.pageSize);                
			}

			Auth.getUser()
			.then(function(data){
				$scope.comment.commentedBy=data.data.username;
			});	


			Post.getPost($routeParams.post_id)
					.success(function(data){						
						$scope.posts=data;
						Post.IncreaseViews($routeParams.post_id)
						.success(function(data){
							$rootScope.pageLoading = false;
							console.log('views incremented')
						});
					});

			$scope.postComment=function(){
				console.log($scope.comment)
				console.log('post comment function called')
					Post.saveComment($routeParams.post_id,$scope.comment)
						.success(function(data){
							// console.log(data.comments)
							$scope.posts.comments=data.comments;								
							$scope.comment.body='';
						});	
			
		}

	     })
         
		.controller('bpostController',function($scope, Post,$rootScope){
			$scope.filteredTodos = [];
			$scope.itemsPerPage = 3;
			$scope.currentPage = 1;
				var vm=this;

				 $rootScope.$on('$routeChangeStart',function(){				
					$rootScope.pageLoading = true;
				  }); 


				$scope.valueChanged = function(selectedName){	
					// console.log(selectedName.username)												
						Post.getUserPosts(selectedName.username)
						.success(function(data){
							// console.log(data)
							$rootScope.pageLoading = false;
							vm.posts=data;
							 $scope.pageChanged();
						});
					}
					

				Post.getUsers()
				.success(function(data){
					// console.log(data)
					vm.processing=false;
					vm.users=data;
				})

				Post.all()
					.success(function(data){
						vm.processing=false;
						vm.posts=data;
						$scope.itemsPerPage = 3;
						$scope.currentPage = 1;
						$rootScope.pageLoading = false;
						$scope.pageChanged = function() {						
							
						    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
						    var end = begin + $scope.itemsPerPage;
						    $scope.filteredPosts = vm.posts.slice(begin, end);
						    $scope.pageLength = vm.posts.length;
						    console.log(vm.posts.length)
						  };

						 $scope.pageChanged();
					});


		})


		.controller('getAllPostsController',function($scope,Post,$rootScope){	
		$rootScope.$on('$routeChangeStart',function(){				
					$rootScope.pageLoading = true;
				  }); 	
				$scope.posts={};
				$scope.post=0;
				Post.getAll()
					.success(function(posts){	
						$rootScope.pageLoading = false;					
						$scope.posts = posts;
					});
			})


	    .controller('postEditController',function($scope,$routeParams,Post, Upload, $location,$rootScope){	
			var vm=this;	
			$scope.posts={};
			$scope.type='edit';
			$scope.uploadedFileName = "";

			$rootScope.$on('$routeChangeStart',function(){				
					$rootScope.pageLoading = true;
				  }); 

			Post.getPost($routeParams.post_id)
					.success(function(data){
						$rootScope.pageLoading = false;
						$scope.posts=data;
						console.log($scope.posts);

					vm.savePost=function(){
						console.log('save post function called');					
					Post.update($routeParams.post_id,$scope.posts)
						.success(function(data){							
							$scope.message = data.message;
							console.log("blaaaaaa")	;
							console.log(data);
								if(data.success){
									$rootScope.pageLoading = false;
									$location.path('/bpost');
								}		
								else
									vm.error=data.message;
						});	
					}


			});

			$scope.upload = function(file_name) {
				console.log(file_name);
				console.log("upload function called at controller part");
		      	if(file_name) {
		      		console.log(file_name);
		      		Upload.upload({
                    url: 'api/upload', //webAPI exposed to upload the file
                    data:{file:file_name} //pass file as data, should be user ng-model
                    }).then(function (resp) { //upload function returns a promise
		                if(resp.data.error_code === 0){ //validate success
		                	console.log(resp.data.filename);
		                	$scope.posts.file_name = 'uploads/' + resp.data.filename;
		                	vm.savePost();
		                	// console.log(resp.data.filename);
		                	console.log($scope.uploadedFileName);	                	
		                    console.log('Success ' + resp.data.filename + ' uploaded. Response: ');
		                } 
		                else {
		                    console.log('an error occured');
		                }
		            }, function (resp) { //catch error
		                console.log('Error status: ' + resp.status);
		                console.log('Error status: ' + resp.status);
		            }, function (evt) { 
		                console.log(evt);
		                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		                $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
		            });
	            }
		            else{
		            	vm.savePost();
		            }
		        };				


					

		})

	    .controller('managePostController',function($scope,Post,Auth,uiGridConstants,$rootScope){
			var vm=this;
			vm.posts={};
			vm.processing=true;	

			$rootScope.$on('$routeChangeStart',function(){				
					$rootScope.pageLoading = true;
				  }); 



			$scope.toggleFiltering = function(){
						$scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
						$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );							
					};
					 
				$scope.isAdmin=false;
				    $scope.posts={};
					$scope.postDetails=[];
					$scope.gridOptions = {
						showGridFooter: true,
						 enableGridMenu: true,
						enableFiltering:true,
						paginationPageSizes: [10,20,30], 
						paginationPageSize: 10,
						rowHeight: 40,
						columnDefs : [
						{ name:'id',visible:false},
						{ name: 'title', cellClass: 'customFont', cellTemplate:'<div><a href="/detailed/{{row.entity.id}}">{{row.entity.title}}</a></div>',width: "35%"},
						{ name: 'postedBy', cellClass: 'customFont', headerTooltip: 
													function( col ) {
													return 'Click here to sort by Author name!';
													}},
						{ name: 'time', cellClass: 'customFont', headerTooltip: 
													function( col ) {
													return 'Click here to sort by time!';
													}},
						{ name: 'status', cellClass: 'customFont', headerTooltip: 
													function( col ) {
													return 'Click here to sort by status!';
													}},
						{ name: 'Actions', enableFiltering : false, cellClass: 'customFont',
							cellTemplate:'<div>&nbsp;&nbsp;<a href="/editpost/{{row.entity.id}}"><button type="button" class="btn btn-primary btn-baba" ng-hide="grid.appScope.isAdmin && row.entity.postedBy!=\'admin\'">Edit &nbsp;&nbsp;<span class="badge"><span class="glyphicon glyphicon-pencil"></span></span></button></a><a href="" style="margin-right:4px;" ng-click="grid.appScope.approvePost(row.entity.id,row)"><button type="button" class="btn btn-md btn-success btn-baba" ng-hide="!grid.appScope.isAdmin || row.entity.postedBy== \'admin\'" ng-disabled="row.entity.status == \'Approved\'">Approve <span class="badge"><span class="glyphicon glyphicon-ok"></span></span></button></a>&nbsp;&nbsp;<a href="" ng-click="grid.appScope.deletePost(row.entity.id,row)"><button type="button" class="btn btn-danger btn-baba">Delete <span class="badge"><span class="glyphicon glyphicon-trash"></span></span></button></a></div>',width: "30%"},
							
					],
						onRegisterApi: function (gridApi) {
							$scope.gridApi = gridApi;
							gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
									$scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
								});
						}

					};

					$scope.toggleFiltering = function(){
						$scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
						$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );							
					};

					 


							var getRequiredDetails=function(){
								var post={};
								for(var i=0;i<$scope.posts.length;i++){
									post.id=$scope.posts[i]._id;
									post.title = $scope.posts[i].title;
									post.postedBy = $scope.posts[i].author;								
									post.time = $scope.posts[i].time.slice(0,10);
									post.status = $scope.posts[i].status;
									$scope.postDetails.push(post);
									post = {}; 
								}
							}
							Auth.getUser()
								.then(function(data){
									$scope.username=data.data.username;
									if($scope.username=='admin'){
										$scope.isAdmin=true;
											Post.allPosts()
												.success(function(data){
													$rootScope.pageLoading = false;
												$scope.posts = data;
												getRequiredDetails();
												$scope.gridOptions.data=$scope.postDetails;
											});
									}
									else{
										$scope.isAdmin=false;
										Post.getUserPosts($scope.username)
										.success(function(data){
											console.log(data)
											$rootScope.pageLoading = false;
											$scope.posts=data;
											getRequiredDetails();
											$scope.gridOptions.data=$scope.postDetails;

										});

									}

							});

							$scope.deletePost=function(id,row){
								Post.delete(id)
									.success(function(data){
										console.log('deleted')
										var index = $scope.gridOptions.data.indexOf(row.entity);
										$scope.gridOptions.data.splice(index, 1);

									});
								};
								
							$scope.approvePost=function(id,row){
								Post.approve(id)
								.success(function(data){
									var index = $scope.gridOptions.data.indexOf(row.entity);
									$scope.gridOptions.data[index].status="Approved";
									console.log('approved')
								});
							};

							  

			});