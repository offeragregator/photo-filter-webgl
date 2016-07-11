(function () {
    'use strict';
    angular.module('starter').config(routes);

    function routes($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('main', {
                url         : '/',
                templateUrl : 'app/filter/filter.html',
                controller  : 'FilterCtrl',
                controllerAs: 'vm'
            })

            .state('photo', {
                url         : '/photo',
                abstract    : true,
                templateUrl : 'app/filter/filter.html',
                controller  : 'FilterCtrl',
                controllerAs: 'vm'
            })


        ;

        // Translation
        $urlRouterProvider.otherwise('/');

    }


})();