var app = angular.module('demiApp', ['ngRoute']);

app.config([
  '$routeProvider',
  function ($routeProvider) {
  $routeProvider.when('/', {
   templateUrl: 'views/index.html',
   controller: 'indexCtrl'
  }).when('/middlewares', {
   templateUrl: 'views/middlewares.html',
   controller: 'middlewareCtrl'
  }).otherwise({
   redirectTo: '/'
  });
  }
]);

// Modal

$(document).ready(function () {

 /* This is basic - uses default settings */

 $('a.fancybox').fancybox({
   type: "iframe",
   width: 626,
   height: 420
 });

});
