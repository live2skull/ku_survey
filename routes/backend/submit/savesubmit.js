const async = require('async');
const security = require('../../../mod/security');

function createSubmitId(userId)
{
    var t = new Date();
    return security.buildHash(t.getTime().toString() + '_' + userId + '_' + Math.random().toString())
}

// http://stackoverflow.com/questions/23446377/syntax-error-due-to-using-a-reserved-word-as-a-table-or-column-name-in-mysql
// TODO no, order, type, name -> MySQL reserved! (`` escape required)
exports.saveSubmit = function (conn, callback, doc, user_id)
{
    var submit_id = createSubmitId(user_id);

    // doc.submit (datas)
    // doc.survey_id (document id)
    // 작성한 설문 취소 블가를 가정으로 제작.

    var task = [
        function (cb) {

            conn.query({
                sql: 'insert into submitList (submit_id, survey_id, student_id, grade) values (?, ?, ?, ?)',
                values: [submit_id, doc.survey_id, user_id, doc.grade]
            }, function (err, rows) {
                if (err || !rows.affectedRows) {cb(err); return}
                cb(null);
            });

        },

        // 데이터 (설문 응답지) 삽입.
        function (cb) {
            var idx = 0;
            var max = doc.submit.length;
            async.until(
                function () {
                    if (idx >= max)
                    {
                        cb(null);
                    }
                    return idx >= max;
                },
                function (c) {
                    var q = doc.submit[idx]; idx++;
                    switch (q.type)
                    {
                        case 0: // 주관식

                            conn.query({
                                sql : 'insert into submitType0 (submit_id, `no`, input) values (?, ?, ?)',
                                values : [submit_id, q.no, q.input]
                            }, function (err, rows) {
                                if (err || !rows.affectedRows) {c(err); return}
                                c(null);
                            });
                            break;

                        case 1: // 객관식 (단일)

                            var sql = 'insert into submitType1 ';
                            var values = [];

                            var sel = q.selects[0];
                            var inp = q.inputs[0];

                            // if (inp == null)
                            // {
                            //     sql += '(submit_id, `no`, `select`) values (?, ?, ?)';
                            //     values = [submit_id, q.no, sel]
                            // }
                            // else
                            // {
                            sql += '(submit_id, `no`, `select`, `input`) values (?, ?, ?, ?)';
                            values = [submit_id, q.no, sel, inp];
                            // }

                            conn.query({
                                sql : sql,
                                values : values
                            }, function (err, rows) {
                                if (err || !rows.affectedRows) {c(err); return}
                                c(null);
                            });
                            break;

                        case 2: // 객관식 (다중)
                            var ssql = '';

                            for (var i in q.selects)
                            {
                                var sel = q.selects[i];
                                var inp = q.inputs[i];

                                var sql = 'insert into submitType2 ';
                                var values = [];

                                // if (isNaN(inp) || inp == null)
                                // {
                                //     sql += '(submit_id, `no`, `select`) values (?, ?, ?); ';
                                //     values = [submit_id, q.no, sel]
                                // }
                                // else
                                // {
                                sql += '(submit_id, `no`, `select`, `input`) values (?, ?, ?, ?); ';
                                values = [submit_id, q.no, sel, inp];
                                // }

                                ssql += conn.format(sql, values);
                            }

                            conn.query({
                                sql : ssql,
                                // values : values
                            }, function (err, rows) {
                                if (err || !rows.affectedRows) {c(err); return}
                                for (var i in rows) {
                                    if (!rows[i].affectedRows) {c(0); return}
                                }

                                c(null);
                            });
                            break;

                        case 3: // 객관식 (순위지정)
                        {
                            var ssql = '';

                            for (var i in q.selects)
                            {
                                var sel = q.selects[i];
                                var inp = q.inputs[i];
                                var ord = q.orders[i];

                                var sql = 'insert into submitType3 ';
                                var values = [];

                                sql += '(submit_id, `no`, `select`, `order`, `input`) values (?, ?, ?, ?, ?); ';
                                values = [submit_id, q.no, sel, ord, inp];

                                ssql += conn.format(sql, values);

                            }
                            conn.query({
                                sql : ssql,
                                // values : values
                            }, function (err, rows) {
                                if (err || !rows.affectedRows) {c(err); return}
                                for (var i in rows) {
                                    if (!rows[i].affectedRows) {c(0); return}
                                }

                                c(null);
                            });
                            break;

                        }

                    }

                },
                function (err) {
                    if (err) cb(err)
                }
            )
        },

        function (cb) {

            conn.query({
                sql: 'insert into submitComment (submit_id, comment) values (?, "")',
                values: [submit_id]
            }, function (err, rows) {
                if (err || !rows.affectedRows) {cb(err); return}
                cb(null);
            });

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
            callback(true, submit_id);
        }
    })
};