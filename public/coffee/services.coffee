app.factory 'AuthService', ($http) ->
  register: (username, password) ->
    return $http.post('/user/register', {email:"#{username}@test.com", username: username, password: password})
  logIn: (username, password) ->
    return $http.post('/user/login/local', {username: username, password: password}).then (resp) ->
      $http.defaults.headers.common.Authorization = "Bearer #{resp.data.token}";
      return resp.data
  isLoggedIn: () ->
    return localStorage.getItem('token')
  getToken: () ->
    return localStorage.getItem('token')
app.factory 'Flash', ->
  message: ''

app.factory 'Thread', ($resource)->
  $resource '/mail/thread/:id'
