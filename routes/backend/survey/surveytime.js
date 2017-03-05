const async = require('async');

exports.setSurveyTime = function (conn, callback, survey_id, reset, started_at, closed_at)
{
    var task = [
        function (cb) {

            // started_at, closed_at DATETIME 포맷 문자열로 넣어주면 됨
            if (reset)
            {
                var sql = {
                    // 하나만 null 일 경우 (closed_at) -> 차트에서 표시. (중간에 중단된 경우)
                    sql : 'update surveyList set closed_at = null where survey_id = ?',
                    values : [survey_id]
                }
            }
            else
            {
                var sql = {
                    sql : 'update surveyList set closed_at = ?, started_at = ? where survey_id = ?',
                    values : [closed_at, started_at, survey_id]
                }
            }

            conn.query(sql, function (err, rows) {
                if (err) {cb(err)}
                else if (rows.changedRows == 1) cb(null);
                else cb(1)
            });
        }
    ];

    async.waterfall(task, function (err) {
        if (err) callback(false);
        else callback(true);
    })
};