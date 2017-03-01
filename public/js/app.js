(function() {
  window.app = angular.module('nGmail', ['ui.router', 'ngResource', 'ngSanitize']);

  app.run(function($rootScope, $location, AuthService, $http) {
    if (AuthService.isLoggedIn()) {
      $http.defaults.headers.common.Authorization = "Bearer " + (AuthService.getToken());
    }
    return $rootScope.isRouteActive = function(route) {
      return route === $location.path();
    };
  });

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $stateProvider.state({
      name: 'mailbox',
      templateUrl: '/partials/mailbox.html',
      url: '/',
      onEnter: function($state, AuthService) {
        if (!AuthService.isLoggedIn()) {
          return $state.go('login');
        }
      }
    });
    $stateProvider.state({
      name: 'mailbox.inbox',
      templateUrl: '/partials/inbox.html',
      url: 'inbox'
    });
    $stateProvider.state({
      name: 'mailbox.spam',
      templateUrl: '/partials/spam.html',
      url: 'spam'
    });
    $stateProvider.state({
      name: 'mailbox.message',
      templateUrl: '/partials/thread.html',
      url: 'thread/:id'
    });
    $stateProvider.state({
      name: 'register',
      templateUrl: '/partials/register.html',
      url: '/register'
    });
    $stateProvider.state({
      name: 'login',
      templateUrl: '/partials/login.html',
      url: '/login'
    });
    $urlRouterProvider.when('', '/inbox');
    $urlRouterProvider.when('/', '/inbox');
    return $urlRouterProvider.otherwise('/inbox');
  });

}).call(this);
