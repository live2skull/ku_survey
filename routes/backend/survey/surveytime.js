const async = require('async');

exports.setSurveyTime = function (conn, callback, survey_id, reset, started_at, closed_at)
{
    var task = [
        function (cb) {

            // started_at, closed_at DATETIME 포맷 문자열로 넣어주면 됨
            // TODO 우선은 closed_at 만 null 처리하도록 함. (추후 기능 추가 - 차트 보기에서)
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
                // 이게 에러나는 경우는 데이터베이스 에러이거나, 클라이언트에서 임의적으로 데이터를 위조하는 경우임. 상관없음.
                // TODO 문제 : 만약 리셋을 하는데, 이미 리셋이 되어있어 데이터가 안 변하면 changedRows 가 반환되지 않음.
                else cb(null);
                // else if (rows.changedRows == 1) cb(null);
                // else cb(1)
            });
        }
    ];

    async.waterfall(task, function (err) {
        if (err) callback(false);
        else callback(true);
    })
};