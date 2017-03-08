const async = require('async');
const security = require('../../../mod/security');
const helper = require('../../../mod/helper');

function createSurveyId(userId)
{
    var t = new Date();
    return security.buildHash(t.getTime().toString() + '_' + userId + '_' + Math.random().toString())
}

exports.checkExistFormData = function (conn, callback, survey_id)
{
    var task = [
        function (cb) {
            if (survey_id == '') cb(null);
            else
            {
                conn.query({
                    sql : 'select count(*) from submitList where survey_id = ?',
                    values : [survey_id]
                }, function (err, rows) {
                    if (err) {cb(err); return}
                    var count = rows[0]['count(*)'];
                    if (count) {cb(1); return }// 이미 저장된 데이터가 있는 경우
                    cb(null);
                });
            }
        }
    ];

    async.waterfall(task, function (err) {
        if (err) callback(false);
        else callback(true);
    });
};

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
                    sql : 'insert into surveyList (survey_id, professor_id, title, notice, no_idx, `type`) values (?, ?, ?, ?, ?, ?)',
                    values : [survey_id, user_id, doc.title, doc.notice, doc.no_idx, doc.type]
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
                    sql : 'update surveyList SET title = ?, notice = ?, no_idx = ?, `type` = ?, modified_at = now() where survey_id = ?',
                    values : [doc.title, doc.notice, doc.no_idx, doc.type, survey_id]
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

                        default: // 객관식 (순위지정도 그대로 반영한다.)
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