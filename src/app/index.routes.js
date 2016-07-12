(function () {
    'use strict';
    angular.module('starter').config(routes);

    function routes($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('main', {
                url         : '/',
                templateUrl : 'app/filter/main.html',
                controller  : 'MainCtrl',
                controllerAs: 'vm'
            })


        ;

        // Translation
        $urlRouterProvider.otherwise('/');

    }


})();