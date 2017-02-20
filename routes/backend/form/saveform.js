const async = require('async');
const security = require('../../../mod/security');
const helper = require('../../../mod/helper');

function createSurveyId(userId)
{
    var t = new Date();
    return security.buildHash(t.getTime().toString() + '_' + userId + '_' + Math.random().toString())
}

// http://stackoverflow.com/questions/23446377/syntax-error-due-to-using-a-reserved-word-as-a-table-or-column-name-in-mysql
// TODO no, order, type, name -> MySQL reserved! (`` escape required)
exports.saveForm = function (conn, callback, doc, user_id)
{
    var survey_id = doc.survey_id;
    var flag_edit = false;

    var task = [
        // 새로운 폼이면 새로 만들기. 아니면 업데이트(surveyList), 삭제(surveyOption) 진행 후 계속
        function (cb) {
            if (survey_id == '')
            {
                survey_id = createSurveyId(user_id);
                conn.query({
                    sql : 'insert into surveyList (survey_id, professor_id, title, notice, no_idx) values (?, ?, ?, ?, ?)',
                    values : [survey_id, user_id, doc.title, doc.notice, doc.no_idx]
                }, function (err, rows) {
                    if (err || !rows.affectedRows) {cb(err); return}
                    cb(null);
                })
            }
            else
            {
                // survey id exist. update & delete from surveyOption
                flag_edit = true;

                conn.query({
                    sql : 'update surveyList SET title = ?, notice = ?, no_idx = ?, modified_at = now() where survey_id = ?',
                    values : [doc.title, doc.notice, doc.no_idx, survey_id]
                }, function (err, rows) {
                    if (err || !rows.affectedRows) {cb(err); return}
                    cb(null);
                })
            }
        },

        function (cb) {
            if (!flag_edit) {cb(null); return}

            conn.query({
                sql : 'delete from surveyOption where survey_id = ?',
                values : [survey_id]
            }, function (err, rows) {
                if (err) {cb(err); return}
                cb(null);
            });
        },
        // ************************************************************************

        // 데이터 (설문 폼) 삽입.
        function (cb) {
            var idx = 0;
            var max = doc.questions.length;
            async.until(
                function () {
                    if (idx >= max)
                    {
                        cb(null);
                    }
                    return idx >= max;
                },
                function (c) {
                    var q = doc.questions[idx]; idx++;
                    switch (q.type)
                    {
                        case 0: // 주관식
                            conn.query({
                                sql : 'insert into surveyOption (survey_id, `no`, no_idx, `order`, `type`, maxlength, `name`) values (?, ?, ?, ?, ?, ?, ?)',
                                values : [survey_id, q.no, q.no_idx, q.order, q.type, 200, q.name]
                            }, function (err, rows) {
                                if (err || !rows.affectedRows) {c(err); return}
                                c(null);
                            });
                            break;

                        default: // 객관식
                            conn.query({
                                sql : 'insert into surveyOption (survey_id, `no`, no_idx, `order`, `type`, `name`, options) values (?, ?, ?, ?, ?, ?, ?)',
                                values : [survey_id, q.no, q.no_idx, q.order, q.type, q.name, JSON.stringify(q.options)]
                            }, function (err, rows) {
                                if (err || !rows.affectedRows) {c(err); return}
                                c(null);
                            });
                            break;
                    }

                },
                function (err) {
                    if (err) cb(err)
                }
            )
        }
    ];

    // ******************************************************************************************

    async.waterfall(task, function (err) {
        if (err)
        {
            callback(false);
        }
        else
        {
            callback(true, survey_id);
        }
    })
};