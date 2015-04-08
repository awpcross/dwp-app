var app = angular.module('starter.controllers', ['dpd','ngCordova'])

.controller('WelcomeCtrl', function(dpd,$scope, $state, $ionicSlideBoxDelegate) {

	console.log('WelcomeCtrl | starting ... ');
	// GET filter: viewid: {$in: "10"}, viewid: {$in: "1"}
	//category: {$in: ["food", "business", "technology"]}
	//dpd.categories.get($sort: {name: 1}, $limit: 10, rightsLevel: {$gt:0}};
	//$sort: {likes: -1}
	
	//$scope.txt = dpd.appcontents.get( {viewid: 10, subviewid: 1, $sort: {orderno: 1}} );

	dpd.welcomecontents.get( { $sort: {orderno: 1}} ).success(function(response) {
			  console.log('success !');
			  console.log('data : ', response);
			  $scope.labels = response;
		}).error(function(error) {
			  console.log('error : ' + error.message, error);
		});
				
	// todo fallback if network error
	//console.log( $scope.labels );
	
	
	
	

/*
	// sample dpd usage
	dpd.users.get();	

	dpd.users.exec('login', { username: 'jaimie@gmail.com', password: 'jaimie' }).success(function(session) {
					  console.log('success !');
				}).error(function(error) {
					  console.log('error : ' + error.message, error);
				});

	dpd.users.post({"username":"pascal@escarment.com","password":"123"});
*/


  // Called to navigate to the main app
  $scope.signIn = function() {
	//$state.go('signin');
    $state.go('tab.profilelogin');

  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

	console.log('WelcomeCtrl | done. ') ;
  
})

.controller('PrerequisitesCtrl', function($scope, $state) {

  console.log('PrerequisitesCtrl | starting ... ') ;
  // Called to navigate to the main app
  $scope.goTrophies = function() {
    //$state.go('tab.trophies');
    $state.go('tab.cross-news');
  };
  console.log('PrerequisitesCtrl | done. ') ;
  
})

.controller('SignInCtrl', function($scope, $state, LoginService, $ionicPopup, dpd, ProfileService) {

	console.log('SignInCtrl | starting ... ') ;

	ProfileService.getUserProfile(dpd).success(function(response) {
	
		if (response != null && response != '' ) {
			console.log('user signed in');
			$scope.user = response;		
			console.log('response : "' + response + '"', response);
		} else {
			console.log('no user signed in');
		}
	}).error(function(error) {
		console.log('error ProfileService.getUserProfile() in SignInCtrl', error);
	/*	
		var alertPopup = $ionicPopup.alert({
			title: 'Login failed!',
			template: 'Please check your credentials!'
		});
	*/
	});
	
	
	$scope.user = {};
	
	$scope.authUser = function(user) {
	
	console.log('SignInCtrl.signIn() | start. ') ;
    if (user != null) {
	console.log('SignInCtrl.signIn() | Signing in user : ', user);

		LoginService.loginUser($scope.user.username, $scope.user.password, dpd).success(function(user) {
			//$state.go('tab.trophies');
			$scope.user = {};
			$state.go('tab.profile');
		}).error(function(user) {
			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Please check your credentials!'
			});
		});
	
	} else {
	console.log('SignInCtrl.signIn() | Signing in user : !!warning user is empty!!');	
	}

	
    //$state.go('tab.trophies');

	console.log('SignInCtrl.signIn() | end. ') ;
	
  };

	console.log('SignInCtrl | done. ') ;
  
})

.controller('RegisterCtrl', function($scope, $state, RegisterUserService, dpd) {
	console.log('RegisterCtrl | starting ... ') ;

	var newuser = $scope.newuser;
	
	$scope.registerUser = function(newuser) {
	console.log('RegisterCtrl.registerUser() | start. ') ;

    if (newuser == null) {
	console.log('RegisterCtrl.registerUser() | registering user : !!warning user is empty!!');	
	} else {
	console.log('RegisterCtrl.registerUser() | registering user : ', newuser);

	RegisterUserService.registerUser(newuser.username, newuser.password, newuser.nickname, dpd).success(function(user) {
		//$state.go('tab.trophies');
		$state.go('tab.news');
	}).error(function(user) {
		var alertPopup = $ionicPopup.alert({
			title: 'This user already exists!',
			template: 'Please select another username or contact support!'
		});
	});
	
    //$state.go('tab.trophies');
	}

	console.log('SignInCtrl.registerUser() | end. ') ;
	
  };

	
	console.log('RegisterCtrl | done. ') ;
})

.controller('ProfileRegisterCtrl', function($scope, $state) {
	console.log('ProfileRegisterCtrl | starting ... ') ;
		
	console.log('ProfileRegisterCtrl | done. ') ;
})

.controller('CrossEcomCtrl', function($scope, $state) {
	console.log('CrossEcomCtrl | starting ... ') ;
	console.log('CrossEcomCtrl | done. ') ;
})

.controller('CrossNewsCtrl', function($scope, $state) {
	console.log('CrossNewsCtrl | starting ... ') ;
	console.log('CrossNewsCtrl | done. ') ;
})


