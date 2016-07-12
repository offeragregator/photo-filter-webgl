(function () {
    'use strict';

    angular.module('starter').service('Facebook', FacebookFactory);

    function FacebookFactory($q, $facebook, $cordovaFacebook) {

        var facebook = window.cordova ? $cordovaFacebook : $facebook;
        var me;

        return {
            getCurrentUser: getCurrentUser,
            logIn         : logIn,
            logOut        : logOut,
            me            : getMe,
            invite        : invite,
            friends       : friends,
            api           : api,
            link          : link
        };

        function getCurrentUser() {
            return facebook.getLoginStatus();
        }

        function logIn() {
            console.log('facebook login', facebook);
            return facebook.login(['public_profile', 'email']);
        }

        function logOut() {
            var defer = $q.defer();
            $cordovaFacebook.logout().then(defer.resolve, defer.reject);
            return defer.promise;
        }

        function getMe() {

            var defer = $q.defer();

            if (me) {
                defer.resolve(me);
            }

            if (window.cordova) {

                $cordovaFacebook.api('me?fields=name,first_name,last_name,gender,email', ['public_profile'])
                                .then(defer.resolve, defer.reject);

            } else {
                facebook.api('/me', {fields: 'name, first_name, last_name, gender, email'})
                        .then(function (response) {
                            if (!response || response.error) {
                                defer.reject(response.error);
                            } else {
                                defer.resolve(response);
                            }
                        });
            }

            return defer.promise;
        }

        function invite() {
            var defer = $q.defer();
            if (window.cordova) {
                facebook.showDialog({
                    method : 'apprequests',
                    message: 'Venha para o nosso clube!'
                }).then(defer.resolve, defer.reject);
            } else {
                facebook.ui({
                    method : 'apprequests',
                    message: 'Venha para o nosso clube!'
                }).then(defer.resolve, defer.reject);
            }
            return defer.promise;
        }


        function friends() {
            var defer = $q.defer();
            facebook.api('me/friends').then(defer.resolve, defer.reject);
            return defer.promise;
        }

        function api(api) {
            var defer = $q.defer();
            facebook.api(api).then(defer.resolve, defer.reject);
            return defer.promise;
        }

        function link(user) {
            var defer = $q.defer();
            if (user) {
                facebook.login(['email']).then(function (response) {
                    console.log('facebook login', response);
                    //Pega o Status do Login
                    var data = new Date(new Date().getTime() + response['authResponse']['expiresIn'] * 1000);

                    console.log(user, response, data);

                    Parse.FacebookUtils.link(user, {
                        id             : response['authResponse']['userID'],
                        access_token   : response['authResponse']['accessToken'],
                        expiration_date: data
                    }, {
                        success: function (user) {
                            // Função caso tenha logado tanto no face quanto no Parse
                            console.log('User', user);
                            user.set('facebook', response['authResponse']['userID']);
                            user.set('facebookimg', 'https://graph.facebook.com/' + response['authResponse']['userID'] + '/picture?width=250&height=250');
                            user.set('facebook_complete', Boolean(true));
                            user.save().then(defer.resolve);
                        }
                    });
                }, defer.resolve);
            } else {
                defer.reject('not logged');
            }

            return defer.promise;
        }

    }

})();
