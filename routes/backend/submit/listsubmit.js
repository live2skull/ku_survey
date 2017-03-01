const async = require('async');
const deepcopy = require('deepcopy');


// Do more stuff in here!
// listSubmit 인데 surveys 를 반환?
// TODO 수정 필요.
exports.listSubmit_Professor = function (conn, callback, user_id)
{
    var surveys = [];

    var task = [

        function (cb)
        {
            conn.query({
                sql : 'select * from surveyList where professor_id = ?',
                values : [user_id]
            }, function (err, rows)
            {
                if (err) { cb(err); return }
                surveys = deepcopy(rows);
                cb(null);
            })
        },

        function (cb)
        {
            var idx = 0;
            var max = surveys.length;

            if (idx == 0) { cb(null); return }
            async.until(
                function () {
                    if (idx >= max) {
                        cb(null);
                    }
                    return idx >= max;
                },
                function (c)
                {
                    var s = surveys[idx];
                    conn.query({
                        sql : 'select user.hak_name, user.hak_number, user.hak_depart, submitList.created_at from user ' +
                        'inner join submitList on user.user_id = submitList.student_id where submitList.survey_id = ?',
                        values : [s.survey_id]
                    }, function (err, rows) {
                        if (err) { c(err); return }
                        for (var idx in rows)
                        {
                            var r = rows[idx];
                            s.hak_name = r.hak_name;
                            s.hak_number = r.hak_number;
                            s.hak_depart = r.hak_depart;
                            s.created_at = r.created_at;
                            c(null);
                        }
                    })
                },
                function (err) {
                    if (err) cb(err);
                }
            );
        }
    ];

    async.waterfall(task, function (err) {
        if (err) {
            callback(false);
        }
        else
        {
            callback(true, surveys);
        }
    })

};

exports.listSubmit_Student = function (conn, callback, user_id) {
    var submits = [];

    var task = [
        function (cb) {
            conn.query({
                // sql : 'select * from submitList where student_id = ?',
                sql : 'select submitList.submit_id, submitList.survey_id, submitList.created_at, surveyList.title from submitList ' +
                'inner join surveyList on submitList.survey_id = surveyList.survey_id where submitList.student_id = ? order by created_at DESC',
                values : [user_id]
            }, function (err, rows) {
                if (err) { cb(err); return }
                submits = deepcopy(rows);
                cb(null);
            })
        }
    ];

    async.waterfall(task, function (err) {
        if (err) callback(false);
        else callback(true, submits)
    })

};