(function () {
    'use strict';

    angular.module('ion-photo').directive('photoShare', photoShareDirective);

    function photoShareDirective($state, AppConfig, $rootScope, $ionicModal, Loading, PhotoService) {
        return {
            restrict: 'A',
            link    : photoShareLink,
            template: ''
        };

        function photoShareLink($scope, elem, attr) {
            var path = AppConfig.path;

            elem.bind('click', open);

            function open(options) {
                console.log('Open share');
                var option = {
                    crop              : options.imageCrop,
                    allowEdit         : options.imageEdit,
                    filter            : true,
                    //filter: options.imageFilter,
                    allowRotation     : options.imageRotation,
                    quality           : options.imageQuality,
                    correctOrientation: options.imageEdit,
                    targetWidth       : options.imageWidth,
                    targetHeight      : options.imageHeight,
                    saveToPhotoAlbum  : options.imageSaveAlbum,
                };
                console.log(option);

                PhotoService
                    .open(option)
                    .then(modalPost)
                    .catch(goHome);
            }


            function goHome() {
                console.warn('Deu erro');
                $state.go('photogram.home');
            }

            function modalPost(image) {
                $scope.closePost  = closeModalPost;
                $scope.submitPost = submitPost;
                $scope.form       = {
                    title   : '',
                    location: '',
                    photo   : image,
                    geo     : false
                };

                $ionicModal
                    .fromTemplateUrl(path + '/module/share/photogram.post.modal.html', {
                        scope          : $scope,
                        focusFirstInput: true
                    })
                    .then(function (modal) {
                        $scope.form.photo = image;
                        $scope.modalPost  = modal;
                        $scope.modalPost.show();
                    });

                function closeModalPost() {
                    $scope.modalPost.hide();
                    $scope.modalPost.remove();
                    Loading.end();
                }

                function submitPost(resp) {
                    var form = angular.copy(resp);
                    console.log(form);
                    Loading.start();
                    Photogram.post(form).then(function () {
                        closeModalPost();
                        $rootScope.$emit('filterModal:close');
                        $rootScope.$emit('PhotogramHome:reload');
                    });
                }
            }
        }

    }

})();
