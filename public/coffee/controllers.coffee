app.controller 'ThreadController', ($scope, $http, $routeParams)->
  $scope.thread = {}
  $http.get("/api/threads/#{ $routeParams.id }.json").success (data)->
    $scope.thread = data


app.controller 'ThreadsController', ($rootScope, $scope, $location, Thread)->
  $scope.threads = []
  
  Thread.query (threads)->
      $scope.threads = threads
      $scope.page =
        from: 1
        to: threads.length
        count: threads.length

  $scope.isRouteActive = (route)->
    route == $location.path()

  $scope.selectAll = ->
    for thread in $scope.threads
      thread.selected = true

  $scope.selectNone = ->
    for thread in $scope.threads
      thread.selected = false

  $scope.selectUnread = ->
    for thread in $scope.threads
      thread.selected = thread.unread

  $scope.selectRead = ->
    for thread in $scope.threads
      thread.selected = !thread.unread

  $scope.someSelected = ->
    selected = false
    for thread in $scope.threads
      selected = true if thread.selected

    selected

  $scope.noneSelected = ->
    !$scope.someSelected()

  $scope.allSelected = ->
    return false if $scope.threads.length == 0
    selected = true
    for thread in $scope.threads
      selected = false if !thread.selected

    selected

  $scope.selectToggle = ->
    if $scope.someSelected()
      $scope.selectNone()
    else
      $scope.selectAll()

  $scope.composeMessage = ->
    $scope.visible = true

app.controller 'ThreadController', ($scope, $routeParams, $http)->

  $http.get("/api/threads/#{ $routeParams.id }.json").success (data)->
    $scope.thread = data
    $scope.lastMessage = thread.messages[thread.messages.length-1]
    $scope.lastMessage.active = true

  $scope.toggleActive = (message)->
    unless message == $scope.lastMessage
      message.active = !message.active

app.controller 'ThreadController', ($scope, $routeParams, Thread)->
  $scope.thread = {}
  Thread.get { id: $routeParams.id }, (thread)->
    $scope.thread = thread
    $scope.lastMessage = thread.messages[thread.messages.length-1]
    $scope.lastMessage.active = true

  $scope.toggleActive = (message)->
    unless message == $scope.lastMessage
      message.active = !message.active

app.controller 'ComposeController', ($scope, $routeParams, $http)->
  $scope.message = {
    to: '',
    bcc: '',
    cc: '',
    body: '',
    subject: ''
  }

  $scope.clearMessage = ()->
    $scope.message.to = ''
    $scope.message.bcc = ''
    $scope.message.cc = ''
    $scope.message.body = ''
    $scope.message.subject = ''

  $scope.close = ()->
    $scope.clearMessage()
    $scope.$parent.visible = false

  $scope.send = ()->
    $http.post('/api/send', $scope.message).then ((result) ->
      $scope.close()
      return
    ), (err) ->
      console.log err
      return

app.controller 'FlashController',  ($scope, Flash)->
  $scope.flash = Flash
