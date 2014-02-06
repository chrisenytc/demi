app.controller('indexCtrl', function ($scope) {
 // ...
});

app.controller('middlewareCtrl', function ($scope, $http) {

 function format(name) {
  if (angular.isString(name)) {
   return name.replace('http://github.com/', '').replace('https://github.com/', '').replace('git://github.com/', '').replace('ssh://git@github.com:', '').replace('git@github.com:', '').replace('.git', '').trim();
  } else {
   return false;
  }
 }

 $http({
  method: 'GET',
  url: 'http://npmsearch.com/query?q=keywords:demiddleware&fields=name,description,version,repository,url,keywords&size=10000&sort=rating:desc'
 }).
 success(function (data, status, headers, config) {
  $scope.status = true;
  $scope.showMessage = false;
  $scope.middlewares = data;
 }).
 error(function (data, status, headers, config) {
  $scope.showMessage = true;
  $scope.status = true;
 });

 $scope.isEmpty = function (obj) {
  return angular.equals([], obj);
 };

 $scope.format = function (name) {
  var result = format(name);
  if (result) {
   return result;
  } else {
   return "not found";
  }
 };

 $scope.formatUrl = function (name) {
  var result = format(name);
  if (result) {
   return "https://github.com/" + result;
  }
 };

});
