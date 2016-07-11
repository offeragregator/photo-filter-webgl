(function () {
    'use strict';
    angular.module('starter').controller('FilterCtrl', FilterController);

    function FilterController($scope, PhotoService, PhotoFilter) {
        var vm = this;

        vm.open = function () {
            PhotoService.open().then(function (image) {
                console.log(image);
            });
        }

        $scope.$on('$ionicView.enter', function () {
            PhotoFilter.init('image');
        });

        vm.filters      = PhotoFilter.filters.Adjust;
        vm.imageFilters = PhotoFilter.imageFilters;
        vm.reset        = PhotoFilter.reset;

        vm.applyFilter = function (filter) {
            PhotoFilter.apply(filter.filter);
        };

        vm.showFilter  = false;
        vm.showFilters = true;

        vm.selectFilter = function (filter) {
            vm.filter      = filter;
            vm.showFilters = false;
        };

        vm.cancelFilter = function (filter) {
            filter.slider.value = 0;
            filter.setSlider(filter.slider);
            vm.showFilters = true;
        };

        $scope.$watch('vm.filterSelected', function (item) {
            if (item) {
                var filter = _.find(vm.filters, {func: item});
                vm.filter  = filter;
                vm.sliders = filter.sliders;
                console.log(filter);
            }
        });

    }

})();