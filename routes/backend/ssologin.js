const async = require('async');
const child_process = require('child_process');
const deepcopy = require('deepcopy');
const request = require('request');

// http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
function replaceAll(str, org, dst)
{
    // TODO :: 프로토타입이란 무엇인가???
    String.prototype.replaceAt = function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
    };

    for (var idx in str)
    {
        idx = Number(idx); var s = str[idx];
        if (s == org)
        {
            str = str.replaceAt(idx, dst)
        }
    }

    return str
}

exports.ssoLogin = function (callback, session, cookieOnly, id, pw)
{
    var userInfo = {};

    var task = [
        function (cb) {

            if (cookieOnly)
            {
                // 이미 쿠키를 가지고 있을 경우. 아이디와 패스워드로 로그인하지 않습니다.
                cb(null, cookieOnly);
                return;
            }

            request.post({
                url: 'https://portal.korea.ac.kr/common/Login.kpd',
                followRedirect: false,
                form: {id: id, pw: pw, direct_div: '', pw_pass: '', browser: 'chrome'}
            }, function (err, response, body) {
                if (err) {
                    cb(err)
                }
                else {
                    var headers = response.headers['set-cookie'];
                    for (var idx in headers) {
                        // ssoToken 을 찾을 수 없음.
                        var cookie = headers[idx];
                        if (cookie.indexOf('ssotoken') != -1)
                        {
                            cookie = cookie.substring('ssotoken='.length).split(';')[0];
                            cb(null, cookie);
                            return;
                        }
                    }
                    cb(-1);
                }
            })
        },

        function (ssoToken, cb) {

            var hostName = process.env.sso_host;
            var port = Number(process.env.sso_port);
            var apikey = process.env.sso_api_key;

            var batch = process.cwd() + '/sso/run.sh ' + hostName + ' ' + port + ' ' + apikey + ' ' + ssoToken;

            child_process.exec(batch, {timeout: 5000, killSignal: 'SIGKILL', cwd: process.cwd() + '/sso'}, function (err, stdout, stderr) {
                if (err) {
                    cb(err);
                    return
                }

                // 에러 처리 확인 필요.
                if (stdout.indexOf('verifyToken()') != -1) {cb(-1); return}

                // 여기서는 전체 데이터를 가져오므로 따로 손볼 필요가 없습니다.
                var rows = stdout.split('\n');
                for (var idx in rows)
                {
                    var d = rows[idx]; if (d == "") continue;
                    var s = d.split('-');
                    // Patched -> 전체 데이터 저장으로 변경함.
                    // userInfo[s[0]] = s[1].replace(';', '');
                    // !!! - replace 할 경우 전체 데이터를 뱐경하지 않음. 한개의 문자열만 변경하고 끝남
                    userInfo[s[0]] = s[1];

                    // TODO 에러 발생 가능성 있음!
                    // 학교 SSO 토큰에서 특정 정보를 임의적으로 주지 않을 경우 (key 없음)
                    if (s[0] == 'DPTNMLIST') userInfo[s[0]] = replaceAll(s[1], '·', '및');
                    // 전자·정보공학과의 경우 -> 전자및정보공학과로 변경합니다.
                };

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
            callback(true, userInfo);
        }
    })
};

exports.ssoCheck = function (conn, callback, userInfo)
{
    var count = 0;
    var task = [
        function (cb)
        {
            conn.query({
                    sql : 'select user_id from user where user_id = ?',
                    values : [userInfo.UID]
                },
                function (err, rows)
                {
                    if (err) {cb(err)}
                    else
                    {
                        count = rows.length;
                        cb(null);
                    }
                });
        }
    ];

    async.waterfall(task, function (err) {
        if (isNaN(err))
        {
            callback(conn, false);
        }
        else
        {
            callback(conn, count); // err is Number!
        }
    });
};

exports.ssoWithUserID = function (conn, callback, userId, uInfo)
{
    var task = [
        function (cb) {
            var sql = 'select * from user where user_id = ?';
            conn.query({
                sql : sql,
                values : [userId]
            }, function (err, rows) {
                if (err) { cb(err); return; }
                if (!rows.length) { cb(err); return;}
                var row = rows[0];

                uInfo['UID'] = row['user_id'];
                uInfo['USERNAME'] = row['hak_name'];
                uInfo['GROUPNMLIST'] = row['groupnmlist'];
                uInfo['DPTNMLIST'] = row['hak_depart'];
                uInfo['USERID'] = row['hak_number'];

                cb(null);
            });
        }
    ];

    async.waterfall(task, function (err) {
       if (err)
       {
           callback(conn, 0);
       }
       else
       {
           callback(conn, 1);
       }
    });
}

// USERNAME, USERID(학번), DPTNM(전자및정보공학과), DEPTCD(?), GROUPNMLIST(학부 재학), UID
exports.ssoSave = function (conn, callback, userInfo)
{
    var hak_level = 0;

    var task = [
        function (cb)
        {
            conn.query({
                sql : 'select user_id from user where user_id = ?',
                values : [userInfo.UID]
            },
            function (err, rows)
            {
                if (err) {cb(err)}
                else
                {
                    cb(null, rows.length)
                }
            });
        },

        function (flag, cb)
        {
            if (flag) { cb(null); return }

            var year = 0; var hak_level = 0;
            var hak_number = userInfo.USERID;
            var GROUPNMLIST = userInfo.GROUPNMLIST;

            // 교수인 경우
            if (GROUPNMLIST.indexOf("교원") != -1 || GROUPNMLIST.indexOf("직원") != -1) hak_level = 1;
            else
            {
                hak_level = 0;
                year = Number(hak_number.substring(0, 4));
            }

            // fixed! - 저장하는 데이터 일부 변경함.
            conn.query({
                sql : 'insert into user (user_id, year, hak_name, hak_number, hak_depart, hak_level, groupnmlist)' +
                ' values (?, ?, ?, ?, ?, ?, ?)',
                values : [userInfo.UID, year, userInfo.USERNAME, Number(hak_number),
                    userInfo.DPTNMLIST, hak_level, userInfo.GROUPNMLIST]
            },
            function (err, rows)
            {
                if (err) cb(err);
                else cb(null);
            });
        }
    ];

    async.waterfall(task, function (err) {
        if (err)
        {
            callback(conn, false);
        }
        else
        {
            callback(conn, true);
        }
    });
}