var app = angular.module('starter.controllers', ['dpd','ngCordova'])

// Password issue
.controller('SupportPasswordCtrl', function($scope, $state) {

	console.log('SupportPasswordCtrl | start... ') ;
		
	console.log('SupportPasswordCtrl | done. ') ;
  
})


.controller('AppHeaderCtrl', function($scope, $state, $ionicModal) {

  console.log('AppHeaderCtrl | starting ... ');

  $ionicModal.fromTemplateUrl('templates/dev.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal1 = modal
  })
  $ionicModal.fromTemplateUrl('templates/welcome-slider.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal
  })

  $scope.openModal1 = function() {
   $scope.modal1.show()
  }
  $scope.openModal2 = function() {
   $scope.modal1.show()
  }

  $scope.closeModal1 = function() {
    $scope.modal1.hide()
  }
  $scope.closeModal2 = function() {
    $scope.modal1.hide()
  }

  $scope.$on('$destroy', function() {
    $scope1.modal1.remove()
    $scope.modal2.remove()
  });  
  
  console.log('AppHeaderCtrl | done. ') ;
  
})
.controller('WelcomeCtrl', function(DataService, dpd, $scope, $state, $ionicSlideBoxDelegate) {

  console.log('WelcomeCtrl | starting ... ');

	$scope.$on('$ionicView.beforeEnter', function(){

		DataService.getBackendData(dpd, 'welcomecontents', 'live').success(function(response) {
			console.log('CrossNewsCtrl | INFO data returned ' + response.length + ' news items');
			$scope.labels = response;
			$scope.isError = false;
			
		}).error(function(error) {
			console.log('CrossNewsCtrl | ERROR An error occured while retrieving live data : ' + error);
			console.log('CrossNewsCtrl | INFO getting local data instead' + error);
			DataService.getBackendData(dpd, 'welcomecontents', 'local').success(function(response) {
				//console.log('EComNewsCtrl | INFO data returned : ' + response);
				$scope.labels = response;
				$scope.isError = true;
			}).error(function(error) {
				console.log('CrossNewsCtrl | ERROR An error occured while retrieving local data : ' + error);
			})
			
		})

	});	

/*	
  dpd.welcomecontents.get( { $sort: {orderno: 1}} ).success(function(response) {
        console.log('success !');
        console.log('data : ', response);
        $scope.labels = response;
    }).error(function(error) {
        console.log('error : ' + error.message, error);
    });
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

.controller('PrerequisitesCtrl', function($scope, $state, dpd) {

  console.log('PrerequisitesCtrl | starting ... ') ;
  // Called to navigate to the main app


  
  dpd.trophycontents.get( { $sort: {orderno: 1}} ).success(function(response) {
        console.log('success !');
        console.log('data : ', response);
        $scope.prereqs = response;
    }).error(function(error) {
        console.log('error : ' + error.message, error);
    });
  
  $scope.goTrophies = function() {
    $state.go('tab.trophies');
    //$state.go('tab.cross-news');
  };
  
  console.log('PrerequisitesCtrl | done. ') ;
  
})

.controller('EComNewsCtrl', function(dpd, DataService, $scope, $state) {
	
	console.log('EComNewsCtrl | INFO starting ... ') ;
	$scope.$on('$ionicView.beforeEnter', function(){

		DataService.getBackendData(dpd, 'newsecom', 'live').success(function(response) {
			console.log('EComNewsCtrl | INFO data returned ' + response.length + ' news items');
			$scope.ecomnews = response;			
			$scope.isError = false;
		}).error(function(error) {
			console.log('EComNewsCtrl | ERROR An error occured while retrieving live data : ' + error);
			console.log('EComNewsCtrl | INFO getting local data instead' + error);
			DataService.getBackendData(dpd, 'newsecom', 'local').success(function(response) {
				//console.log('EComNewsCtrl | INFO data returned : ' + response);
				$scope.ecomnews = response;
				$scope.isError = true;
			}).error(function(error) {
				console.log('EComNewsCtrl | ERROR An error occured while retrieving local data : ' + error);
			})
			
		})

	});	
	console.log('EComNewsCtrl | done. ') ;
	
	$scope.getCategoryIcon = function(ico) {
		var str = 'img/types/information.png';
		
		if (ico != null || ico != '') {
			str = 'img/types/'+ico+'.png';
		} 
		
		return str;
	};

	$scope.formatDate = function(ts) {
		var str = '';
		var d = new Date(ts);
		
		if (!isNaN(ts)) {
			
			if (d.getDate()  < 10) 		{str = "0"+d.getDate()+ '.'} else {str = d.getDate()+ '.'}
			if ((d.getMonth()+1) < 10) 	{str = str + "0"+ (d.getMonth()+1)+ '.'} else {str = str + (d.getMonth()+1)+ '.'}
			str = str + d.getFullYear()+ ' - ';
			if (d.getHours()  < 10) 		{str = str + "0"+d.getHours()+ '.'} else {str = str + d.getHours()+ '.'}
			if ((d.getMinutes()+1) < 10) 	{str = str + "0"+d.getMinutes()} else {str = str + d.getMinutes()}
			
		} 
		
		return str;
	};
})

.controller('CrossNewsCtrl', function(dpd, DataService, $scope, $state) {
	
	console.log('CrossNewsCtrl | INFO starting ... ') ;
	$scope.$on('$ionicView.beforeEnter', function(){

		DataService.getBackendData(dpd, 'newscross', 'live').success(function(response) {
			console.log('CrossNewsCtrl | INFO data returned ' + response.length + ' news items');
			$scope.ecomnews = response;
			$scope.isError = false;
		}).error(function(error) {
			console.log('CrossNewsCtrl | ERROR An error occured while retrieving live data : ' + error);
			console.log('CrossNewsCtrl | INFO getting local data instead' + error);
			DataService.getBackendData(dpd, 'newscross', 'local').success(function(response) {
				//console.log('EComNewsCtrl | INFO data returned : ' + response);
				$scope.ecomnews = response;
				$scope.isError = true;
			}).error(function(error) {
				console.log('CrossNewsCtrl | ERROR An error occured while retrieving local data : ' + error);
			})
			
		})

	});	
	console.log('EComNewsCtrl | done. ') ;
	
	$scope.getCategoryIcon = function(ico) {
		var str = 'img/types/information.png';
		
		if (ico != null || ico != '') {
			str = 'img/types/'+ico+'.png';
		} 
		
		return str;
	};

	$scope.formatDate = function(ts) {
		var str = '';
		var d = new Date(ts);
		
		if (!isNaN(ts)) {
			if (d.getDate()  < 10) 		{str = "0"+d.getDate()+ '.'} else {str = d.getDate()+ '.'}
			if ((d.getMonth()+1) < 10) 	{str = str + "0"+ (d.getMonth()+1)+ '.'} else {str = str + (d.getMonth()+1)+ '.'}
			str = str + d.getFullYear()+ ' - ';
			if (d.getHours()  < 10) 		{str = str + "0"+d.getHours()+ '.'} else {str = str + d.getHours()+ '.'}
			if ((d.getMinutes()+1) < 10) 	{str = str + "0"+d.getMinutes()} else {str = str + d.getMinutes()}
		} 
		
		return str;
	};
})


.controller('SignInCtrl', function($ionicPopup, $scope, $state, LoginService, dpd, ProfileService) {


	console.log('SignInCtrl | starting ... ') ;
	  $scope.user = {
		username: '',
		password : ''
	  };

	$scope.$on('$ionicView.beforeEnter', function(){
		console.log('$ionicView.beforeEnter  start');
		if ( localStorage.getItem('user_auth_id') != null && localStorage.getItem('user_auth_id') != '' ) {
			console.log('SignInCtrl | already logged in('+localStorage.getItem('user_auth_id')+'), redirecting to profile view. ') ;
			$state.go('tab.profile');
		} else {
			console.log('SignInCtrl | not logged in, authenticating user. ') ;
		}
		console.log('$ionicView.beforeEnter end ') ;
	  });	

	
	$scope.signIn = function(form){
		console.log(form);
		console.log($scope.user.username);

		if(form.$valid) {

    if (form != null && form.$valid) {
		console.log('SignInCtrl.signIn() | Signing in user : ', form);

		LoginService.loginUser($scope.user.username, $scope.user.password, dpd).success(function(user) {
		  $scope.user = {};
		  $state.go('tab.profile');
		}).error(function(user) {
		  var alertPopup = $ionicPopup.alert({
			title: 'Erreur!',
			template: 'Veuillez vérifier votre email et mot de passe!'
		  });
    });
  
  } else {
	console.log('SignInCtrl.signIn() | Signing in user : !!warning user is empty!!'); 
      var alertPopup = $ionicPopup.alert({
        title: 'Erreur!',
        template: 'Veuillez vérifier votre email et mot de passe!'
      });
  
  }


		} else {
			console.log(form);
		}
	
	}

  console.log('SignInCtrl | done. ') ;
  
})

.controller('RegisterCtrl', function($scope, $state, $ionicPopup, RegisterUserService, dpd) {
  console.log('RegisterCtrl | starting ... ') ;

  var newuser = $scope.newuser;
  
  $scope.registerUser = function(newuser) {
  console.log('RegisterCtrl.registerUser() | start. ') ;

    if (newuser == null) {
  console.log('RegisterCtrl.registerUser() | registering user : !!warning user is empty!!');  
  } else {
  console.log('RegisterCtrl.registerUser() | registering user : ', newuser);

  RegisterUserService.registerUser(newuser.username, newuser.password, newuser.nickname, dpd).success(function(user) {
  
  // TODO PES / LAL auto signin the user
  dpd.users.exec('login', { username: newuser.username, password: newuser.password }).success(function(session) {
      console.log('success ! user logged in');
      console.log('Sucess logged in : ' + session.username + ' (' + session.uid + ')!');   

    console.log('checking current user start');
    console.log('persisting auth state');
    localStorage.setItem("user_auth_id", session.uid);
    console.log('set user_auth_id : ', localStorage.getItem("user_auth_id") );
    //state.go('tab.profil');
	var currentTS = new Date().getTime();	
	dpd.trophiesmatched.post({ "timestamp" : currentTS, "trophyid":"eac708b7e5f508e1","userid":session.uid,"points":1000});
	dpd.trophiesmatched.post({ "timestamp" : currentTS, "trophyid":"22334cdaa20578a3","userid":session.uid,"points":500});
	
	$state.go('tab.profile');
    
    }).error(function(error) {
      console.log('ERROR : ' + error.message, error);
      console.log('ERROR : please check could not update : ' + session.id + ' in DB.');
    }); 


  
  }).error(function(user) {
    var alertPopup = $ionicPopup.alert({
      title: 'Ce nom d\'utilisateur existe!',
      template: 'Veuillez choisir un autre nom d\'utilisateur.'
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

.controller('LostPasswordCtrl', function($scope, $state, $http, $ionicPopup, $ionicLoading, dpd) {

  console.log('LostPasswordCtrl | starting ... ') ;

  $scope.user = {
		email: '',
		password : ''
	  };

 
  $scope.sendPasswordReset = function( form ) {
    
	$ionicLoading.show({
	template: 'loading'
	});
	
    if ( $scope.user.email == null && !form.$valid ) {
      var alertPopup = $ionicPopup.alert({
        title: 'Erreur',
        template: 'Veuillez saisir un email valide! [1]'
      });   
    } else {
      console.log('LostPasswordCtrl::sendPasswordReset() | looking for user : ' + $scope.user.email) ;
      console.log('loading screen') ;

	  
	  
      // 1. check if user exists (ok : 2., ko :alert)
	  
      dpd.users.get( {"username":$scope.user.email} ).success(function(response) {
            
            if ( response == null || response == ''){ 
              console.log('LostPasswordCtrl::sendPasswordReset() | no such user : ' + $scope.user.email) ;
              var alertPopup = $ionicPopup.alert({
                title: 'Erreur',
                template: 'Une erreur est survenue, veuillez vérifier l\'adresse email saisie.'
              });   
            } else {
              console.log('LostPasswordCtrl::sendPasswordReset() | found user : ' + response[0].username +'(' + response[0].id + ')');
              var user = response[0];

			  var scrambleidprefix = ('000' + Math.floor(Math.random()*100001)).substr(-5);

              var link = 'http://digitalwatchproject.cross-systems.ch/#/user-reset-password/' + scrambleidprefix + response[0].id;
				
			  
              // 2. send email & set flag passwordreset: true
              var mailJSON ={
                  "key": "b5jBPWAtZOqLnILTUURplQ",
                  "template_name": "dwp-app-password-reset",
                    "template_content": [
                      {
                        "nickname": user.nickname,
                        "link": 'http://digitalwatchproject.cross-systems.ch/#/user-reset-password/' + scrambleidprefix + user.id,
                        "password" : '1234'
                        }
                    ],
                    "message": {
                    "html": "<p>Example HTML content</p>",
                    "text": "Example text content",
                    "from_email": "projectdigitalwatch@cross-systems.ch",
                    "from_name": "Project Digital Watch by Cross",
                    "to": [
                      {
                        "email": user.username,
                        "name": user.nickname,
                        "type": "to"
                      }
                    ],
                    "important": false,
                    "track_opens": null,
                    "track_clicks": null,
                    "auto_text": null,
                    "auto_html": null,
                    "inline_css": null,
                    "url_strip_qs": null,
                    "preserve_recipients": null,
                    "view_content_link": null,
                    "tracking_domain": null,
                    "signing_domain": null,
                    "return_path_domain": null,
                    "merge": true,
                    "merge_language": "handlebars",
                    "merge_vars": [
                          {
                            "rcpt": user.username,
                            "vars": [
                              {
                                "name": "nickname",
                                "content": user.nickname
                              },
                              {
                                "name": "link",
                                "content": link
                              }
                              
                            ]
                          }
                        ]                   
                  },
                  "async": false,
                  "ip_pool": "Main Pool"
                };
                //reference to the Mandrill REST api
                var apiURL = "https://mandrillapp.com/api/1.0/messages/send-template.json";
                //used to send the email via POST of JSON to Manrdill REST API end-point

              console.log('LostPasswordCtrl::sendPasswordReset() | sending email ...') ;
                $http.post(apiURL, mailJSON).
                  success(function(data, status, headers, config) {
                    console.log('successful email send.');
                    var alertPopup = $ionicPopup.alert({
                      title: 'Confirmation',
                      template: 'Un email de réinitialisation vous a été envoyé. Veuillez consulter votre boîte mail et suivre les instructions.'
                    });   
                    console.log('status: ' + status);
                  }).error(function(data, status, headers, config) {
                    console.log('error sending email.');
                    var alertPopup = $ionicPopup.alert({
                      title: 'Erreur',
                      template: 'Une erreur est survenue dans l\'envoi de l\'email, veuillez rééssayer. Veuillez consulter votre boîte mail et suivre les instructions.'
                    });   
                    console.log('status: ' + status);
                  });
              console.log('LostPasswordCtrl::sendPasswordReset() | sending done.') ;
                            
             $ionicLoading.hide(); 
              
            }
        }).error(function(error) {
          console.log('error : ' + error.message, error);
          var alertPopup = $ionicPopup.alert({
            title: 'Erreur!',
            template: 'Veuillez vérifier votre email et mot de passe! [2]'
          });
            
        });



		
	}
    
    

  } 
  
  
  
  // 3. go to set password view
  
  console.log('LostPasswordCtrl | done. ') ;
})

.controller('ResetPasswordCtrl', function($scope, $state, $stateParams, $ionicPopup, dpd) {
  console.log('ResetPasswordCtrl | starting ... ') ;

  console.log('ResetPasswordCtrl');
  
    var uidurl = $stateParams.uid;
	
	var uid = uidurl.substr(5);
	
    $scope.user = null;
    console.log(uid)
    if ( uid == null) {
		console.log('ResetPasswordCtrl::resetPassword() | no user id : ' + uid );
		console.log('ResetPasswordCtrl | redirecting to password support page ... ') ;
		// TODO send email here
		state.go('support-error-set-password');	  

    } else {
      console.log('LostPasswordCtrl::sendPasswordReset() | looking for user : ' + uid) ;

      // 1. check if user exists (ok : 2., ko :alert)
      dpd.users.get( {"id":uid} ).success(function(response) {
            
            if ( response == null || response == ''){ 
				console.log('LostPasswordCtrl::sendPasswordReset() | no such user : ' + uid) ;
				console.log('ResetPasswordCtrl | redirecting to password support page ... ') ;
				// TODO send email here
				state.go('support.password');	  
            } else {
              console.log(response);
              console.log('LostPasswordCtrl::sendPasswordReset() | found user : ' + response.username +'(' + response.id + ')');
              user = response;
              $scope.user = response;
              
              console.log('LostPasswordCtrl::sendPasswordReset() | redirecting to set new password.') ;
              // state.go('set-new-password');
                            
              
              
            }
        }).error(function(error) {
          console.log('error : ' + error.message, error);
          var alertPopup = $ionicPopup.alert({
            title: 'Erreur',
            template: 'Erreur lors de la réinitialisation du mot de passe.'
          });
            
        });
    }
    

  /*}*/ 

  $scope.updateUserPassword = function(form, $scope) {
    pwd1 = form.pwd1;
    pwd2 = form.pwd2;

    
    console.log('updating password for user : ' + user.username);
    
    if (pwd1 == pwd2 ){
      console.log('setting password : \'' + pwd1 + '\' for user : ' +  user.username  );
      dpd.users.put( $stateParams.uid, { password: pwd1, nickname: user.nickname}).success(function(session) {
          console.log('success ! user updated');
          console.log('Sucess updated user : ' + $stateParams.uid + '!');
          
      console.log('authenticating user '+  user.username +' with password ' + pwd1);

      dpd.users.exec('login', { username: user.username, password: pwd1 }).success(function(session) {
          console.log('success ! user logged in');
          console.log('Sucess logged in : ' + user.username + ' (' + session.uid + ')!');   

        console.log('checking current user start');
        console.log('persisting auth state');
        localStorage.setItem("user_auth_id", session.id);
        console.log('set user_auth_id : ', localStorage.getItem("user_auth_id") );
        //state.go('tab.profil');
        
        }).error(function(error) {
          console.log('ERROR : ' + error.message, error);
          console.log('ERROR : please check could not update : ' + $stateParams.uid + ' in DB.');
        });       

          
        }).error(function(error) {
          console.log('ERROR : ' + error.message, error);
          console.log('ERROR : please check could not update : ' + $stateParams.uid + ' in DB.');
        });


    
    }
  }
  console.log('ResetPasswordCtrl | done. ') ;
})

