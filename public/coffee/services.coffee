app.factory 'Flash', ->
  message: ''

app.factory 'Thread', ($resource)->
  $resource '/mail/thread/:id'
