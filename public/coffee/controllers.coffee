app.controller 'ThreadController', ($scope, $http, $routeParams)->
  $scope.thread = {}
  $http.get("/mail/thread/#{ $routeParams.id }").success (data)->
    $scope.thread = data


app.controller 'ThreadsController', ($rootScope, $scope, $location, Thread, $http)->
  $scope.threads = []

  $scope.getThreads = ()->
    Thread.query (threads)->
        $scope.threads = threads
        $scope.page =
          from: 1
          to: threads.length
          count: threads.length

  $scope.deleteSelected = ()->
    for thread in $scope.threads
      if thread.selected
        $http.delete("/mail/thread/#{ thread.id }").then ()->
          $scope.threads = $scope.threads.filter (_thread)->
            _thread != thread

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
  #fetch the threads
  $scope.getThreads()

app.controller 'ThreadController', ($scope, $routeParams, Thread, $http)->
  $scope.thread = {}
  $scope.markThreadRead = ()->
      for message in $scope.thread.messages
        message.unread = false
        $http.put("/mail/message/#{ message.id }", {unread: false})
      $scope.thread.unread = false
  $scope.getThread = ()->
    Thread.get { id: $routeParams.id }, (thread)->
      $scope.thread = thread
      $scope.lastMessage = thread.messages[thread.messages.length-1]
      $scope.lastMessage.active = true
      $scope.markThreadRead()
  $scope.sendReply = ()->
    message = {
      subject: "RE:#{$scope.lastMessage.subject}",
      body: $scope.reply,
      to: {
        email: $scope.lastMessage.author.email
      },
      from: {
        email: $scope.lastMessage.recipient.email
      },
      threadId: $scope.thread.id
    }
    $http.post('/mail/send',message).then (result) ->
      $scope.replying = false
      $scope.reply = ''
      $scope.getThread();
  $scope.toggleActive = (message)->
    unless message == $scope.lastMessage
      message.active = !message.active

  $scope.getThread()
app.controller 'ComposeController', ($scope, $routeParams, $http)->
  $scope.message = {
    to: { email: ''},
    bcc: { email: ''},
    cc: { email: ''},
    from: { email: 'jeff@test.com'}, # TODO this is hardcoded for now
    body: '',
    subject: ''
  }

  $scope.clearMessage = ()->
    $scope.message.to = { email: ''}
    $scope.message.bcc = { email: ''}
    $scope.message.cc = { email: ''}
    $scope.message.body = ''
    $scope.message.subject = ''

  $scope.close = ()->
    $scope.clearMessage()
    $scope.$parent.visible = false
    $scope.$parent.getThreads();

  $scope.send = ()->
    $http.post('/mail/send', $scope.message).then ((result) ->
      $scope.close()
      return
    ), (err) ->
      console.log err
      return

app.controller 'FlashController',  ($scope, Flash)->
  $scope.flash = Flash
