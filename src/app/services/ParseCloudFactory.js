(function () {
    'use strict';
    angular.module('starter').factory('ParseCloud', ParseCloudFactory);

    function ParseCloudFactory($q) {
        return {
            run: run
        };

        function run(action, data) {
            var defer = $q.defer();
            Parse.Cloud.run(action, data, {
                success: defer.resolve,
                error  : defer.reject
            });
            return defer.promise;
        }
    }

})();
