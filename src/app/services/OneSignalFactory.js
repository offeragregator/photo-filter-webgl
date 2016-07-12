(function () {
    'use strict';
    angular.module('starter').factory('OneSignal', OneSignalFactory);

    function OneSignalFactory($q) {

        return {
            init: init
        };

        function init(id, google) {
            var defer = $q.defer();

            if (window.cordova.OneSignal) {
                // Enable to debug issues.
                window.plugins.OneSignal.setLogLevel({
                    logLevel   : 4,
                    visualLevel: 4
                });

                // Update with your OneSignal AppId and googleProjectNumber before running.
                window.plugins.OneSignal.init(id, {googleProjectNumber: google}, function (jsonData) {
                     alert("Notification received:\n" + JSON.stringify(jsonData));

                });

                window.plugins.OneSignal.enableInAppAlertNotification(true);
            } else {
                defer.reject('OneSignal plugin istalled');
            }
            return defer.promise;
        }
    }

})();
