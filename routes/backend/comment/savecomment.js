const async = require('async');

// http://stackoverflow.com/questions/23446377/syntax-error-due-to-using-a-reserved-word-as-a-table-or-column-name-in-mysql

exports.saveComment = function (conn, callback, data)
{

    var submit_id = data.submit_id;
    var comment = data.comment;

    var task = [
        function (cb) {
            conn.query({
                sql : 'update submitComment set comment = ? where submit_id = ?',
                values : [comment, submit_id]
            }, function (err, rows) {
                // update - OKPacket - rows.length 로 처리하면 안된다.
                // if (!rows.length) {cb(-1); return}
                if (err) {cb(err); return}
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
            callback(true);

        }
    })
};