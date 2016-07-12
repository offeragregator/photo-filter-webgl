(function () {
    'use strict';
    angular.module('starter').factory('Gallery', GalleryFactory);

    function GalleryFactory($q, ParseCloud, moment) {

        var ParseObject = Parse.Object.extend('Gallery', {
                getStatus: function () {
                    if (this.isApproved) {
                        return 'Approved';
                    } else if (this.isApproved === false) {
                        return 'Rejected';
                    } else {
                        return 'Pending';
                    }
                }
            },
            {
                create     : function (item) {
                    var defer    = $q.defer();
                    var objPlace = new ParseObject();

                    if (item.address.geo) {
                        item.location = new Parse.GeoPoint(item.address.geo);
                    }

                    objPlace.save(item, {
                        success: defer.resolve,
                        error  : defer.reject
                    });

                    return defer.promise;
                },
                update     : function (item) {
                    var defer = $q.defer();
                    item.save(null, {
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                destroy    : function (item) {
                    var defer = $q.defer();
                    item.destroy({
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                comments   : function (params) {
                    return ParseCloud.run('commentGallery', params);
                },
                feed       : function (params) {
                    return ParseCloud.run('feedGallery', params);
                },
                follow     : function (params) {
                    console.log('Follow', params);
                    return ParseCloud.run('followUser', params);
                },
                likeGallery: function (params) {
                    console.log(params);
                    return ParseCloud.run('likeGallery', {galleryId: params.galleryId});
                },
                get        : function (galleryId) {
                    var defer = $q.defer();
                    new Parse.Query(this)

                        .get(galleryId, {
                            success: defer.resolve,
                            error  : defer.reject
                        });

                    return defer.promise;
                },
                all        : function (params) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);

                    //if (params.filter != '') {
                    //    query.contains('words', params.filter);
                    //}

                    // Order Table
                    if (params.order) {
                        if (params.order.indexOf('-') < -1) {
                            query.ascending(params.order);
                        } else {
                            query.descending(params.order.replace('-'));
                        }
                    }

                    // Status
                    if (params.status && params.status !== null) {
                        if (params.status === 'pending') {
                            query.doesNotExist('isApproved');
                        } else if (params.status === 'rejected') {
                            query.equalTo('isApproved', false);
                        } else if (params.status === 'approved') {
                            query.equalTo('isApproved', true);
                        }
                    }

                    // Limit by page
                    query.limit(params.limit);

                    // Paginate
                    query.skip((params.page * params.limit) - params.limit);
                    query.find({
                        success: defer.resolve,
                        error  : defer.reject
                    });

                    return defer.promise;
                },
                count      : function (params) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);

                    if (params.filter != '') {
                        query.contains('words', params.filter);
                    }

                    if (params.date && params.date !== null) {
                        var start = moment(params.date).startOf('day');
                        var end   = moment(params.date).endOf('day');
                        query.greaterThanOrEqualTo('createdAt', start.toDate());
                        query.lessThanOrEqualTo('createdAt', end.toDate());
                    }

                    if (params.status && params.status !== null) {

                        if (params.status === 'pending') {
                            query.doesNotExist('isApproved');
                        } else if (params.status === 'rejected') {
                            query.equalTo('isApproved', false);
                        } else if (params.status === 'approved') {
                            query.equalTo('isApproved', true);
                        }
                    }

                    query.count({
                        success: function (count) {
                            defer.resolve(count);
                        },
                        error  : function (error) {
                            defer.reject(error);
                        }
                    });

                    return defer.promise;
                }
            });

        Object.defineProperty(ParseObject.prototype, 'likesTotal', {
            get: function () {
                return this.get('likesTotal');
            },
            set: function (value) {
                this.set('likesTotal', value);
            }
        });
        Object.defineProperty(ParseObject.prototype, 'user', {
            get: function () {
                return this.get('user');
            },
            set: function (value) {
                this.set('user', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'title', {
            get: function () {
                return this.get('title');
            },
            set: function (value) {
                this.set('title', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'hashtags', {
            get: function () {
                return this.get('hashtags');
            },
            set: function (value) {
                this.set('hashtags', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'words', {
            get: function () {
                return this.get('words');
            },
            set: function (value) {
                this.set('words', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'location', {
            get: function () {
                return this.get('location');
            },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });

        Object.defineProperty(ParseObject.prototype, 'address', {
            get: function () {
                return this.get('address');
            },
            set: function (value) {
                this.set('address', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'image', {
            get: function () {
                return this.get('image');
            },
            set: function (value) {
                this.set('image', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'icon', {
            get: function () {
                return this.get('icon');
            },
            set: function (value) {
                this.set('icon', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'imageThumb', {
            get: function () {
                return this.get('imageThumb');
            },
            set: function (value) {
                this.set('imageThumb', value);
            }
        });


        Object.defineProperty(ParseObject.prototype, 'isApproved', {
            get: function () {
                return this.get('isApproved');
            },
            set: function (value) {
                this.set('isApproved', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'expiresAt', {
            get: function () {
                return this.get('expiresAt');
            },
            set: function (value) {
                this.set('expiresAt', value);
            }
        });

        return ParseObject;

    }

})();
