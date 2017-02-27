const async = require('async');
const deepcopy = require('deepcopy');

// 이거 나중에 구현해도 됨!
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
                    sql : 'select surveyList.survey_id, user.hak_name, user.hak_depart, surveyList.title from surveyList ' +
                    'inner join user on user.hak_depart = ? and user.user_id = surveyList.professor_id ' +
                    'and surveyList.`type` = ? ',
                    values : [department, type]
                };
            else
                qd =
                {
                    sql : 'select surveyList.survey_id, user.hak_name, user.hak_depart, surveyList.title from surveyList ' +
                    'inner join user on user.user_id = surveyList.professor_id and surveyList.`type` = ? ',
                    values : [type]
                };

            // 데이터 관련
            /*
            * 1. 좀있다 들고갈꺼
            * 폼 양식 열기 닫기 (시간지정)
            *
            * 2.
            * 폼 양식 수정 시 이미 있는지 체크 (validataion)
            * */
            if (hide_closed)
            {
                // 부등호를 반대로 하면 -> 현재 진행중인 설문이 됨.
                qd.sql += ' where date(surveyList.closed_at) >= date(now()) and date(surveyList.started_at) <= date(now()) '
            }

            if (pagnation)
            {
                qd.sql += 'order by surveyList.created_at desc limit ?, 10'; qd.values.push(Number(pagnation *  pagnation_offset));
            }
            else
            {
                qd.sql += 'order by surveyList.created_at desc'
            }

            conn.query(qd, function (err, rows) {
                if (err) {cb(err); return}
                data = deepcopy(rows);
                cb(null);
            });
        },

        function (cb)
        {
            var idx = 0;
            var max = data.length;
            async.until(
                function () {
                    var flag = idx >= max;
                    if (flag) cb(null);
                    return flag;
                },
                function (c) {
                    var d = data[idx]; idx++;
                    var survey_id = d.survey_id;

                    conn.query({
                        sql : 'select count(submit_id) from submitList where survey_id = ?',
                        values : [survey_id]
                    }, function (err, rows) {
                        if (err || rows.count == 0) c(1);
                        else {d.participants_cnt = rows[0]['count(submit_id)']; c(null) }
                    })
                },
                function (err) {
                    if (err) cb(err);
                }
            )
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