.controller('ChangePasswordCtrl', function($scope, $state, $stateParams, $ionicPopup, dpd) {
  console.log('ChangePasswordCtrl | starting ... ') ;

  
  /*$scope.resetPassword = function( $stateParams ) {*/

    var uid = localStorage.getItem('user_auth_id');
    $scope.user = null;
    if ( uid == null) {
      console.log('ChangePasswordCtrl::resetPassword() | wrong id : ' + uid );
      var alertPopup = $ionicPopup.alert({
        title: 'Erreur',
        template: 'Erreur lors de la réinitialisation du mot de passe.'
      });   
    } else {
      console.log('ChangePasswordCtrl::sendPasswordReset() | looking for user : ' + uid) ;

      // 1. check if user exists (ok : 2., ko :alert)
      
      dpd.users.get( {"id":uid} ).success(function(response) {
            
            if ( response == null || response == ''){ 
              console.log('ChangePasswordCtrl::sendPasswordReset() | no such user : ' + uid) ;
              var alertPopup = $ionicPopup.alert({
                title: 'Erreur',
                template: 'Erreur lors de la réinitialisation du mot de passe.'
              });
              // state.go( out' );
            } else {
              console.log(response);
              console.log('ChangePasswordCtrl::sendPasswordReset() | user : ' + response.username +'(' + response.id + ')');
              user = response;
              $scope.user = response;
                                          
              
              
            }
        }).error(function(error) {
          console.log('error : ' + error.message, error);
          var alertPopup = $ionicPopup.alert({
            title: 'Erreur',
            template: 'Erreur lors de la réinitialisation du mot de passe.'
          });
            
        });
    }
    

  /*}*/ 

  $scope.updateUserPassword = function(form, $scope ) {
    pwd1 = user.pwd1;
    pwd2 = user.pwd2;

    
    console.log('updating password for user : ' + user.username);
	console.log(pwd1);
	console.log(pwd2);
    
    if (pwd1 == pwd2 ){
      console.log('setting password : \'' + pwd1 + '\' for user : ' +  user.username  );
      dpd.users.put( uid, { password: pwd1, nickname: user.nickname}).success(function(session) {
          console.log('success ! user updated');
          console.log('Sucess updated user : ' + $stateParams.uid + '!');
          
      console.log('authenticating user '+  user.username +' with password ' + pwd1);
      
      $state.go('tab.profile');

          
        }).error(function(error) {
          console.log('ERROR : ' + error.message, error);
          console.log('ERROR : please check could not update : ' + $stateParams.uid + ' in DB.');
        });


    
    } else {
		  var alertPopup = $ionicPopup.alert({
			title: 'Erreur!',
			template: 'Les deux mots de passe ne sont pas identiques!'
		  });
	
	}
  }
  console.log('ChangePasswordCtrl | done. ') ;
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
  $scope.nextStep = "Identifiez vous pour continuer.";
  $scope.prereq_shown = false;

  // Call launchMonitoring from Services
  $scope.main =  function() {
    $scope.$apply();
    console.log('IN MAIN : > ' + localStorage.getItem("user_auth_id"));

    // Monitor all trohies
    Trophies.getTrophies($scope, dpd).then(function(promise_trophies) {
      $scope.trophies = promise_trophies;
      // Get Granted trophies 
      Trophies.getGrantedTrophies($scope, dpd).then(function(promise_grantedTrophies) {
          console.log('rootScope.monitoringLaunched > ' + $rootScope.monitoringLaunched);
           //TODO : if $rootScope.monitoringLaunched==true, verifiy that monitoring is allowed...
          if($rootScope.monitoringLaunched==false || $rootScope.monitoringLaunched==true) {
            $scope.listGrantedTrophies = promise_grantedTrophies;
            //console.log("GRANTED_LIST: " +JSON.stringify($scope.listGrantedTrophies));
            $scope.listInfoGrantedTrophies = [];
            $scope.listInfoGrantedTrophies = Trophies.getListGrantedTrophies($scope);
            //total point
            $scope.totalpoints = Trophies.getCurrentPoints($scope);
            
            console.log('IN MAIN before if');
            // Launch Monitoring
            if (localStorage.getItem("user_auth_id")) {
              console.log("********* someone is identified" + localStorage.getItem("user_auth_id") );
              $scope.nextStep = "";
              Trophies.launchMonitoring($scope,$rootScope);
            }
            else {
              console.log("********* Nobody is identified"+ localStorage.getItem("user_auth_id") );
              $scope.nextStep = "Identifiez vous pour continuer.";
              $scope.listInfoGrantedTrophies = [];
            }
          }
          // Fix for underterminedBug
          else if (localStorage.getItem("user_auth_id")=='') {
            console.log('IN PARTICULAR BUG [BEGIN]');
            $scope.nextStep = "Vous n'êtes plus connecté. Identifiez-vous pour continuer.";
            $scope.listInfoGrantedTrophies = [];
            estimote.beacons.stopMonitoringForRegion({});
            $rootScope.monitoringLaunched  = false;
            console.log('IN PARTICULAR BUG [END]');
          }
      });
    });
    

  }

	$scope.getCategoryIcon = function(ico) {
		var str = 'img/types/information.png';
		
		if (ico != null || ico != '') {
			str = 'img/types/'+ico+'.png';
		} 
		
		return str;
	};
  
  $scope.gotoPrerequisites =  function() {
    console.log('gotoPrerequisites');
    // $rootScope.monitoringLaunched = true;
    $state.go('prerequisites');
  }

  // Callback from Services
  $scope.dispatchThrophyEvent = function() {
    if ($scope.regionState.state=='inside') {
      //  Get the associate TROPHY
      var currentTS = new Date().getTime();
      var trophy = Trophies.getFromRegion($scope,$scope.regionState);
     console.log("DISPATCH EVENT begin");
      // $scope.nbMatch = Trophies.getNbMatch($scope,trophy.id);
      // Workaround
      //$scope.nbMatch = Trophies.checkIfDoublon($scope,trophy.id,dpd);

      Trophies.checkIfDoublon($scope, trophy.id,dpd).then(function(promise_nbmatch) {
        $scope.nbMatch = promise_nbmatch;

        
      // TODO : Add logic : multicheck
      console.log("MATCHING THIS TROPHY :" + $scope.nbMatch + " - " +  currentTS + " " + JSON.stringify(trophy));
      // Get nbMatch
      
      if (currentTS > trophy.startDate  &&  currentTS < trophy.endDate && $scope.nbMatch < trophy.maxCount) {

        // IF app in Background
       if ($rootScope.appInBackground) {
          console.log('DispatchEvent in BackGround ' + $rootScope.appInBackground);
          $scope.displayNotification($scope.regionState);
        }
        console.log("***** iT IS A MATCH **** ");
        //TODO : CALL BACKEND TO adapt the DB
      //  $scope.$apply( function() {
          console.log('Add newItem');
          // Update NextStep in the view 
          $scope.nextStep = trophy.nextStep;
          // Update Score in the view
          $scope.totalpoints += trophy.points;
          $scope.listInfoGrantedTrophies.push(trophy);
          // Update Score in the DB
          Trophies.setPoints($scope, trophy, dpd);
        //}); // END sccope.apply
      } // End IF
      }); // END Trophies.checkIfDoublon

    }
  }


  $scope.displayNotification = function(regionState) {
      var notification_msg = regionState.state+" "+regionState.identifier;
      var notification_msg ="Vous avez débloqué un nouveau trophée."
      if (regionState.state=='inside') {
        //Send a Notification
        window.plugin.notification.local.add({ id:777, message: notification_msg,badge:0});
        console.log('Bravo vous avez débloqué un nouveau trophée');
      }
  }
    // Gestion modal des prerequis  - faire une version allegée pour le bluetooth [BEGIN]

  dpd.prereqcontents.get( { $sort: {orderno: 1}} ).success(function(response) {
        console.log('success !');
        console.log('data : ', response);
        $scope.prereqs = response;
    }).error(function(error) {
        console.log('error : ' + error.message, error);
    });
    
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
   /* Check Status */
    console.log('$ionicView.loaded event captured | start');
    // STOP MONITORING and launch PREREQUIS
    estimote.bluetoothState(function(result){
        console.log('Bluetooth state: ' + result);
        $rootScope.bluetoothAct = result;
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
      },function(errorMessage) {
        console.log('Error getBluetoothStatus: ' + errorMessage);});

   // console.log('BEFORE call of Trophies.getBluetoothStatus > $rootScope.bluetoothAct' + $rootScope.bluetoothAct);
   // $rootScope.bluetoothAct = Trophies.getBluetoothStatus($rootScope);
   // console.log('AFTER call of Trophies.getBluetoothStatus> $rootScope.bluetoothAct' + $rootScope.bluetoothAct);
    console.log('$ionicView.loaded event captured | end');
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    // Set prerequi display to true
    console.log('------------------------ In Scope Before beforeLeave - BEGIN' +  $scope.prereq_shown);
    if ($scope.prereq_shown == true) {
        $scope.prereq_shown = false;
    }
    console.log('------------------------ In Scope Before Leave - END' +  $scope.prereq_shown);
  });


})


