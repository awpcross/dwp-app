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
        promise = $http.get('http://localhost:2403/users').then(function (response) {
          // The then function here is an opportunity to modify the response
          console.log(response);
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





