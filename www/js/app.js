// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','angular.filter', 'ngMessages'])

// TODO dpd initialisation
//.value('dpdConfig',['categories']);

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);}
    // org.apache.cordova.statusbar required
    if (window.StatusBar) { StatusBar.styleDefault(); }
    // Ask to authorize BG monitoring
    //console.log('Device Ready | Request authorization ') ;
    estimote.beacons.requestAlwaysAuthorization();
    // Ask to authorize Notification 
    window.plugin.notification.local.promptForPermission();
    
  });


  /*App State*/
  $rootScope.appInBackground = false;
  $rootScope.bluetoothAct = true;
  $rootScope.monitoringLaunched = false;
  $rootScope.statusSniffer = false;

  /* Listener */
  $ionicPlatform.on('resume', function(){
    console.log('********** Event RESUME appInForground ') ;
    $rootScope.appInBackground = false;
  });
  $ionicPlatform.on('pause', function(){
    console.log('********* Event PAUSE appInBackground ') ;
     $rootScope.appInBackground = true;
  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // Prerequis all
  .state('support', {
    url: '/support',
    templateUrl: 'templates/support-password.html',
    controller: 'SupportPasswordCtrl'
    })
    
  
	// Welcome slider
	.state('welcome', {
		url: '/welcome',
		templateUrl: 'templates/welcome-slider.html',
		controller: 'WelcomeCtrl'
	})
	
    // Prerequis all
  .state('prerequisites', {
    url: '/prerequisites',
    templateUrl: 'templates/prerequisites.html',
    controller: 'PrerequisitesCtrl'
    })

  // App Sign-in, register, user management 


	.state('signin', {
		url: '/sign-in',
		templateUrl: 'templates/user-sign-in.html',
		controller: 'SignInCtrl'
	})
	.state('forgotpassword', {
		url: '/forgot-password',
		templateUrl: 'templates/user-forgot-password.html',
	})

// App signed-in states

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})
	
	// tab states

	.state('tab.news-ecom', {
		url: '/news-ecom',
		views: {
			'tab-news-ecom': {
				templateUrl: 'templates/tab-news-ecom.html',
				controller: 'EComNewsCtrl'
			}
		}
	})

	.state('tab.cross-news', {
		url: '/cross-news',
		views: {
			'tab-cross-news': {
				templateUrl: 'templates/tab-news-cross.html',
				controller: 'CrossNewsCtrl'
			}
		}
	})

	.state('tab.trophies', {
	  url: '/trophies',
	  views: {
		'tab-trophies': {
		  templateUrl: 'templates/tab-trophies.html',
		  controller: 'TrophiesCtrl'
		}
	  }
	})

	.state('tab.leaderboard', {
      url: '/leaderboard',
      views: {
        'tab-leaderboard': {
          templateUrl: 'templates/tab-leaderboard.html',
          controller: 'LeaderboardCtrl'
        }
      }
    })

	.state('tab.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'templates/user-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
		
	.state('tab.profilelogin', {
      url: '/profilelogin',
      views: {
        'tab-profile': {
          templateUrl: 'templates/user-sign-in.html',
          controller: 'SignInCtrl'
        }
      }
    })

	.state('tab.profileregister', {
      url: '/profileregister',
      views: {
        'tab-profile': {
          templateUrl: 'templates/user-register-wizard.html',
		  controller: 'RegisterCtrl'
        }
      }
    })

	.state('tab.profilelostpassword', {
      url: '/profilelostpassword',
      views: {
        'tab-profile': {
          templateUrl: 'templates/user-forgot-password.html',
		  controller: 'LostPasswordCtrl'
        }
      }
    })

  .state('tab.changepassword', {
    url: '/userchangepassword',
      views: {
        'tab-profile': {
          templateUrl: 'templates/user-change-password.html',
		  controller: 'ChangePasswordCtrl'
        }
      }
  })

 
	.state('resetpassword', {
	url: '/user-reset-password/:uid',
	templateUrl: 'templates/user-reset-password.html',
	controller: 'ResetPasswordCtrl'
	})

	.state('scan-modal', {
	url: '/scan/modal',
	templateUrl: 'templates/modal-scan.html',
	controller: 'RegisterCtrl'
	})

.state('test-dev', {
url: '/test-dev',
templateUrl: 'templates/test-dev.html',
controller: 'DevCtrl'
})
	
.state('test-cache', {
url: '/test-cache',
templateUrl: 'templates/test-backend-cache.html',
controller: 'TestBackendCacheCtrl'
})

.state('test-appconfig', {
url: '/test-appconfig',
templateUrl: 'templates/test-appconfig.html',
controller: 'TestAppConfigCtrl'
})
	
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
  //$urlRouterProvider.otherwise('/profile');
});

/*
app.value('dpdConfig',['categories']);
*/

app.value('dpdConfig', { 
    collections: ['test', 'applabels', 'appcontents', 'users', 'welcomecontents', 'trophies', 'trophiesmatched', 'newsecom', 'newscross', 'trophycontents', 'prereqcontents'], 
    //serverRoot: 'http://localhost:2403/', // optional, defaults to same server
    serverRoot: 'https://digitalwatchproject.cross-systems.ch/', // optional, defaults to same server
    socketOptions: { reconnectionDelayMax: 3000 }, // optional socket io additional configuration
    useSocketIo: false, // optional, defaults to false
    noCache: true // optional, defaults to false (false means that caching is enabled, true means it disabled)
});