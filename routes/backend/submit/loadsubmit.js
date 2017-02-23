const async = require('async');
const deepcopy = require('deepcopy');

// loadSubmit, loadStat 과 별도의 라이브러리로 구성.
// http://stackoverflow.com/questions/23446377/syntax-error-due-to-using-a-reserved-word-as-a-table-or-column-name-in-mysql
// TODO no, order, type, name -> MySQL reserved! (`` escape required)
exports.loadSubmit = function (conn, callback, submit_id)
{

    var form = {};
    // student 제출 폼과 같이 작성한다.
    /*
        submit = [];
            no
            type (?) // 필요 없음.
            inputs
            selects
            write
        survey_id = '';
        grade = Number;
    */

    var submitComment = {};

    var task = [
        function (cb) {
            conn.query({
                sql : 'select * from submitList where submit_id = ?',
                values : [submit_id]
            }, function (err, rows) {
                if (!rows.length) {cb(-1); return}
                if (err) {cb(err); return}
                var r = rows[0]; form = deepcopy(r);
                form.submit = [];
                cb(null);
            })
        },

        function (cb) {

            // TODO : 사용자가 학생일 경우, 코멘트 데이터를 가져오지 않도록 예외 처리 필요.

            conn.query({
                sql : 'select * from submitComment where submit_id = ?',
                values : [submit_id]
            }, function (err, rows) {
                if (!rows.length) {cb(-1); return}
                if (err) {cb(err); return}
                // submitComment = deepcopy(rows[0]);
                var row = rows[0];
                form.comment = row.comment;
                cb(null);
            })
        },

        function (cb) {
            conn.query({
                sql : 'select * from submitType0 where submit_id = ?',
                values : [submit_id]
            }, function (err, rows) {
                if (err) {cb(err); return}

                for (var idx in rows)
                {
                    var row = rows[idx];
                    delete row.submit_id;
                    row.type = 0;
                    form.submit.push(row);
                }

                cb(null);
            })
        },

        function (cb) {
            conn.query({
                sql : 'select * from submitType1 where submit_id = ?',
                values : [submit_id]
            }, function (err, rows) {
                if (err) {cb(err); return}

                for (var idx in rows)
                {
                    var row = rows[idx];
                    delete row.submit_id;
                    row.type = 1;
                    form.submit.push(row);
                }

                cb(null);
            })
        },

        function (cb) {
            conn.query({
                sql : 'select * from submitType2 where submit_id = ?',
                values : [submit_id]
            }, function (err, rows) {
                if (err) {cb(err); return}

                for (var idx in rows)
                {
                    var row = rows[idx];
                    delete row.submit_id;
                    row.type = 2;
                    form.submit.push(row);
                }

                cb(null);
            })
        },

        function (cb) {
            conn.query({
                sql : 'select * from submitType3 where submit_id = ?',
                values : [submit_id]
            }, function (err, rows) {
                if (err) {cb(err); return}

                for (var idx in rows)
                {
                    var row = rows[idx];
                    delete row.submit_id;
                    row.type = 3;
                    form.submit.push(row);
                }

                cb(null);
            })
        },
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
            callback(true, form);
        }
    })
};