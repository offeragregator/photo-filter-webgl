(function () {
    'use strict';
    angular.module('starter').factory('Share', PhotogramShareFactory);

    function PhotogramShareFactory(AppConfig, $q, $translate, $window) {

        var options = {
            title  : $translate.instant('Join me from ') + AppConfig.app.name + '!',
            subject: $translate.instant("I'm at ") + AppConfig.app.name + '!. ' + (
                'Install the application and follow me!') + ' ' + AppConfig.app.url,
            image  : AppConfig.app.image,
            link   : AppConfig.app.url
        };

        return {
            open: open
        };

        function open(image, title) {
            var defer = $q.defer();

            if (image) {
                options.image = image;
            }

            if (title) {
                options.title = title;
            }

            $window.plugins.socialsharing.shareWithOptions(options, defer.success, defer.reject);

            return defer.promise;
        }

    }
})();
