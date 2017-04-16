const async = require('async');

exports.deleteForm = function (conn, callback, survey_id) {

    var submit_ids = [];

    var task = [
        function (cb) {
            var sql = 'select submit_id from submitlist where survey_id = ?';

            conn.query({
                sql : sql, values : [survey_id]
            }, function (err, rows) {
                if (err) { cb(err); return }
                for (var i in rows) {
                    var row = rows[i];
                    submit_ids.push(row['submit_id']);
                }

                cb(null);
            })
        },

        function (cb) {
            var idx = 0;
            var max = submit_ids.length;

            async.until(
                function () {
                    if (idx >= max) cb(null);
                    return idx >= max;
                },
                function (c) {
                    var submit_id = submit_ids[idx]; idx++;
                    var sql = 'delete from submittype0 where submit_id = ?; ' +
                        'delete from submittype1 where submit_id = ?; ' +
                        'delete from submittype2 where submit_id = ?; ' +
                        'delete from submittype3 where submit_id = ?; ' +
                        'delete from submitcomment where submit_id = ?; ';
                    conn.query({
                        sql : sql, values : [submit_id, submit_id, submit_id, submit_id, submit_id]
                    }, function (err, rows) {
                        if (err) {c(err); return}
                        // if (!rows.affectedRows) {c(1); return }
                        c(null);
                    })
                },
                function (err) {
                    if (err) cb(err);
                }
            );
        },

        function (cb) {
            var sql = 'delete from submitlist where survey_id = ?';
            conn.query({
                sql : sql, values : [survey_id]
            }, function (err, rows) {
                if (err) {cb(err); return}
                // if (!rows.affectedRows) {cb(1); return }
                cb(null);
            })
        },

        function (cb) {
            var sql = 'delete from surveyoption where survey_id = ?';
            conn.query({
                sql : sql, values : [survey_id]
            }, function (err, rows) {
                if (err) {cb(err); return}
                // if (!rows.affectedRows) {cb(1); return }
                cb(null);
            })
        },

        function (cb) {
            var sql = 'delete from surveylist where survey_id = ?';
            conn.query({
                sql : sql, values : [survey_id]
            }, function (err, rows) {
                if (err) {cb(err); return}
                // if (!rows.affectedRows) {cb(1); return }
                cb(null);
            })
        }
    ];

    async.waterfall(task, function (err) {
        if (err) callback(false);
        else callback(true);
    });
};
