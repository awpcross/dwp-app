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
	console.log( $scope.labels );
	
	
	
	

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
    //$state.go('tab.trophies');
	$state.go('signin');
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

.controller('SignInCtrl', function($scope, $state, LoginService, $ionicPopup) {

	console.log('SignInCtrl | starting ... ') ;

	$scope.user = {};
	
	$scope.authUser = function(user) {
	console.log('SignInCtrl.signIn() | start. ') ;
    console.log('SignInCtrl.signIn() | Signing in user : ', user);

	LoginService.loginUser($scope.user.username, $scope.user.password).success(function(user) {
		$state.go('tab.trophies');
	}).error(function(user) {
		var alertPopup = $ionicPopup.alert({
			title: 'Login failed!',
			template: 'Please check your credentials!'
		});
	});
	
    //$state.go('tab.trophies');

	console.log('SignInCtrl.signIn() | end. ') ;
	
  };

	console.log('SignInCtrl | done. ') ;
  
})

.controller('CrossEcomCtrl', function($scope, $state) {
	console.log('CrossEcomCtrl | starting ... ') ;
	console.log('CrossEcomCtrl | done. ') ;
})
.controller('CrossNewsCtrl', function($scope, $state) {
	console.log('CrossNewsCtrl | starting ... ') ;
	console.log('CrossNewsCtrl | done. ') ;
})

.controller('TrophiesCtrl', function(TrophyService, $scope, $state, $http, $ionicModal, $timeout) {
	console.log('TrophiesCtrl | start');

	$scope.trophies = [];
	$scope.trophiesMatched = [];

	console.log('TrophiesCtrl | GET /trophies ...');
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
	
	/*
	$scope.contact = {
		firstname: 'John',
		lastname: 'Appleseed',
		email: 'john@apple.com'
	}
	
	
	$scope.toWelcome = function(){
		console.log('TrophiesCtrl:toWelcome() | start');
		$state.go('welcome');
		console.log('TrophiesCtrl:toWelcome() | end');
	}
	*/
	
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


.controller('LeaderboardCtrl', function(ScoreService, $scope, $http) {
	console.log('LeaderboardCtrl | starting ... ');

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

.controller('ProfileCtrl', function($scope, $state) {
	console.log('CrossNewsCtrl | starting ... ') ;
	console.log('CrossNewsCtrl | done. ') ;
});

/*
.controller('DealersCtrl', function($scope,$ionicLoading, $compile) {

  console.log('DealersCtrl');

    $scope.init = function() {

  console.log('DealersCtrl >> initialize()');

  var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
		var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };

})
*/


