.controller('TrophiesCtrl', function($scope, $rootScope, $state, $ionicModal, $timeout, $http, Trophies, dpd) {

  // Call launchMonitoring from Services
  $scope.main =  function() {
    $scope.$apply();
    console.log('IN MAIN : > ' + localStorage.getItem("user_auth_id"));

    // Monitor all trohies
    Trophies.getTrophies($scope, dpd).then(function(promise_trophies) {
      $scope.trophies = promise_trophies;
      // Get Granted trophies 
      Trophies.getGrantedTrophies($scope, dpd).then(function(promise_grantedTrophies) {
          //TODO : Not always check ListGrantedTrophies
           console.log('rootScope.monitoringLaunched > ' + $rootScope.monitoringLaunched);
          if($rootScope.monitoringLaunched==false) {
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

// ------------
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
