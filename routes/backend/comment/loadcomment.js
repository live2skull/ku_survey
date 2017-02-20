const async = require('async');
const deepcopy = require('deepcopy');

exports.loadComment = function (conn, callback, data)
{

    var comment = '';
    var submit_id = data.submit_id;

    var task = [
        function (cb) {
            conn.query({
                sql : 'select * from submitComment where submit_id = ?',
                values : [submit_id]
            }, function (err, rows) {
                if (!rows.length) {cb(-1); return}
                if (err) {cb(err); return}
                comment = deepcopy(rows[0].comment);
                cb(null);
            })
        }
    ];

    async.waterfall(task, function (err) {
        if (err && !isNaN(err))
        {
            callback(false);
        }
        else
        {
            callback(true, comment);
        }
    })
};