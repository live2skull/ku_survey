const async = require('async');


// 학번 , 학년이 필요함.
function extractPure(obj, key)
{
    var ret = [];

    for (var idx in obj)
    {
        var d = obj[idx][key];
        if (ret.indexOf(d) === -1) ret.push(d);
    }

    return ret;
}

exports.loadStatMeta = function (conn, callback, survey_id)
{
    var stat = {year : [], grade : []};

    var task = [
        function (cb) {
            conn.query({
                sql : 'select user.year, submitList.grade from user inner join submitList on ' +
                'submitList.student_id = user.user_id where submitList.survey_id = ?',
                values : [survey_id]
            }, function (err, rows) {
                if (err) {cb(err); return}
                stat.year = extractPure(rows, 'year');
                stat.grade = extractPure(rows, 'grade');
                cb(null);
            })
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