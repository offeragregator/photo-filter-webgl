(function () {
    'use strict';
    angular.module('ion-photo').factory('PhotoFilter', PhotoFilterFactory);

    function PhotoFilterFactory($rootScope, $q, $ionicModal) {

        return {
            load: modalFilter
        };

        function modalFilter(image) {
            var defer    = $q.defer();
            var template = '<ion-modal-view class="modal-capture"><ion-header-bar class="bar-light"><button class="button button-clear button-icon ion-ios-close-empty" ng-click="close()"></button><div class="title text-left">{{ \'ION-PHOTO.FILTERS\' | translate }}</div><button class="button button-clear" ng-click="submitCapture()">{{ \'ION-PHOTO.NEXT\' | translate }}</button></ion-header-bar><ion-content scroll="false"><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';
            var scope    = $rootScope.$new(true);

            scope.form = {
                photo: image
            };

            scope.modal = $ionicModal.fromTemplate(template, {
                scope: scope
            });

            scope.modal.show();


            scope.submitCapture = function () {
                var canvas  = window.document.getElementById('image');
                var dataUrl = canvas.toDataURL();
                scope.close();
                defer.resolve(dataUrl);
            };

            scope.close = function () {
                scope.modal.hide();
            };

            // Cleanup the modal when we're done with it!
            scope.$on('$destroy', function () {
                scope.modal.remove();
            });


            return defer.promise;

        }

    }
})();
