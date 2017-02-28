(function() {
  app.directive('stopEvent', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        return element.bind('click', function(e) {
          e.preventDefault();
          return e.stopPropagation();
        });
      }
    };
  });

  app.directive("dropDown", function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        return element.bind('click', function(event) {
          event.preventDefault();
          return angular.element(this).toggleClass('active');
        });
      }
    };
  });

  app.directive('focusWhen', function($timeout) {
    return {
      link: function(scope, element, attrs) {
        return scope.$watch(attrs.focusWhen, function(value) {
          if (!value) {
            return;
          }
          return $timeout(function() {
            return element[0].focus();
          });
        });
      }
    };
  });

}).call(this);
