(function () {
    'use strict';
    angular.module('starter').factory('Install', InstallFactory);

    function InstallFactory(ParseCloud) {
        return {
            start : start,
            status: status,
        };

        function start(data) {
            return ParseCloud.run('install', data);
        }

        function status(data) {
            return ParseCloud.run('status', data);
        }
    }

})();
