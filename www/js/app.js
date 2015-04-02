// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

// TODO dpd initialisation
//.value('dpdConfig',['categories']);

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {

  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();

    }
	
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

	// Welcome slider
	.state('welcome', {
		url: '/welcome',
		templateUrl: 'templates/welcome-slider.html',
		controller: 'WelcomeCtrl'
	  })	
  
    // App Sign-in, register, user management 

	.state('signin', {
		url: '/sign-in',
		templateUrl: 'templates/user-sign-in.html',
		controller: 'SignInCtrl'
	})
	.state('forgotpassword', {
		url: '/forgot-password',
		templateUrl: 'templates/user-forgot-password.html'
	})

// App signed-in states

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})
	
	// tab states

	.state('tab.cross-ecom', {
    url: '/cross-ecom',
    views: {
      'tab-cross-ecom': {
        templateUrl: 'templates/tab-cross-ecom.html',
        controller: 'CrossEcomCtrl'
      }
    }
  })
	
	.state('tab.cross-news', {
    url: '/cross-news',
    views: {
      'tab-cross-news': {
        templateUrl: 'templates/tab-cross-news.html',
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
          templateUrl: 'templates/tab-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

	
	
	.state('register', {
    url: '/register',
    templateUrl: 'templates/modal-register.html',
    controller: 'RegisterCtrl'
  })
	
/*
	.state('tab.catalog', {
      url: '/catalog',
      views: {
        'tab-catalog': {
          templateUrl: 'templates/tab-catalog.html',
          controller: 'CatalogCtrl'
        }
      }
    })
	
  .state('tab.scan', {
      url: '/scan',
      views: {
        'tab-scan': {
          templateUrl: 'templates/tab-scan.html',
          controller: 'ScanCtrl'
        }
      }
    })

	//dealer locator feature
	.state('tab.dealers', {
	  url: '/dealers',
	  views: {
		'tab-dealers': {
		  templateUrl: 'templates/tab-dealers.html',
		  controller: 'DealersCtrl'
		}
	  }
	})
	*/
	
	.state('scan-modal', {
    url: '/scan/modal',
    templateUrl: 'templates/modal-scan.html',
    controller: 'RegisterCtrl'
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
  //$urlRouterProvider.otherwise('/');

});
/*
app.value('dpdConfig',['categories']);
*/

app.value('dpdConfig', { 
    collections: ['users', 'welcomecontents'], 
    serverRoot: 'http://localhost:2403/', // optional, defaults to same server
    socketOptions: { reconnectionDelayMax: 3000 }, // optional socket io additional configuration
    useSocketIo: false, // optional, defaults to false
    noCache: true // optional, defaults to false (false means that caching is enabled, true means it disabled)
});

