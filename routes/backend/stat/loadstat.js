const async = require('async');

var extractIdvars = function (datas, idvar) {
    var nos = [];

    for (var idx in datas)
    {
        var data = datas[idx];
        var no = data[idvar];
        if (nos.indexOf(no) == -1) nos.push(no);
    }

    return nos;
};

var listIdvars = function (datas, idvar, value) {
    var ret = [];

    for (var idx in datas)
    {
        var data = datas[idx];
        if (data[idvar] == value) ret.push(data);
    }

    return ret;
};

var countIdvars = function (datas, idvar, value)
{
    var ret = 0;

    for (var idx in datas) if (datas[idx][idvar] == value) ret++;
    return ret;
}

function apply_filter(sql, filter_year, filter_grade)
{
    if (filter_grade != undefined)
    {
        sql.sql += 'and submitList.grade = ' + filter_grade + ' '
    }
    if (filter_year != undefined)
    {
        sql.sql += 'inner join user on submitList.student_id = user.user_id and user.year = ' + filter_year + ' '
    }
}

exports.loadStat = function (conn, callback, survey_id, filter_year, filter_grade)
{
    // year, grade -> 클라이언트 측에서 보내지 않았으면 undefined.
    var data_type12 = [];
    var data_type3 = [];
    var stat = {};

    var task = [
        function (cb) {
            var sql = {
                sql : 'select submitType1.`no`, submitType1.`select` from submitType1 ' +
                'inner join submitList on submitList.submit_id = submitType1.submit_id and submitList.survey_id = ? ',
                values : [survey_id]
            };
            apply_filter(sql, filter_year, filter_grade);
            conn.query(sql, function (err, rows) {
                if (err) {cb(err); return}
                for (var idx in rows) data_type12.push(rows[idx])
                cb(null);
            })
        },

        function (cb) {
            var sql = {
                sql : 'select submitType2.`no`, submitType2.`select` from submitType2 ' +
                'inner join submitList on submitList.submit_id = submitType2.submit_id and submitList.survey_id = ? ',
                values : [survey_id]
            };
            apply_filter(sql, filter_year, filter_grade);
            conn.query(sql, function (err, rows) {
                 if (err) {cb(err); return}
                for (var idx in rows) data_type12.push(rows[idx])
                cb(null);
            })
        },

        function (cb) {
            var sql = {
                sql : 'select submitType3.`no`, submitType3.`select`, submitType3.`order` from submitType3 ' +
                'inner join submitList on submitList.submit_id = submitType3.submit_id and submitList.survey_id = ? ',
                values : [survey_id]
            };
            apply_filter(sql, filter_year, filter_grade);
            conn.query(sql, function (err, rows) {
                if (err) {cb(err); return}
                for (var idx in rows) data_type3.push(rows[idx])
                cb(null);
            })
        },

        function (cb) {
            // 객관식 단일, 다중 문항 계산
            // 1. 전체 넘버 파싱.
            var nos = extractIdvars(data_type12, 'no');

            // 넘버 단위로 selection 을 뽑아냄
            for (var idx in nos)
            {
                var no = nos[idx];
                var datas = listIdvars(data_type12, 'no', no); // 해당 넘버를 가진 것만 추출
                var selects = extractIdvars(datas, 'select'); // 여기서 select 가 총 몇개 있는지 구한다.

                stat[no] = {}; var dest = stat[no];
                // 이제, 각 select 번호에 따라 총 몇개가 있는지 구함.
                for (var i in selects)
                {
                    var sel = selects[i];
                    dest[sel] = countIdvars(datas, 'select', sel);
                }
            }

            cb(null)
        },

        function (cb) {
            // 객관식 순위지정 다중 문항 계산.
            // 1. 전체 넘버 파싱.
            var nos = extractIdvars(data_type3, 'no');

            for (var idx in nos)
            {
                var no = nos[idx];
                var datas = listIdvars(data_type3, 'no', no); // 해당 넘버를 가진 것만 추출
                var orders = extractIdvars(datas, 'order');
                var selects = extractIdvars(datas, 'select');
                //var selects = extractIdvars(datas, 'select'); // 여기서 select 가 총 몇개 있는지 구한다.

                stat[no] = {}; var dest = stat[no];
                // 이제, 각 select 번호에 따라 총 몇개가 있는지 구함.
                // TODO :: 전체 순위 판별
                for (var i in orders)
                {
                    // 각 order 별로 총 몇개 있는지 확인.
                    // order 별로 정리한다.
                    var ord = orders[i];
                    // 가장 많은 거. [select, count]
                    var max = 0;
                    var dsel = 0;
                    for (var j in selects)
                    {
                        var sel = selects[j];
                        var list = listIdvars(datas, 'select', sel);
                        var cnt = countIdvars(list, 'order', ord);

                        if (cnt > max)
                        {
                            dsel = sel; max = cnt;
                        }
                    }

                    dest[ord] = [dsel, max];
                    // var sel = selects[i];
                    // var count = countIdvars(datas, 'select', sel);

                    // dest[sel] = countIdvars(datas, 'select', sel);
                };
            }

            cb(null)
        }
    ];

    async.waterfall(task, function (err) {
        if (err)
        {
            callback(false);
        }
        else
        {
            callback(true, stat)
        }
    })
};