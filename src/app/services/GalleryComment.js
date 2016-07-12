(function () {
    'use strict';
    angular.module('starter').factory('GalleryComment', function ($q, moment) {

        var ParseObject = Parse.Object.extend('GalleryComment', {
            getStatus: function () {
                if (this.isApproved) {
                    return 'Approved';
                } else if (this.isApproved === false) {
                    return 'Rejected';
                } else {
                    return 'Pending';
                }
            }
        }, {
            get        : function (itemId) {
                var defer = $q.defer();
                new Parse.Query(this)
                    .get(itemId, {
                        success: defer.resolve,
                        error  : defer.reject
                    });

                return defer.promise;
            },
            create : function (item) {
                var defer = $q.defer();
                new ParseObject().save(item, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            update : function (item) {
                var defer = $q.defer();
                item.save(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            destroy: function (item) {
                var defer = $q.defer();
                item.destroy({
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            all    : function (params) {
                var defer = $q.defer();
                var query = new Parse.Query(this);

                // Order Table

                query.include('user');
                query.ascending('createdAt');
                query.equalTo('gallery', params.gallery);
                query.limit(params.limit);
                query.skip((params.page * params.limit) - params.limit);
                query.find({
                    success: defer.resolve,
                    error  : defer.reject
                });

                return defer.promise;
            },
            count  : function (params) {
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

        Object.defineProperty(ParseObject.prototype, 'user', {
            get: function () {
                return this.get('user');
            },
            set: function (value) {
                this.set('user', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'text', {
            get: function () {
                return this.get('text');
            },
            set: function (value) {
                this.set('text', value);
            }
        });

        return ParseObject;

    });

})();