.controller('TrophiesCtrl', function($scope, $rootScope, $state, $ionicModal, $timeout, $http, Trophies, dpd) {
  // BG Listner
  window.plugin.notification.local.onclick = function (id, state, json) {
    if(id==777) {
      $state.go('tab.trophies');
    }
  };

  // $scope.totalpoints = 1520;
  $scope.totalpoints = "";
  $scope.nextStep = "";

  // Call launchMonitoring from Services
  $scope.main =  function() {
    console.log('IN MAIN');
    
    // Monitor all trohies
    Trophies.getTrophies($scope, dpd).then(function(promise_trophies) {
      $scope.trophies = promise_trophies;
      // Get Granted trophies 
      Trophies.getGrantedTrophies($scope, dpd).then(function(promise_grantedTrophies) {
          //TODO : Not always check ListGrantedTrophies
          if($rootScope.monitoringLaunched==false) {
            $scope.listGrantedTrophies = promise_grantedTrophies;
            console.log("GRANTED_LIST: " +JSON.stringify($scope.listGrantedTrophies));
            $scope.listInfoGrantedTrophies = Trophies.getListGrantedTrophies($scope);
            $scope.totalpoints = Trophies.getCurrentPoints();
            // Launch Monitoring
            Trophies.launchMonitoring($scope,$rootScope);
          }
      });
    });
    

  }

  $scope.getStatusSniffer = function() {
    // Launch MODAL
    console.log('PREMAIN getStatusSniffer | start!');
    //$scope.openModal();
    //$state.go('prerequisites');
    //console.log('PREMAIN getStatusSniffered | end!');

    var onAuthoResultSnif = function(status) {
      // If authorization mode is activated
      console.log("onAuthoResultSnif selector"); 
      if (status == 3) {
        console.log("onAuthoResultSnif : 3"); 
        $rootScope.statusSniffer = true;
        $scope.main();
       // return true;
      }
      else {
        console.log("onAuthoResultSnif : 0"); 
        $rootScope.statusSniffer = false;
        $state.go('prerequisites');
        // return false;
      }
    }
    estimote.beacons.authorizationStatus(onAuthoResultSnif);
  }

  $scope.gotoPrerequisites =  function() {
    console.log('IN MAIN');
    // $rootScope.monitoringLaunched = true;
    $state.go('prerequisites');
  }

  // Callback from Services
  $scope.dispatchThrophyEvent = function() {
    if ($scope.regionState.state=='inside') {
      //  Get the associate TROPHY
      var currentTS = new Date().getTime();
      var trophy = Trophies.getFromRegion($scope,$scope.regionState);
      // TODO : Add logic : multicheck
      console.log("TIMESTAMP : " + currentTS + " " + JSON.stringify(trophy));
      if ( currentTS > trophy.startDate  &&  currentTS < trophy.endDate) {

        // IF app in Background
       if ($rootScope.appInBackground) {
          console.log('DispatchEvent in BackGround ' + $rootScope.appInBackground);
          $scope.displayNotification($scope.regionState);
        }
        console.log("***** iT IS A MATCH **** ");
        //TODO : CALL BACKEND TO adapt the DB
        $scope.$apply( function() {
          console.log('Add newItem');
          // Update NextStep in the view 
          $scope.nextStep = trophy.nextStep;
          // Update Score in the view
          $scope.totalpoints += trophy.points;
          $scope.listInfoGrantedTrophies.push(trophy);
        });
      }
    }
  }

  $scope.displayNotification = function(regionState) {
      var notification_msg = regionState.state+" "+regionState.identifier;
      if (regionState.state=='inside') {
        //Send a Notification
        window.plugin.notification.local.add({ id:777, message: notification_msg,badge:0});
        console.log('Bravo vous avez débloqué un nouveau trophée');
      }
  }
    // Gestion modal des prerequis  - faire une version allegée pour le bluetooth [BEGIN]
    $ionicModal.fromTemplateUrl('templates/modal-prerequisites.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      })
      $scope.openModal = function() {
        $scope.modal.show()
      }
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });
      // Gestion modal des prerequis END]

  $scope.toWelcome = function(){
    console.log('TrophiesCtrl:toWelcome() | start');
    //TODO : mettre en place le tab.profile
    $state.go('welcome');
    console.log('TrophiesCtrl:toWelcome() | end');
  }

  // Execute after view Render
  $scope.$on('$ionicView.afterEnter', function() {
    console.log('$ionicView.loaded event captured | start');
    // STOP MONITORING and launch PREREQUIS
    if($rootScope.bluetoothAct==false) {
        console.log('Monitoring STOPPED');
        // Launch MODAL ( faire une modal special bluetooth)
        $scope.openModal();
        // Stop monitoring
        estimote.beacons.stopMonitoringForRegion({});
        $rootScope.monitoringLaunched  = false;
    }
    // Execute MAIN VIEW
    else {
      console.log('Monitoring WILL BE LAUNCHED');
      $scope.main();
    }
    console.log('$ionicView.loaded event captured | end');
  });
})

