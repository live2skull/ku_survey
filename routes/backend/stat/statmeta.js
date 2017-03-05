const async = require('async');

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

// 학번 , 학년이 필요함.
function extractPure(obj, key)
{
    var ret = [];

    for (var idx in obj)
    {
        var d = obj[idx][key];
        if (!contains(ret, d)) ret.push(d);
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