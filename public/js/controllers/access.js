angular.module('todoAccess', ['ui.router'])
  .config(['$stateProvider', function($stateProvider) {
    // Wait until we know if the user is logged in before showing the homepage
    //$stateProvider
    //.state('main', {
      //url: '/todo.html',
      //sp: {
        //waitForUser: true,
        //authenticate: true,
        //authorize: {
          //group: 'DriveBar'
        //}
      //}
    //});

    //Require a user to be authenticated in order to see this state
    $stateProvider
    .state('drivebar', {
      url: '/todo.html',
      controller: 'DriveCtrl',
      //controller: 'SecretsCtrl',
      sp: {
        waitForUser: true,
        authenticate: true,
        authorize: {
          group: 'DriveBar'
        }
      }
    });

    //Require a user to be in admins group in order ot see this state
    $stateProvider
    .state('admin', {
      url: '/admin',
      controller: 'AdminCtrl',
      sp: {
        authorize: {
          group: 'admins'
        }
      }
    });
  }]);
