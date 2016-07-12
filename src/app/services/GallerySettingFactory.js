(function () {
  'use strict';
  angular.module('starter').factory('GallerySetting', function ($q, moment) {

    var ParseObject = Parse.Object.extend('GallerySetting', {
      getStatus: function () {
        if (moment().toDate() >= this.expiresAt) {
          return 'Expired';
        }
        else if (this.isApproved) {
          return 'Approved';
        } else if (this.isApproved === false) {
          return 'Rejected';
        } else {
          return 'Pending';
        }
      }
    }, {
      create : function (item) {
        var defer    = $q.defer();
        var objPlace = new ParseObject();

        objPlace.save(item, {
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

        if (params.filter != '') {
          query.contains('canonical', params.filter);
        }

        query.descending('createdAt');
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

        query.count({
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      }

    });

    Object.defineProperty(ParseObject.prototype, 'key', {
      get: function () {
        return this.get('key');
      },
      set: function (value) {
        this.set('key', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'value', {
      get: function () {
        return this.get('value');
      },
      set: function (value) {
        this.set('value', value);
      }
    });

    return ParseObject;

  });

})();
