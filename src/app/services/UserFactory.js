(function () {
    'use strict';
    angular.module('starter').factory('User', UserFactory);

    function UserFactory($q, $cordovaDevice, ParseCloud) {

        var User = Parse.User.extend({}, {
            profile               : function (username) {
                return ParseCloud.run('profile', {username: username})
            },
            list                  : function (params) {
                return ParseCloud.run('listUsers', params)
            },
            getFollowers          : function (username) {
                return ParseCloud.run('getFollowers', {username: username})
            },
            getLikers             : function (galleryId) {
                return ParseCloud.run('getLikers', {galleryId: galleryId})
            },
            getFollowing          : function (username) {
                return ParseCloud.run('getFollowing', {username: username})
            },
            signIn                : function (obj) {
                var defer = $q.defer();

                Parse.User.logIn(obj.username, obj.password, {
                    success: function (currentUser) {

                        // device
                        var device;
                        if (window.cordova) {
                            device = {
                                device  : $cordovaDevice.getDevice(),
                                cordova : $cordovaDevice.getCordova(),
                                model   : $cordovaDevice.getModel(),
                                platform: $cordovaDevice.getPlatform(),
                                uuid    : $cordovaDevice.getUUID(),
                                version : $cordovaDevice.getVersion()
                            };
                        } else {
                            device = {
                                device  : {device: window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./)[0]},
                                cordova : '',
                                model   : window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./)[0],
                                platform: window.navigator.platform,
                                uuid    : '',
                                version : window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./)[1]
                            };
                        }

                        console.log(currentUser);
                        console.log(device);

                        User.update(device).then(function () {
                            defer.resolve(currentUser);
                        }).catch(defer.reject)

                        console.log('updateUser', device);
                        //user.save(defer.resolve, defer.reject);
                    },
                    error  : defer.reject
                });

                return defer.promise;
            },
            signUp                : function (data) {
                var defer = $q.defer();
                var user  = new Parse.User()
                    .set({'name': data.name})
                    .set({'username': data.username})
                    .set({'email': data.email})
                    .set({'password': data.password})
                    .set({'roleName': 'User'});

                var acl = new Parse.ACL();
                acl.setPublicReadAccess(false);
                acl.setPublicWriteAccess(false);
                user.setACL(acl);
                user.save(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });

                return defer.promise;
            },
            signInViaFacebook     : function (authData) {
                var defer      = $q.defer();
                var expiration = new Date();
                expiration.setSeconds(expiration.getSeconds() + authData.authResponse.expiresIn);
                expiration = expiration.toISOString();

                var facebookAuthData = {
                    'id'             : authData.authResponse.userID,
                    'access_token'   : authData.authResponse.accessToken,
                    'expiration_date': expiration
                };
                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            logOut                : function () {
                var defer = $q.defer();
                Parse.User.logOut().then(defer.resolve, defer.reject);
                return defer.promise;
            },
            findByEmail           : function (email) {
                return ParseCloud.run('findUserByEmail', {email: email});
            },
            updateWithFacebookData: function (data) {
                var defer = $q.defer();
                ParseCloud.run('saveFacebookPicture', {}).then(function () {
                    var user = Parse.User.current();

                    if (user.attributes.username === '') {
                        user.set({'username': data.email});
                    }

                    user.set({'email': data.email});
                    user.set({'name': data.name});
                    user.setACL(new Parse.ACL(user));
                    user.save(null, {
                        success: function () {
                            user.fetch().then(function (userFetched) {
                                defer.resolve(userFetched);
                            }, function (error) {
                                defer.reject(error);
                            });
                        }
                    });
                }).catch(defer.reject);
                return defer.promise;
            },
            getPublicData         : function (user) {
                console.log(user);
                var defer = $q.defer();
                new Parse.Query('UserData').equalTo('user', user).first().then(function (userData) {
                    if (userData) {
                        defer.resolve(userData);
                    } else {
                        defer.reject(Parse.Promise.error({
                            code   : 1,
                            message: 'User Data not found'
                        }));
                    }
                }, defer.reject);
                return defer.promise;
            },
            recoverPassword       : function (email) {
                var defer = $q.defer();
                Parse.User.requestPasswordReset(email, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            destroy               : function () {
                var defer = $q.defer();
                Parse.User.current().destroy().then(defer.resolve, defer.reject);
                return defer.promise;
            },
            setPhoto              : function (parseFile) {
                var defer = $q.defer();
                var user  = Parse.User.current();
                user.set({'photo': parseFile});
                user.save(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            follow                : function (userId) {
                return ParseCloud.run('followUser', {userId: userId});
            },
            all                   : function (params) {
                return ParseCloud.run('getUsers', params);
            },
            validateUsername      : function (input) {
                return ParseCloud.run('validateUsername', {username: input});
            },
            validateEmail         : function (input) {
                return ParseCloud.run('validateEmail', {email: input});
            },
            findUsername          : function (username) {
                var defer = $q.defer();
                new Parse.Query(this).equalTo('username', username).first({
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            update                : function (params) {
                var defer = $q.defer();
                var user  = Parse.User.current();
                angular.forEach(params, function (value, key) {
                    user.set(key, value);
                });
                user.save({
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            delete                : function (data) {
                return ParseCloud.run('destroyUser', data);
            },
            fetch                 : function () {
                var defer = $q.defer();
                if (Parse.User.current()) {
                    Parse.User.current().fetch().then(defer.resolve, defer.reject);
                } else {
                    defer.reject();
                }
                return defer.promise;
            }

        });

        Object.defineProperty(User.prototype, 'name', {
            get: function () {
                return this.get('name');
            },
            set: function (val) {
                this.set('name', val);
            }
        });

        Object.defineProperty(User.prototype, 'username', {
            get: function () {
                return this.get('username');
            },
            set: function (val) {
                this.set('username', val);
            }
        });

        Object.defineProperty(User.prototype, 'status', {
            get: function () {
                return this.get('status');
            },
            set: function (val) {
                this.set('status', val);
            }
        });

        Object.defineProperty(User.prototype, 'gender', {
            get: function () {
                return this.get('gender');
            },
            set: function (val) {
                this.set('gender', val);
            }
        });

        Object.defineProperty(User.prototype, 'email', {
            get: function () {
                return this.get('email');
            },
            set: function (val) {
                this.set('email', val);
            }
        });

        Object.defineProperty(User.prototype, 'photo', {
            get: function () {
                return this.get('photo');
            },
            set: function (val) {
                this.set('photo', val);
            }
        });

        Object.defineProperty(User.prototype, 'photoThumb', {
            get: function () {
                return this.get('photoThumb');
            },
            set: function (val) {
                this.set('photoThumb', val);
            }
        });

        Object.defineProperty(User.prototype, 'roleName', {
            get: function () {
                return this.get('roleName');
            },
            set: function (val) {
                this.set('roleName', val);
            }
        });

        return User;

    }

})();
