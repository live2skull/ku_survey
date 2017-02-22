const async = require('async');
const deepcopy = require('deepcopy');

var pagnation_offset = 10;

exports.listSurvey = function (conn, callback, type, department, hide_closed, pagnation)
{
    var data = {};

    var task = [
        // 설문지 폼이 존재하는지 확인.
        function (cb) {
            var qd = {};

            if (type == 0 || type == 1)
                qd =
                {
                    sql : 'select surveyList.survey_id, user.hak_name, user.hak_depart from surveyList ' +
                    'inner join user on user.hak_depart = ? and user.user_id = surveyList.professor_id ' +
                    'and surveyList.`type` = ?',
                    values : [department, type]
                };
            else
                qd =
                {
                    sql : 'select surveyList.survey_id, user.hak_name, user.hak_depart from surveyList ' +
                    'inner join user on user.user_id = surveyList.professor_id and surveyList.`type` = ?',
                    values : [type]
                };

            if (hide_closed)
            {
                qd.sql += ' where date(surveyList.closed_at) >= date(now()) '
            }

            if (pagnation)
            {
                qd.sql += 'order by created_at desc limit ?, 10'; qd.values.push(Number(pagnation *  pagnation_offset));
            }
            else
            {
                qd.sql += 'order by created_at desc'
            }

            conn.query(qd, function (err, rows) {
                if (err) {cb(err); return}
                data = deepcopy(rows);
                cb(null);
            });
        }
    ];

    async.waterfall(task, function (err) {
        if (err)
        {
            callback(false);
        }
        else
        {
            callback(true, data)
        }
    })
};