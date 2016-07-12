(function () {
    'use strict';

    angular.module('starter').controller('MainCtrl', MainTabController);

    function MainTabController($scope, PhotoService, User, $q, Gallery, PhotoFilter, ParseFile, $ionicModal, Loading) {
        var vm = this;
        var tempImage;

        vm.postPhoto = function () {

            PhotoService
                .open()
                //.then(modalPost)
                .then(function (form) {
                    console.log('Cadastra na Galeria', form);
                    vm.photo = form;

                    //ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                    //    form.image = imageUploaded;
                    //    Gallery.create(form).then(function (item) {
                    //        $scope.$emit('photoInclude', item);
                    //        Loading.end();
                    //    });
                    //});
                });

            return false;


            function modalPost(image) {
                var defer    = $q.defer();
                $scope.image = image;
                $scope.form  = {
                    title: ''
                };

                $scope.editFilter = function () {
                    PhotoFilter.load(tempImage).then(function (image) {
                        $scope.image = image;
                    });
                };

                //Mentios
                // shows the use of dynamic values in mentio-id and mentio-for to link elements
                $scope.searchPeople = function (term) {
                    var peopleList = [];
                    return User.getFollowers().then(function (response) {
                        _.each(response, function (item) {
                            item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                            item.bio      = item.status;
                            if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                                peopleList.push(item);
                            }
                        });
                        $scope.people = peopleList;
                        //console.log(peopleList);
                        return $q.when(peopleList);
                    });
                };

                $scope.getPeopleTextRaw = function (item) {
                    return '@' + item.username;
                };

                $ionicModal.fromTemplateUrl('app/main/share/share-modal.html', {
                    scope          : $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modalFilter = modal;
                    $scope.modalFilter.show();
                });


                $scope.form.address = {};
                $scope.closeAddress = function () {
                    $scope.form.address = {};
                };

                $scope.close = function () {
                    $scope.modalFilter.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.submit = function () {
                    var form   = angular.copy($scope.form);
                    form.image = $scope.image;
                    tempImage  = '';
                    $scope.close();
                    defer.resolve(form);
                };

                return defer.promise;
            }
        };

    }
})();
