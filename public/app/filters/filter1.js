angular.module('startFilter', []).filter('startFilter.controllers', function(input, start) {
  start = +start; //parse to int
        return input.slice(start);
});