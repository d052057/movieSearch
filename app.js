// MODULE
var moviePosterApp = angular.module('moviePosterApp', ['ngRoute', 'ngResource']);
// ROUTES
moviePosterApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/search/:movie', {
            templateUrl: 'pages/moviePanel.html',
            controller: 'movieController',
            resolve: {
                ResolveMovieResult: function (movieService, $route) {
                    var searchMovie = $route.current.params.movie;
                    return movieService.getMovie(searchMovie);
                }
            }
        })
        .otherwise({ redirectTo: '/index.html' });

    $locationProvider.hashPrefix('');
    //$locationProvider.html5Mode(true);
});
// SERVICES
moviePosterApp.service('sharedProperties', function () {
    var movieProperty = '';
    return {
        getProperty: function () {
            return movieProperty;
        },
        setProperty: function (value) {
            movieProperty = value;
        }
    };
});

moviePosterApp.service('movieService',['$http', function ($http) {
    return {
        getMovie: function (searchMovie) {
            var apiKey = 'f2c99cf74ee4c4214605f5ac1bc00fc6';

            var _urlSearch = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&language=en-US&page=1&include_adult=false&query=' 
            console.log(_urlSearch + searchMovie);
            // old angular version use $resource - newer use $http.
            return $http.get(_urlSearch + searchMovie)
                .then(function (response) {
                    // First function handles success
                    return response.data;
                })
                .catch(function (response) {
                    // Second function handles error
                    //return "Something went wrong";
                    console.log("this is wrong");
                    window.alert('something wroing');
                });
        }
    };
}]);

// CONTROLLERS from HOME.HTML
moviePosterApp.controller('homeController', function ($scope, sharedProperties) {
    $scope.movie = sharedProperties.getProperty();
    // onProperty function changed (movie)
    $scope.$watch('movie', function () {
        sharedProperties.setProperty($scope.movie);
    });
});
// CONTROLLERS from MoviePanel.HTML
moviePosterApp.controller('movieController', function ($scope, $route, ResolveMovieResult) {
    $scope.movie = $route.current.params.movie;
    $scope.imagePath = 'http://image.tmdb.org/t/p/w500';
    //$scope.movieResult = movieService.getMovie();
    $scope.movieResult = ResolveMovieResult;
});
