'use strict';

/**
 * @ngdoc overview
 * @name comparateurRisquesApp
 * @description
 * # comparateurRisquesApp
 *
 * Main module of the application.
 */
angular
  .module('comparateurRisquesApp', [
    'ngAnimate',
    'ngAria',
    'ngMessages',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'angularMoment'
  ])
  .config(function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    }).when('/resultats', {
      templateUrl: 'views/resultats.html',
      controller: 'ResultatsCtrl',
      controllerAs: 'resultats'
    }).otherwise({
      redirectTo: '/'
    });
  }).directive('onFinishRender', function ($timeout) {
    return {
      restrict: 'A',
      link: function link(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit(attr.onFinishRender);
          });
        }
      }
    };
  });
