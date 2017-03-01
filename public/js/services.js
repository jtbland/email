(function() {
  app.factory('AuthService', function($http) {
    return {
      register: function(username, password) {
        return $http.post('/user/register', {
          email: username + "@test.com",
          username: username,
          password: password
        });
      },
      logIn: function(username, password) {
        return $http.post('/user/login/local', {
          username: username,
          password: password
        }).then(function(resp) {
          $http.defaults.headers.common.Authorization = "Bearer " + resp.data.token;
          return resp.data;
        });
      },
      isLoggedIn: function() {
        return localStorage.getItem('token');
      },
      getToken: function() {
        return localStorage.getItem('token');
      }
    };
  });

  app.factory('Flash', function() {
    return {
      message: ''
    };
  });

  app.factory('Thread', function($resource) {
    return $resource('/mail/thread/:id');
  });

}).call(this);
