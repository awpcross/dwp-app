angular.module('starter.services', ['dpd', 'appconfig'])

 .factory('AuthService', function ($rootScope) {
        return {
            checkLogin: function() {
                // Check if logged in and fire events
                if(this.isLoggedIn()) {
                    $rootScope.$broadcast('app.loggedIn');
                } else {
                    $rootScope.$broadcast('app.loggedOut');
                }
            },
            isLoggedIn: function() {
                // Check auth token here from localStorage
                if (localStorage.getItem("coride_auth_token") === null || localStorage.getItem("coride_auth_token") === "undefined") {
                    return false
                } else {
                    return true
                };
            },
            logout: function(email, pass) {
                // Same thing, log out user
                $rootScope.$broadcast('app.loggedOut');
            }
        }
    })

.service('LoginService', ['dpd', '$q', 'ENV', function(dpd, $q, env) {
    
    console.log('LoginService | starting... ');
    return {
        loginUser: function(name, pw, dpd) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            
            username = 'bart@gmail.com';
            password = 'bart';
            
            console.log('LoginService | using appconfig.ENV : "' + env +'"');
            if ( env == 'dev-nobackend') {
                console.log('LoginService | skipping auth (no uid available...)');
                deferred.resolve('Welcome ' + username + '!');

            } else if ( env == 'dev-local-backend' ) {
            
            
            console.log('LoginService | auth with bart@gmail.com');
            
            dpd.users.exec('login', { username: username, password: password }).success(function(session) {
                  console.log('success ! Bart logged in');
                  console.log('Sucess logged in : ' + username + ' (' + session.uid + ')!');    

                console.log('checking current user start');
                console.log('persisting auth state');
                localStorage.setItem("user_auth_id") = session.id;
                console.log('set user_auth_id : ', localStorage.getItem("user_auth_id") );

              dpd.users.get('me').success(function(session) {
                  console.log('me :: success ! Bart logged in');
                  console.log('session', session);
                  console.log('me :: Sucess logged in : ' + session.nickname + ' (' + session.id + ')!'); 
                  deferred.resolve('Welcome ' + name + ' (' + session.uid + ')!'); 
              }).error(function(error) {
                  console.log('me::ERROR : ' + error.message, error);
                  console.log('me::ERROR : please check user : ' + username + ' exists in DB.');
                  deferred.reject('Wrong credentials.');
              });

              console.log('checking current user done.');

              deferred.resolve('Welcome ' + name + ' (' + session.uid + ')!'); 

                  }).error(function(error) {
                  console.log('ERROR : ' + error.message, error);
                  console.log('ERROR : please check user : ' + username + ' exists in DB.');
                  deferred.reject('Wrong credentials.');
              });
              
              

            } else {
            
            console.log('LoginService | calling deployd service (' + name + ' / ' + pw + ')... ');
            dpd.users.exec('login', { username: name, password: pw }).success(function(session) {
                  console.log('success !');

                console.log('persisting auth state');
                localStorage.setItem("user_auth_id", session.uid);
                console.log('set user_auth_id : ', localStorage.getItem("user_auth_id") );

                deferred.resolve('Welcome ' + name + ' !');         
            }).error(function(error) {
                  console.log('error : ' + error.message, error);
                  deferred.reject('Wrong credentials.');
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
    console.log('LoginService | done. ') ;
    
}])

// TODO : Ajouter deux trophees ( app telechargee et compte cree) dans la table trophiesmatched au moment de la creation de l user et mettre le bon totalscore dans la table users
.service('RegisterUserService', ['dpd', '$q', 'ENV', function(dpd, $q, env) {
    
    console.log('RegisterUserService | starting... ');
    return {
        registerUser: function(newusername, newpassword, newnickname, dpd) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            username = 'bart@gmail.com';
            password = 'bart';
            nickname = 'Bart Simpson'; 
            score = 1500;
            
            console.log('RegisterUserService | using appconfig.ENV : "' + env +'"');
            if ( env == 'dev-nobackend') {
                console.log('RegisterUserService | skipping register (no user created...)');
                deferred.resolve('Created ' + name + '!');

            } else if ( env == 'dev-local-backend' ) {
            
            
            console.log('RegisterUserService | registering bart@gmail.com (' + username + ' / ' + password + ' / ' + nickname + ')');
            
            dpd.users.post({ username: username, password: password, nickname: nickname, score: score, picture:false, acivated:false }).success(function(session) {
                  console.log('success ! user created');
                  console.log('Sucess created user : ' + username + ' (' + session.uid + ')!'); 
                  deferred.resolve('Created ' + name + ' (' + session.uid + ')!'); 
              }).error(function(error) {
                  console.log('ERROR : ' + error.message, error);
                  console.log('ERROR : please check could not create : ' + username + ' in DB.');
                  deferred.reject('Wrong credentials.');
              });

            } else {    
            console.log('RegisterUserService | calling deployd service (dpd.users.login)... ');
            
            dpd.users.post({ username: newusername, password: newpassword, nickname: newnickname, score: score, picture:false }).success(function(session) {
                  console.log('success ! user created');
                  console.log('Sucess created user : ' + session.username + ' (' + session.id + ')!'); 
                  deferred.resolve('Created ' + session.username + ' (' + session.id + ')!'); 
              }).error(function(error) {
                  console.log('ERROR : ' + error.message, error);
                  console.log('ERROR : please check could not create : ' + new  username + ' in DB.');
                  deferred.reject('Wrong credentials.');
              });

            console.log('RegisterUserService | done deployd ... ');
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
    console.log('RegisterUserService | done. ') ;
    
}])

.service('ProfileService', ['dpd', '$q', 'ENV', function(dpd, $q, env) {
    
    console.log('ProfileService | starting... ');
    return {
    
        getUserProfile: function(uid, dpd) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            username = 'bart@gmail.com';
            password = 'bart';
            nickname = 'Bart Simpson'; 
            score = 1500;
            
            console.log('ProfileService | using appconfig.ENV : "' + env +'"');
            if ( env == 'dev-nobackend') {
                console.log('ProfileService | skipping register (no user created...)');
                deferred.resolve('Created ' + name + '!');

            } else if ( env == 'dev-local-backend' ) {
            
            
            console.log('ProfileService | registering bart@gmail.com (' + username + ' / ' + password + ' / ' + nickname + ')');
            
              dpd.users.get('me').success(function(session) {
                  console.log('me :: success ! A user is logged in');
                  console.log('session', session);
                  console.log('me :: Sucess Sucess user is already logged in : ' + session.nickname + ' (' + session.id + ')!'); 
                  //deferred.resolve('Welcome ' + session.nickname + ' (' + session.id + ')!'); 
                  return(session);

              }).error(function(error) {
                  console.log('me::ERROR : ' + error.message, error);
                  console.log('me::ERROR : please check user : ' + username + ' exists in DB.');
                  deferred.reject('Wrong credentials.');
              });

            } else {    
            console.log('ProfileService | calling deployd service (dpd.users.get(me))... ');
            
              dpd.users.get(uid).success(function(session) {
			  
			  
                  console.log('me :: success ! A user is logged in');
                  console.log('session', session);
                  console.log('me :: Sucess logged in : ' + session.nickname + ' (' + session.id + ')!'); 
                  //deferred.resolve('Welcome ' + session.nickname + ' (' + session.id + ')!');
                  deferred.resolve(session);
                  return(session);
                  
              }).error(function(error) {
                  console.log('me::ERROR : ' + error.message, error);
                  console.log('me::ERROR : no user logged in.');
                  deferred.reject('No user logged in.');
              });

            
            console.log('ProfileService | done deployd ... ');
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
    
    };
    
    
    console.log('ProfileService | done. ') ;
    
}])


.factory('ScoreService', function($http,dpd) {


  var promise;
  var ScoreService = {
    getScores: function() {
      if ( !promise ) {
        // $http returns a promise, which has a then function, which also returns a promise
        promise = $http.get('https://digitalwatchproject.cross-systems.ch/users').then(function (response) {
          // The then function here is an opportunity to modify the response
          // TODO Penser a la mise a jour du score
          console.log("************** RESPONSE : "+response.data);
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


/* Beacons/Trophies Factory */
.factory('Trophies', function($http) {
  // TODO : get all region from a resource that returns a JSON array
   /*
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
    */
     var beaconRegions = [];
    var listGrantedTrophies = [];
    var listInfoGrantedTrophies = [];

    var  promise = [];

  // Get a specific trophy from regionState
  getFromRegion  = function($scope,regionState) {
    console.log('getFromRegion | start!');
    var  trophy = {};
    // Number of flagged of the trophy
    //var  nbFlagged = 0;
    for (var i = 0; i < beaconRegions.length; i++) {
        if (beaconRegions[i].identifier === regionState.identifier) {
          console.log('getFromRegion | FOUND');
          trophy = beaconRegions[i];
          // nbFlagged += 1;
        }
      }
      // trophy.nbFlagged = nbFlagged;
      //alert(trophy.nbFlagged);
      return trophy;
  }

  // Get Trophies Json
  getTrophies = function($scope,dpd) {
    console.log('******************* | START  getTrophies!');
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
    // Get Granted Trophies for the authentified user
    promise2 = dpd.trophiesmatched.get({userid:localStorage.getItem("user_auth_id")}).then( function (response) {
      console.log("INIT : Granted TROPHIES: "+JSON.stringify(response.data));
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
        //console.log("BOUCLE : "+ i + " bregionId : " + bRegionId);
        for (var j = 0; j < beaconRegions.length; j++) {
          //console.log("j : "+ j)
         if (beaconRegions[j].id === bRegionId) {
            listInfoGrantedTrophies.push(beaconRegions[j]);
           // console.log("ADD : "+ j + JSON.stringify(beaconRegions[j]));
        }
      }
    }
        console.log('getListGrantedTrophies | PASENDUR' + JSON.stringify(listInfoGrantedTrophies));
    // listInfoGrantedTrophies = JSON.stringify(listInfoGrantedTrophies);
    // listInfoGrantedTrophies = [{"name":"Zone Apero","description":"Apéritifs réseautage","points":500,"maxCount":1,"beaconColor":"yellow","endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez rencontrez nos intervenants","orderNo":3,"isActive":false,"uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":11,"minor":1,"identifier":"ZoneApero","delay":3600,"id":"8c1cc8ed6a6b7bbe"},{"name":"Rencontre Avec Nos Intervenants","description":" Rencontre avec nos intervenants","points":400,"maxCount":1,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez vite à l apero reseautage","orderNo":2,"isActive":false,"beaconColor":"yellow","delay":3600,"identifier":"RencontreAvecNosIntervenants","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":12,"minor":1,"id":"22334cdaa20578a3"},{"name":"Bienvenue Au Salon","points":300,"description":"App téléchargée !","maxCount":1,"beaconColor":"red","endDate":1430438399000,"startDate":1427984918000,"nextStep":"Créez vous un compte!","orderNo":1,"isActive":false,"uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":10,"minor":1,"identifier":"BienvenueAuSalon","delay":3600,"id":"eac708b7e5f508e1"},{"name":"Zone Stand","description":"Vous avez débloqué le trophée : Visite de notre stand (B12)","points":2000,"maxCount":2,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"C etait le dernier trophée. Revenez-nous voir au stand","orderNo":5,"isActive":true,"beaconColor":"black","delay":3600,"identifier":"ZoneStand","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":700,"minor":1,"id":"ebae93ac8b78cbce"},{"name":"Zone Conf","description":"Vous avez débloqué le trophée : Suivi de conférence BIG DATA","points":1000,"maxCount":1,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez vite au stand","orderNo":4,"isActive":true,"beaconColor":"blue","delay":3600,"identifier":"ZoneConf","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":500,"minor":1,"id":"aebda58efdbf3946"},{"name":"Zone Conf","description":"Vous avez débloqué le trophée : Suivi de conférence BIG DATA","points":1000,"maxCount":1,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez vite au stand","orderNo":4,"isActive":true,"beaconColor":"blue","delay":3600,"identifier":"ZoneConf","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":500,"minor":1,"id":"aebda58efdbf3946"}];
    console.log('******BEFORE ORDERING ******');
    listInfoGrantedTrophies = sortByKey(listInfoGrantedTrophies, 'orderNo');
    console.log('******AFTER ORDERING ******');
    return listInfoGrantedTrophies;
  }
    /*helper to sort Json*/
    sortByKey= function (array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    //Get Currents points
  getCurrentPoints = function($scope) {
    listGrantedTrophies = $scope.listGrantedTrophies;
    beaconRegions = $scope.trophies;
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

      //Get Currents points
  getNbMatch = function($scope,trophyid) {
    console.log('getNbMatch | start!'+ trophyid);
    listGrantedTrophies = $scope.listGrantedTrophies;
    var nbMatch = 0;
    for (var i = 0; i < listGrantedTrophies.length; i++) {
         if (listGrantedTrophies[i].trophyid === trophyid) {
           nbMatch += 1;
      }
    }
    console.log('getNbMatch | nbMatch' + nbMatch);
    console.log('getNbMatch | end!');
    return nbMatch;
  }

  // Get Matched Trophies Json
  checkIfDoublon = function($scope,trophyid,dpd) {
    console.log('******************* | START  checkIfDoublon' + localStorage.getItem("user_auth_id") +'- trophyid -' + trophyid);
    var promise3;
    // Get Granted Trophies for the authentified user
    promise3 = dpd.trophiesmatched.get({userid:localStorage.getItem("user_auth_id"),trophyid:trophyid}).then( function (response) {
      console.log("INIT : checkIfDoublon TROPHIES: "+JSON.stringify(response.data));
       return response.data.length;
    });
    // Return the promise to the controller
    return promise3;
  }

  // SetPoints
  setPoints = function ($scope,$trophy,dpd) {


    console.log("SETPOINTS : BEGIN" + JSON.stringify($trophy));
    var currentTS = new Date().getTime();
    // Set points
    dpd.trophiesmatched.post({ "timestamp" : currentTS, "trophyid":$trophy.id,"userid":localStorage.getItem("user_auth_id"),"points":$trophy.points}).success(function (result) {
            console.log("SETPOINTS : SUCESS" + JSON.stringify(result));
        }).error(function (err) {
           console.log("SETPOINTS : ERROR > " + JSON.stringify(err));
        }).finally(function () {
            console.log("SETPOINTS : FINALLY ");
        });
    // UPDATE GLOBAL SCORE
    dpd.users.put(localStorage.getItem("user_auth_id"),{"score":$scope.totalpoints}).success(function (result) {
            console.log("UPDATE GLOBALPOINT : SUCESS" + JSON.stringify(result));
        }).error(function (err) {
           console.log("UPDATE GLOBALPOINT : ERROR > " + JSON.stringify(err));
        }).finally(function () {
            console.log("UPDATE GLOBALPOINT : FINALLY ");
        });

   console.log("SETPOINTS : END");

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
      // Call dispatcherlog
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
    // Get nMatch
    getNbMatch : getNbMatch,
    // checkIfDoublon in DB
    checkIfDoublon : checkIfDoublon,
    // Get Kist
    getListGrantedTrophies : getListGrantedTrophies,
    // Get current points
    getCurrentPoints : getCurrentPoints,
    // Set addition points
    setPoints : setPoints
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