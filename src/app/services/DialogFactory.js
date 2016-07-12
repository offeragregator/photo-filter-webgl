(function () {
    'use strict';
    angular.module('starter').service('Dialog', DialogFactory);

    function DialogFactory($cordovaDialogs, $ionicPopup, $q) {

        return {
            alert  : alert,
            confirm: confirm
        };

        function alert(message, title) {
            var defer = $q.defer();
            if (window.cordova) {
                $cordovaDialogs.alert(message, title).then(defer.resolve);
            } else {
                $ionicPopup.alert({
                    title   : title,
                    template: message
                });
            }
            return defer.promise;
        }

        function confirm(message, title, buttonsText) {
            var defer = $q.defer();
            if (window.cordova) {
                $cordovaDialogs.confirm(message, title, buttonsText).then(function (result) {
                    if (result === 2) {
                        defer.resolve(true);
                    }
                    defer.reject(true);
                });

            } else {
                $ionicPopup.confirm({
                    title   : title,
                    template: message
                }).then(function (res) {
                    if (res) {
                        defer.resolve(true);
                    } else {
                        defer.reject(true);
                    }
                });
            }
            return defer.promise;
        }
    }

})();
