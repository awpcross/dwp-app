angular.module('starter.services', ['dpd', 'appconfig'])

.service('LoginService', ['dpd', '$q', 'ENV', function(dpd, $q, env) {
	
	console.log('LoginService | starting... ');
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

			console.log('LoginService | using appconfig.ENV : "' + env +'"');
			if ( env == 'dev-nobackend') {
				console.log('LoginService | skipping auth');
				deferred.resolve('Welcome ' + name + '!');
			} else {	
			console.log('LoginService | calling deployd service (dpd.users.login)... ');
			dpd.users.exec('login', { username: name, password: pw }).success(function(session) {
				  console.log('success !');
				  deferred.resolve('Welcome ' + name + '!');			
			}).error(function(error) {
				  console.log('error : ' + error.message, error);
				  deferred.reject('Wrong credentials.');
			});
			
			/*
			dpd.users.login({username: name, password: pw}, function(session, error) {
				if (error) {
				  console.log('error : ' + error.message, error);
				  deferred.reject('Wrong credentials.');
				  
				} else {
				  console.log('success !');
				  deferred.resolve('Welcome ' + name + '!');
				//location.href = "/welcome.html";

				}
			});
			*/
			console.log('LoginService | done deployd ... ');
			}

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
	console.log('LoginService | done. ') ;
	
}])

.factory('ScoreService', function($http) {
  var promise;
  var ScoreService = {
    getScores: function() {
      if ( !promise ) {
        // $http returns a promise, which has a then function, which also returns a promise
        promise = $http.get('https://digitalwatchproject.cross-systems.ch/users').then(function (response) {
          // The then function here is an opportunity to modify the response
          console.log("************** RESPONSE : "+response);
          // The return value gets picked up by the then in the controller.
          return response.data;
        });
      }
      // Return the promise to the controller
      return promise;
    }
  };
  return ScoreService;
})

/*
.factory('TrophyService', function($http) {
  var promise1;
  var promise2;
  var TrophyService = {
  
    getTrophies: function() {
      if ( !promise1 ) {
        // $http returns a promise, which has a then function, which also returns a promise
        promise1 = $http.get('http://localhost:2403/trophies').then(function (response) {
          // The then function here is an opportunity to modify the response
          console.log(response);
          // The return value gets picked up by the then in the controller.
          return response.data;
        });
      }
      // Return the promise to the controller
      return promise1;
    },

    getMatchedTrophies: function() {
      if ( !promise2 ) {
        // $http returns a promise, which has a then function, which also returns a promise
        promise2 = $http.get('http://localhost:2403/trophies-matched').then(function (response) {
          // The then function here is an opportunity to modify the response
          console.log(response);
          // The return value gets picked up by the then in the controller.
          return response.data;
        });
      }
      // Return the promise to the controller
      return promise2;
    }
	

	};
  return TrophyService;
})
*/

