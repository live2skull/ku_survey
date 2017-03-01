const async = require('async');

exports.checkAssignedSubmit = function (conn, callback, user_id, survey_id)
{
    var task = [
        function (cb) {
            // 이미 설문에 참여했는지 검증합니다.
            conn.query({
                sql : 'select submit_id from submitList where student_id = ? and survey_id = ?',
                values : [user_id, survey_id]
            }, function (err, rows) {
                if (err) {cb(err); return}
                // 이미 설문에 참여한 경우
                else if (rows.length) {cb(true); return} // rows.length != 0 >> 무조건 err 는 true 가 됨 (if)
                else cb(null);
            })
        }
    ];

    async.waterfall(task, function (err) {
       if (err) callback(false);
       else callback(true);
    });
};
