window.app = angular.module('nGmail', ['ngRoute', 'ngResource','ngSanitize'])

app.run ($rootScope)->
  $rootScope.current_user = window.currentUser
app.run ($rootScope, $location)->
  $rootScope.isRouteActive = (route)->
    route == $location.path()

app.config ($routeProvider, $locationProvider)->
  $locationProvider.html5Mode({enabled:true, requireBase: false})
  $routeProvider
    .when '/inbox',
      templateUrl: '/partials/threads.html'
    .when '/threads/:id',
      templateUrl: '/partials/thread.html'
    .otherwise
      redirectTo: '/inbox'