/* Beacons/Trophies Factory */
.factory('Trophies', function($http) {
  // TODO : get all region from a resource that returns a JSON array
   var beaconRegions = [{
        id : 'eac708b7e5f508e1',
        identifier: 'BienvenueAuSalon',
        name: 'Bienvenue Au Salon',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 400,
        minor: 1,
        orderNo:1,
        points: 1000,
        description : 'ND : Vous avez débloqué le trophée : App téléchargée !',
        nextStep : 'Créez vous un compte!',
        beaconColor: 'red',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : false
    },
    {
        id : 'ebae93ac8b78cbce',
        identifier: 'RencontreAvecNosIntervenants',
        name: 'Rencontre Avec Nos Intervenants',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 600,
        minor: 1,
        orderNo:2,
        points: 1500,
        description : 'ND : Vous avez débloqué le trophée : Rencontre avec nos intervenants',
        nextStep : 'Allez vite à l apero reseautage',
        beaconColor: 'yellow',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : false
    },
    {
        id : '22334cdaa20578a3',
        identifier: 'ZoneApero',
        name: 'Zone Apero',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 500,
        minor: 1,
        orderNo:3,
        points: 450,
        description : 'ND : Vous avez débloqué le trophée : Apéro Réseautage',
        nextStep : 'Allez vite a la conf',
        beaconColor: 'yellow',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : false
    },
    {
        id : '8c1cc8ed6a6b7bbe',
        identifier: 'ZoneConf',
        name: 'Zone Conf',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 500,
        minor: 1,
        orderNo:3,
        points: 3500,
        description : 'ND : Vous avez débloqué le trophée : Suivi de conférence BIG DATA',
        nextStep : 'Allez vite au stand',
        beaconColor: 'blue',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : true
    },
    {
        id : 'aebda58efdbf3946',
        identifier: 'ZoneStand',
        name: 'Zone Stand',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 700,
        minor: 1,
        orderNo:4,
        points: 750,
        description : 'ND : Vous avez débloqué le trophée : Visite de notre stand (B12)',
        nextStep : 'C etait le dernier trophée. Revenez-nous voir au stand',
        beaconColor: 'black',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : true
    }];
    
    // TODO : get all Granted trophies from a resource that returns a JSON array
    var listGrantedTrophies = [{
          trophyid : 'eac708b7e5f508e1',
          userid :'77876edeb634e8af',
          timestamp :1427984918000,
        },
        {
          trophyid : 'ebae93ac8b78cbce',
          userid :'77876edeb634e8af',
          timestamp :1427984922000,
        },
        {
          trophyid : '22334cdaa20578a3',
          userid :'77876edeb634e8af',
          timestamp :1427984922000,
        }
    ];

    var listInfoGrantedTrophies = [];

    var  promise = [];

  // Get a specific trophy from regionState
  getFromRegion  = function($scope,regionState) {
    console.log('getFromRegion | start!');
    for (var i = 0; i < beaconRegions.length; i++) {
        if (beaconRegions[i].identifier === regionState.identifier) {
          console.log('getFromRegion | FOUND');
          return beaconRegions[i];
        }
      }
      return null;
  }
  /*
      getTrophies = function($scope) {
        console.log('******************* | START  getTrophies!');
        promise = $http.get('https://digitalwatchproject.cross-systems.ch/users');
        console.log('******************* | END  getTrophies!');
      return null;
    }
  */
  // Get Trophies Json
  getTrophies = function($scope,dpd) {
      console.log('******************* | START  getTrophies!');
      // return null;
    /* WORK 
    dpd.trophies.get().success(function(response) {
        console.log('data : ', response);
        console.log("IN DPD" + JSON.stringify(response));

        return response;
    }).error(function(error) {
        console.log('error : ' + error.message, error);
    });
    */ 

    /*
     var promise1;
          console.log('******************* | IN getTrophies');
          // $http returns a promise, which has a then function, which also returns a promise
          promise1 = $http.get('https://digitalwatchproject.cross-systems.ch/trophies').then(function (response) {
          // The then function here is an opportunity to modify the response
         console.log('___****************** | IN RESPONSE');
         console.log(JSON.stringify(response.data));
          // The return value gets picked up by the then in the controller.
          return response.data;
        });
      console.log('******************* | END getTrophies!');
      // Return the promise to the controller
      return promise1;
      */
    var promise1;
    promise1 = dpd.trophies.get().then( function (response) {
      console.log(JSON.stringify(response.data));
       return response.data;
    });
    // Return the promise to the controller
    return promise1;


  }

    // Get Matched Trophies Json
  getGrantedTrophies = function($scope,dpd) {

    console.log('******************* | START  getTrophies Granted');
    var promise2;
    promise2 = dpd.trophiesmatched.get().then( function (response) {
      console.log(JSON.stringify(response.data));
       return response.data;
    });
    // Return the promise to the controller
    return promise2;
  }


  //Get list of granted trophy
  getListGrantedTrophies = function($scope) {
    // reSet beaconRegions for ALL other functions
    listGrantedTrophies = $scope.listGrantedTrophies;
    // TODO : voir pourquoi necessaire de redefinir le scope
    beaconRegions = $scope.trophies;

    console.log('getListGrantedTrophies | start!');
    for (var i = 0; i < listGrantedTrophies.length; i++) {
        var bRegionId = listGrantedTrophies[i].trophyid;
        // Loop on regions - should be optimized
        for (var j = 0; j < beaconRegions.length; j++) {
         if (beaconRegions[j].id === bRegionId) {
           listInfoGrantedTrophies.push(beaconRegions[j]);
        }
      }
    }
    return listInfoGrantedTrophies;
  }

    //Get Currents points
  getCurrentPoints = function($scope) {
    console.log('getCurrentPoints | start!');
    var points = 0;
    for (var i = 0; i < listGrantedTrophies.length; i++) {
        var bRegionId = listGrantedTrophies[i].trophyid;
        // Loop on regions - should be optimized
        for (var j = 0; j < beaconRegions.length; j++) {
         if (beaconRegions[j].id === bRegionId) {
           points += beaconRegions[j].points;
        }
      }
    }
    return points;
  }


// Launch monitoring of regions
  launchMonitoring = function($scope,$rootScope,$state) {
    console.log('launchMonitoring | start!');
    // reSet beaconRegions for ALL other functions
    beaconRegions = $scope.trophies;

    // console.log($scope);
    //$scope.openModal();
    // Sucess fallback
    var onMonitoringMatch = function(regionState) {
      console.log('Trophies Factory | Sucess. ' + regionState.state + " - "+ regionState.identifier) ;
      // *** Action for controllers *** /
      // Set region
      $scope.regionState = regionState;
      // Call dispatcher
      $scope.dispatchThrophyEvent();
    };
    // error fallback
    var onMonitoringError = function(errorMessage) {
      console.log('Trophies Factory | Failure. ') ;
    };
      
    var onAuthoResult = function(status) {
      /* If authorization mode is activated */
      console.log('Trophies Factory | onAuthoResult') ;
      if (status == 3) {
        $scope.statusSniffer = true;
        if($rootScope.monitoringLaunched==false) {
          $rootScope.monitoringLaunched = true;
          // Start monitoring Regions
          //for (var i in beaconRegions)
          for (var i = 0; i < beaconRegions.length; i++)
          {
            var beaconRegion = beaconRegions[i];
            if (beaconRegion.isActive == true){
            console.log('*** Trophies Factory | Start Monitoring') ;
              estimote.beacons.startMonitoringForRegion(beaconRegion,onMonitoringMatch,onMonitoringError);
            }
          }
        }
      }
      else {
        console.log("You have to have the localisation activated - start " +  status);
        $scope.gotoPrerequisites();
        console.log("You have to have the localisation activated - end" +  status);
      }
    }

    var onAuthoError = function() {
      console.log("onAuthoError");
    }
    estimote.beacons.authorizationStatus(onAuthoResult,onAuthoError);
  };

  return {
    // Launch Monitoring
    launchMonitoring : launchMonitoring,
    // Get Extended Region Info from BeaconRegion Identificators (identifier, uuid, major, minor)
    getFromRegion : getFromRegion,
    // Get Trophies
    getTrophies : getTrophies,
    // Get Trophies Granted
    getGrantedTrophies : getGrantedTrophies,
    // Get Kist
    getListGrantedTrophies : getListGrantedTrophies,
    // Get current points
    getCurrentPoints : getCurrentPoints
  };
})




.service('BeaconService', ['$q', 'ENV', function($q, env) {
	
	console.log('BeaconService | starting... ');
    return {
        listBeacons: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

			console.log('BeaconService | using appconfig.ENV : "' + env +'"');
			if ( env == 'dev-nobackend') {
				deferred.resolve('Welcome ' + name + '!');
			} else {	

			console.log('BeaconService | calling deployd service ... ');
		
			dpd.users.login({username: name, password: pw}, function(session, error) {
				if (error) {
				  console.log('error : ' + error.message);
				  deferred.reject('Wrong credentials.');
				  
				} else {
				  console.log('success !');

				  deferred.resolve('Welcome ' + name + '!');
				//location.href = "/welcome.html";

				}
			});
			console.log('LoginService | done deployd ... ');
			}

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
	console.log('BeaconService | done. ') ;
	
}]);