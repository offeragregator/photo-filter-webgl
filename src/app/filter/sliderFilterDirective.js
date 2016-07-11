(function () {
    'use strict';

    angular.module('starter').directive('sliderFilter', sliderFilterDirective);

    function sliderFilterDirective() {
        return {
            restrict   : 'E',
            link       : sliderFilterLink,
            scope      : {
                filter: '='
            },
            templateUrl: 'app/filter/slider-filter.html'
        };

        function sliderFilterLink(scope, elem, attr) {

            console.log(scope.filter);

            scope.$watch('filter.slider.value', function (value) {
                if (value) {
                    scope.filter.slider.value = parseInt(value);
                    scope.filter.setSlider(scope.filter.slider);
                }
            });
        }
    }

})();