/*
.controller('TrophiesCtrl', function(TrophyService, $scope, $state, $http, $ionicModal, $timeout) {
	console.log('TrophiesCtrl | start');

	$scope.trophies = [];
	$scope.trophiesMatched = [];

	console.log('TrophiesCtrl | GET /trophies ...');
  */
	// Get all trophies
	
	/*
	$http.get('http://localhost:2403/trophies').then(function(resp) {
		console.log('Success', resp);
		// For JSON responses, resp.data contains the result
		$scope.loaded = true;
		$scope.trophies = resp.data;
		console.log( $scope.trophies[0].name);
	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	})
	*/
  /*
	TrophyService.getTrophies().then(function(promise1) {
		$scope.trophies = promise1;
	});
	
	console.log('TrophiesCtrl | GET /trophies done.');

	console.log('TrophiesCtrl | GET /trophies-matched ...');

	TrophyService.getMatchedTrophies().then(function(promise2) {
		$scope.trophiesMatched = promise2;
	});
	console.log('TrophiesCtrl | GET /trophies-matched | $scope.trophiesMatched : ' + $scope.trophiesMatched);
	
	console.log('TrophiesCtrl | GET /trophies-matched done.');
	
	
	$ionicModal.fromTemplateUrl('templates/modal-prerequisites.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		//TODO uncomment
		//$scope.modal.show();
	})  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
	// Execute action on hide modal
	$scope.$on('$ionicView.afterEnter', function() {
		console.log('$ionicView.loaded event captured | start');
		// TODO : check if first render of the modal, event should not show the modal (done through the promise (.then()))
		//TODO uncomment
		//$scope.modal.show();
		console.log('$ionicView.loaded event captured | end');
	});

})
*/


.controller('LeaderboardCtrl', function(dpd, ScoreService, $scope, $http) {
	console.log('LeaderboardCtrl | starting ... ');
  //dpd.users.exec('me');

	$scope.players = [];
	
	console.log('LeaderboardCtrl | calling ScoreService.getScores() ... ') ;

	ScoreService.getScores().then(function(promise) {
		$scope.players = promise;
	});

	console.log('LeaderboardCtrl | ScoreService.getScores() --> players : ', $scope.players);
	/*
	$http.get('http://localhost:2403/users').then(function(resp) {
		console.log('Success', resp);
		// For JSON responses, resp.data contains the result
		$scope.loaded = true;
		$scope.players = resp.data;
		console.log( $scope.players[0].name);
	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	})
	*/
	console.log('LeaderboardCtrl | ScoreService.getScores() done. ') ;
	
	
	/*
	$scope.players =  [
		{nickname: "Jamie Sommers", avatar:"img/avatar-player2.png", score:4500},
		{nickname: "Willy Wonka", avatar:"img/avatar-player3.png", score:2500},
		{nickname: "Bart Simpson", avatar:"img/avatar-player4.png", score:1500}
	];
	*/
	
	
	$scope.doRefresh = function() {
		$scope.players.unshift({name: 'Player ' + Date.now(), avatar:"img/avatar-player1.png", score:500})
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$apply()
	};	
	console.log('LeaderboardCtrl | done. ') ;
})

.controller('ProfileCtrl', function($scope, $state, ProfileService, dpd) {
	console.log('ProfileCtrl | starting ... ') ;


	
	ProfileService.getUserProfile(dpd).success(function(response) {
		$scope.user = response;
		console.log('response', response);
	});


	$scope.signOutUser = function(user) {
	
	console.log('ProfileCtrl.signOutUser() | start. ') ;
    if (user != null) {
	console.log('ProfileCtrl.signOutUser() | Signing in user : ', user);
	} else {
	console.log('ProfileCtrl.signOutUser() | Signing in user : !!warning user is empty!!');	
	}

	
	
	console.log('ProfileCtrl | logging out ');

	dpd.users.get('me').success(function(session) {
	console.log('me :: success ! A user is logged in');
	console.log('session', session);
	console.log('me :: Sucess logged in : ' + session.nickname + ' (' + session.id + ')!'); 

		dpd.users.get('logout').success(function(session) {
			  console.log('Sucessfuly logged out !');
				//deferred.resolve('Logged out ' + name + ' !');
				console.log('persisting auth state');
				localStorage.setItem("user_auth_id", '');
				console.log('set user_auth_id : "', localStorage.getItem("user_auth_id") +'"' );

				$state.go('tab.profilelogin');
			  
		}).error(function(error) {
			  //console.log('error : ' + error.message, error);
			  console.log('error', error);
		});

		//deferred.resolve('Logged out ' + session.nickname + ' (' + session.id + ')!'); 

	}).error(function(error) {
		console.log('me::ERROR : ' + error.message, error);
		console.log('me::ERROR : please check user is logged in.');
		//deferred.reject('No user logged in.');
	});

	
	
	
    //$state.go('tab.trophies');

	console.log('ProfileCtrl.signOutUser() | end. ') ;
	
  };	
	console.log('ProfileCtrl | done. ') ;
});