.controller('LeaderboardCtrl', function(dpd, DataService, ScoreService, $scope, $http) {
  console.log('LeaderboardCtrl | starting ... ');

	$scope.$on('$ionicView.beforeEnter', function(){
		DataService.getBackendData(dpd, 'scores', 'live').success(function(response) {
			console.log('LeaderboardCtrl | INFO data returned ' + response.length + ' row(s)');
			$scope.players = response;
			console.log(response);
			$scope.isError = false;
		}).error(function(error) {
			console.log('LeaderboardCtrl | ERROR An error occured while retrieving live data : ' + error);
			console.log('LeaderboardCtrl | INFO getting local data instead' + error);
			DataService.getBackendData(dpd, 'scores', 'local').success(function(response) {
				//console.log('EComNewsCtrl | INFO data returned : ' + response);
				$scope.players = response;
				$scope.isError = true;
			}).error(function(error) {
				console.log('LeaderboardCtrl | ERROR An error occured while retrieving local data : ' + error);
			})
			
		})

	});	
  
  console.log('LeaderboardCtrl | ScoreService.getScores() --> players : ', $scope.players);

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
	console.log('ProfileCtrl | user_auth_id ... ' + localStorage.getItem('user_auth_id') ) ;

  	$scope.$on('$ionicView.beforeEnter', function(){
		console.log("$ionicView.beforeEnter");
		if ( localStorage.getItem('user_auth_id') != null && localStorage.getItem('user_auth_id') != '' ) {
			uid = localStorage.getItem('user_auth_id');

              dpd.users.get(uid).success(function(session) {
                  console.log('me :: success ! A user is logged in');
                  console.log('session', session);
                  console.log('me :: Sucess Sucess user is already logged in : ' + session.nickname + ' (' + session.id + ')!'); 
                  //deferred.resolve('Welcome ' + session.nickname + ' (' + session.id + ')!');
				  $scope.user = session;
                  return(session);

              }).error(function(error) {
                  console.log('me::ERROR : ' + error.message, error);
                  console.log('me::ERROR : please check user : ' + username + ' exists in DB.');
                  deferred.reject('Wrong credentials.');
              });

			
		} else {
			console.log('ProfileCtrl | user is not authenticated anymore');
			$state.go('tab.profilelogin');
			
		}
	  });	

  
/*
  ProfileService.getUserProfile(localStorage.getItem('user_auth_id'), dpd).success(function(response) {
    $scope.user = response;
    console.log('response', response);
  });  
*/  

  $scope.signOutUser = function(user, $rootScope) {
  
  console.log('ProfileCtrl.signOutUser() | start. ') ;

  if (user != null) {
  console.log('ProfileCtrl.signOutUser() | Signing in user : ', user);
  } else {
  console.log('ProfileCtrl.signOutUser() | Signing in user : !!warning user is empty!!'); 
  }

  console.log('ProfileCtrl | logging out ');

  dpd.users.get('me').success(function(session, $rootScope) {
  console.log('me :: success ! A user is logged in');
  console.log('session', session);
  console.log('me :: Sucess logged in : ' + session.nickname + ' (' + session.id + ')!'); 

    dpd.users.get('logout').success(function(session) {
        console.log('Sucessfuly logged out !');
        //deferred.resolve('Logged out ' + name + ' !');
        console.log('persisting auth state');
        // NULL
        localStorage.setItem("user_auth_id", '');
        console.log('set user_auth_id : "', localStorage.getItem("user_auth_id") +'"' );
		
		//TODO expire user cache
		
        // Stop monitoring
        
        if ($rootScope.monitoringLaunched  ==true ) {
          console.log("STOP MONITORING in Profil if");
          estimote.beacons.stopMonitoringForRegion({});
          $rootScope.monitoringLaunched  = false;
        }
        console.log("STOP MONITORING in Profil");
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
  console.log('ProfileCtrl.signOutUser() | end. ') ;
  };
  
  console.log('ProfileCtrl | done. ') ;
})


.controller('TestBackendCacheCtrl', function(dpd, dpdConfig, DataService, $scope, $state) {

	console.log('TestBackendCacheCtrl | processing... ') ;
	
	console.log('TestBackendCacheCtrl | DataService.getLiveAppLabelsData() test');	
	DataService.getBackendData(dpd, 'welcomecontents', 'live').success(function(response) {
		console.log('TestBackendCacheCtrl | data returned : ' + response);
		$scope.backendTestData = response;
	}).error(function(error) {
		console.log('TestBackendCacheCtrl | An error occured : ' + error);
	})
	
	console.log('TestBackendCacheCtrl | DataService.getLiveAppLabelsData() applabels');	
	DataService.getBackendData(dpd, 'applabels', 'live').success(function(response) {
		console.log('TestBackendCacheCtrl | data returned : ' + response);
		$scope.backendTestData = response;
	}).error(function(error) {
		console.log('TestBackendCacheCtrl | An error occured : ' + error);
	})

	console.log('TestBackendCacheCtrl | DataService.getLiveAppLabelsData() welcomecontents');	
	DataService.getBackendData(dpd, 'appcontents', 'live').success(function(response) {
		console.log('TestBackendCacheCtrl | data returned : ' + response);
		$scope.backendTestData = response;
	}).error(function(error) {
		console.log('TestBackendCacheCtrl | An error occured : ' + error);
	})
	
	var status = DataService.getBackendCacheStatus();
	console.log(status);
	$scope.cacheStatus = status;
	
	
	//DataService.cleanBackendCacheData();
	
	/*
	console.log('WelcomeCtrl | DataService.getAppLabelsData(\'live\') ');	
	obj1 = DataService.getAppLabelsData(dpd, 'live');	
	console.log(obj1);
	
	console.log('WelcomeCtrl | DataService.getCachedAppLabelsData() ');	
	obj1 = DataService.getCachedAppLabelsData(dpd, 'tmp');	
	console.log(obj1);
	console.log('WelcomeCtrl | DataService.getAppLabelsData(\'cache\') ');	
	obj1 = DataService.getAppLabelsData(dpd, 'cache');	
	console.log(obj1);
	*/
	
	
	//localAppLabels = DataService.getLocalAppLabelsData();
	//$scope.localAppLabels = DataService.getAppLabelsData('local');

	console.log('TestBackendCacheCtrl | done. ') ;
	
})
.controller('TestAppConfigCtrl', function(dpd, dpdConfig, AppConfigService, $scope, $state) {

	console.log('TestAppConfigCtrl | INFO |  processing... ') ;

  	$scope.$on('$ionicView.beforeEnter', function(){
		console.log('TestAppConfigCtrl | INFO |  $ionicView.beforeEnter processing... ') ;
		var t1 = new Date();
		var labels = AppConfigService.appLabelsForSection('TST', 'fr');
		var t2 = new Date();
		console.log('TestAppConfigCtrl | INFO | AppConfigService.appLabelsForSection(\'WEL\', \'fr\') took ' + (t2 - t1) + 'ms');
		$scope.labels = labels;

		var t3 = new Date();
		var contents = AppConfigService.appContentsForSection('TST', 'fr');
		var t4 = new Date();
		console.log('TestAppConfigCtrl | INFO | AppConfigService.appContentsForSection(\'TST\', \'fr\') took ' + (t4 - t3) + 'ms');
		console.log('TestAppConfigCtrl | INFO |  done. ') ;
		$scope.contents = contents;
		console.log('TestAppConfigCtrl | INFO |  $ionicView.beforeEnter done ') ;
	  });		
	
})

.controller('DevCtrl', function($scope, $state, $ionicLoading) {

	console.log('TestAppConfigCtrl | INFO |  processing... ') ;

  	$scope.$on('$ionicView.beforeEnter', function(){
		console.log('TestAppConfigCtrl | INFO |  $ionicView.beforeEnter processing... ') ;
		contents = [];
		
		for (i=0; i <100; i++)
			contents.push( ('000' + Math.floor(Math.random()*100001)).substr(-5) );
			
		$scope.contents = contents;
		console.log('TestAppConfigCtrl | INFO |  $ionicView.beforeEnter done ') ;
	  });		
	$ionicLoading.show({
	template: 'loading'
	});
	
})
;