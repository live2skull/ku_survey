const async = require('async');
const security = require('../../../mod/security');
const deepcopy = require('deepcopy');

// http://stackoverflow.com/questions/23446377/syntax-error-due-to-using-a-reserved-word-as-a-table-or-column-name-in-mysql
// TODO no, order, type, name -> MySQL reserved! (`` escape required)
exports.loadForm = function (conn, callback, survey_id)
{

    // var survey_id = 'survey_id';
    // var survey_id = survey_id;
    var form = {};
    var task = [
        // 설문지 폼이 존재하는지 확인.
        function (cb) {
            conn.query({
                sql : 'select * from surveyList where survey_id = ?',
                values : [survey_id]
            }, function (err, rows) {
                if (!rows.length) {cb(-1); return}
                if (err) {cb(err); return}
                var r = rows[0]; form = deepcopy(r);
                cb(null);
            })
        },

        // 설문지 상세리스트 가져오기.
        function (cb) {
            conn.query({
                sql : 'select * from surveyOption where survey_id = ?',
                values : [survey_id]
            }, function (err, rows) {
                // 에러로 처리할 필요 없음.
                // if (!rows.length) {cb(-1); return}
                if (err) {cb(err); return}
                form.questions = [];

                // questions
                for (var idx in rows)
                {
                    var q = rows[idx];
                    delete q.id; delete q.survey_id;
                    switch (q.type)
                    {
                        case 0:
                            break;

                        // option : JSON 도큐멘트로 들어가 있으므로 파싱 필요.
                        default:
                            q.options = JSON.parse(q.options);
                            break;
                    }
                    form.questions.push(q);
                }
                cb(null);
            })
        }
    ];

    async.waterfall(task, function (err) {
        if (err && !isNaN(err))
        {
            callback(-1);
        }
        else if (err && isNaN(err))
        {
            callback(0);
        }
        else
        {
            callback(1, form);
        }
    })
};