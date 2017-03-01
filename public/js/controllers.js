(function() {
  app.controller('RegisterController', function($scope, AuthService, $state, $rootScope) {
    return $scope.register = function($event) {
      $event.preventDefault();
      return AuthService.register($scope.username, $scope.password).then(function() {
        return AuthService.logIn($scope.username, $scope.password).then(function(data) {
          $rootScope.username = $scope.username;
          $rootScope.email = $scope.username + "@test.com";
          localStorage.setItem('token', data.token);
          return $state.go('mailbox.inbox');
        });
      });
    };
  });

  app.controller('LoginController', function($scope, AuthService, $state, $rootScope) {
    return $scope.login = function($event) {
      $event.preventDefault();
      return AuthService.logIn($scope.username, $scope.password).then(function(data) {
        $rootScope.username = $scope.username;
        $rootScope.email = $scope.username + "@test.com";
        localStorage.setItem('token', data.token);
        return $state.go('mailbox.inbox');
      });
    };
  });

  app.controller('ThreadController', function($scope, $http, $stateParams) {
    $scope.thread = {};
    return $http.get("/mail/thread/" + $stateParams.id).success(function(data) {
      return $scope.thread = data;
    });
  });

  app.controller('ThreadsController', function($rootScope, $scope, $location, Thread, $http, $state) {
    $scope.threads = [];
    $scope.$state = $state;
    $scope.getThreads = function() {
      return Thread.query(function(threads) {
        $scope.threads = threads;
        return $scope.page = {
          from: 1,
          to: threads.length,
          count: threads.length
        };
      });
    };
    $scope.markThreadSpam = function() {
      var i, j, len, len1, message, ref, ref1, results, thread;
      ref = $scope.threads;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        if (thread.selected) {
          if (thread.isSpam) {
            results.push($scope.markThreadNotSpam(thread));
          } else {
            ref1 = thread.messages;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              message = ref1[j];
              message.isSpam = true;
              $http.put("/mail/message/" + message.id, {
                isSpam: true
              });
            }
            results.push(thread.isSpam = true);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    $scope.markThreadNotSpam = function(thread) {
      var i, len, message, ref;
      if (thread.selected) {
        ref = thread.messages;
        for (i = 0, len = ref.length; i < len; i++) {
          message = ref[i];
          message.isSpam = false;
          $http.put("/mail/message/" + message.id, {
            isSpam: false
          });
        }
        return thread.isSpam = false;
      }
    };
    $scope.deleteSelected = function() {
      var i, len, ref, results, thread;
      ref = $scope.threads;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        if (thread.selected) {
          results.push($http["delete"]("/mail/thread/" + thread.id).then(function() {
            return $scope.threads = $scope.threads.filter(function(_thread) {
              return _thread !== thread;
            });
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    $scope.isRouteActive = function(route) {
      return route === $location.path();
    };
    $scope.selectAll = function() {
      var i, len, ref, results, thread;
      ref = $scope.threads;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        results.push(thread.selected = true);
      }
      return results;
    };
    $scope.selectNone = function() {
      var i, len, ref, results, thread;
      ref = $scope.threads;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        results.push(thread.selected = false);
      }
      return results;
    };
    $scope.selectUnread = function() {
      var i, len, ref, results, thread;
      ref = $scope.threads;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        results.push(thread.selected = thread.unread);
      }
      return results;
    };
    $scope.selectRead = function() {
      var i, len, ref, results, thread;
      ref = $scope.threads;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        results.push(thread.selected = !thread.unread);
      }
      return results;
    };
    $scope.someSelected = function() {
      var i, len, ref, selected, thread;
      selected = false;
      ref = $scope.threads;
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        if (thread.selected) {
          selected = true;
        }
      }
      return selected;
    };
    $scope.noneSelected = function() {
      return !$scope.someSelected();
    };
    $scope.allSelected = function() {
      var i, len, ref, selected, thread;
      if ($scope.threads.length === 0) {
        return false;
      }
      selected = true;
      ref = $scope.threads;
      for (i = 0, len = ref.length; i < len; i++) {
        thread = ref[i];
        if (!thread.selected) {
          selected = false;
        }
      }
      return selected;
    };
    $scope.selectToggle = function() {
      if ($scope.someSelected()) {
        return $scope.selectNone();
      } else {
        return $scope.selectAll();
      }
    };
    $scope.composeMessage = function() {
      return $scope.visible = true;
    };
    return $scope.getThreads();
  });

  app.controller('ThreadController', function($scope, $stateParams, Thread, $http) {
    $scope.thread = {};
    $scope.markThreadRead = function() {
      var i, len, message, ref;
      ref = $scope.thread.messages;
      for (i = 0, len = ref.length; i < len; i++) {
        message = ref[i];
        message.unread = false;
        $http.put("/mail/message/" + message.id, {
          unread: false
        });
      }
      return $scope.thread.unread = false;
    };
    $scope.getThread = function() {
      return Thread.get({
        id: $stateParams.id
      }, function(thread) {
        $scope.thread = thread;
        $scope.lastMessage = thread.messages[thread.messages.length - 1];
        $scope.lastMessage.active = true;
        return $scope.markThreadRead();
      });
    };
    $scope.sendReply = function() {
      var message;
      message = {
        subject: "RE:" + $scope.lastMessage.subject,
        body: $scope.reply,
        to: {
          email: $scope.lastMessage.author.email
        },
        from: {
          email: $scope.lastMessage.recipient.email
        },
        threadId: $scope.thread.id
      };
      return $http.post('/mail/send', message).then(function(result) {
        $scope.replying = false;
        $scope.reply = '';
        return $scope.getThread();
      });
    };
    $scope.toggleActive = function(message) {
      if (message !== $scope.lastMessage) {
        return message.active = !message.active;
      }
    };
    return $scope.getThread();
  });

  app.controller('ComposeController', function($scope, $stateParams, $http) {
    $scope.message = {
      to: {
        email: ''
      },
      bcc: {
        email: ''
      },
      cc: {
        email: ''
      },
      from: {
        email: 'jeff@test.com'
      },
      body: '',
      subject: ''
    };
    $scope.clearMessage = function() {
      $scope.message.to = {
        email: ''
      };
      $scope.message.bcc = {
        email: ''
      };
      $scope.message.cc = {
        email: ''
      };
      $scope.message.body = '';
      return $scope.message.subject = '';
    };
    $scope.close = function() {
      $scope.clearMessage();
      $scope.$parent.visible = false;
      return $scope.$parent.getThreads();
    };
    return $scope.send = function() {
      return $http.post('/mail/send', $scope.message).then((function(result) {
        $scope.close();
      }), function(err) {
        console.log(err);
      });
    };
  });

  app.controller('FlashController', function($scope, Flash) {
    return $scope.flash = Flash;
  });

}).call(this);
