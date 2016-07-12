(function () {
    'use strict';
    angular
        .module('starter')
        .factory('DAO', DAOFactory);
    function DAOFactory($interval, $q) {
        var _db;
        var _tables = [];

        return {
            init       : init,
            insert     : insert,
            query      : query,
            getLastSync: getLastSync,
            paginate   : paginate,
            fetchAll   : fetchAll
        };

        function init(database) {

            if (!_db) {
                if (window.sqlitePlugin !== undefined) {
                    _db = window.sqlitePlugin.openDatabase({
                        name              : database.name,
                        location          : 2,
                        createFromLocation: 1
                    });
                } else {
                    // For debugging in the browser
                    _db = window.openDatabase(database.name, "1.0", "Database", 200000);
                }
            }

            var _promises = [];
            angular.forEach(database.tables, function (table) {
                var columns = [];
                angular.forEach(table.columns, function (type, name) {
                    columns.push(name + ' ' + type);
                });
                query('DROP TABLE ' + table.name);
                var _query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                _promises.push(query(_query));
                _tables.push(table);
                // console.log(_query);
                // console.log('Table ' + table.name + ' initialized');
            });

            return $q.all(_promises);
        }

        function getLastSync(table, column) {
            var defer = $q.defer();
            query("SELECT MAX(" + column + ") as lastSync FROM " + table)
                .then(function (data) {
                    var lastSync = data.rows.item[0].lastSync;
                    defer.resolve(lastSync);
                });
            return defer.promise;
        }

        function insert(obj) {
            var defer    = $q.defer();
            var _columns = [];
            var _values  = [];

            angular.forEach(obj.columns, function (value, key) {
                _columns.push(key);
                if (typeof  value === 'number') {
                    _values.push(value);
                } else {
                    _values.push("'" + value + "'");
                }
            });

            var _query = "INSERT OR REPLACE INTO " + obj.table + " (" + _columns.join(',') + ") VALUES (" + _values.join(',') + ")"
            // console.info(_query);
            query(_query).then(defer.resolve).catch(defer.reject);
            return defer.promise;

        }

        function query(query, bindings) {
            bindings  = typeof bindings !== 'undefined' ? bindings : [];
            var defer = $q.defer();

            _db.transaction(function (transaction) {
                transaction.executeSql(query, bindings, function (transaction, result) {
                    // console.log(result);
                    var results = {
                        rows: []
                    };
                    if (result && result.rows) {
                        for (var i = 0; i < result.rows.length; i++) {
                            results.rows.push(angular.copy(result.rows[i]));
                        }
                    }
                    // console.log(results);
                    defer.resolve(results);
                }, function (transaction, error) {
                    console.log(transaction, error);
                    defer.reject(error);
                });
            });

            return defer.promise;
        }

        function paginate(_table, columns, _where, _join, _order, limit, page) {
            var defer = $q.defer();
            if (page === undefined) page = -1;
            var _columns = columns;
            var _limit   = limit ? limit : 10;
            var _query1  = "SELECT SUM(id) as TOTAL FROM " + _table + "  " + _where;
            var _query   = "SELECT " + _columns + " FROM " + _table + "  " + _where + " " + _join + " " + _order + " LIMIT " + _limit + " OFFSET " + page;

            console.log('query', _query1);
            console.log('query', _query);

            query(_query1).then(function (data) {
                var result = {
                    page : page,
                    total: data.rows[0].TOTAL,
                    rows : []
                };

                query(_query).then(function (data) {
                    console.log(data);

                    result.rows = data.rows;
                    defer.resolve(result);
                });
            });
            return defer.promise;
        }

        function fetchAll(result) {
            var output = [];
            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
        }
    }
})();
