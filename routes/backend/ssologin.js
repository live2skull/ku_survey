const async = require('async');
const child_process = require('child_process');
const deepcopy = require('deepcopy');
const request = require('request');

const config = require('../../config');

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
            // java -cp SIServerAPI.4.3.jar;. TestSso

            //var jarpath = process.env.PWD + '/sso/SIServerAPI.4.3.jar';
            //var ssopath = process.env.PWD + '/sso/TestSso';

            // var batch = process.env.PWD + '/sso/run.sh ' + ssoToken;
            // var batch = process.cwd() + '/sso/run.sh ' + ssoToken;
            var hostName = config.SSO_HOST;
            var port = config.SSO_PORT;

            var batch = process.cwd() + '/sso/run.sh ' + hostName + ' ' + port + ' ' + ssoToken;

            child_process.exec(batch, {timeout: 5000, killSignal: 'SIGKILL', cwd: process.cwd() + '/sso'}, function (err, stdout, stderr) {
                if (err) {
                    cb(err);
                    return
                }

                if (stdout.indexOf('verifyToken()') != -1) {cb(-1); return}

                var rows = stdout.split('\n');
                for (var idx in rows)
                {
                    var d = rows[idx]; if (d == "") continue;
                    var s = d.split('-');
                    userInfo[s[0]] = s[1].replace(';', '');
                    // result.s[0] = s[1].replace(';', '');
                    // 존재하지 않는 property 일 경우 브라켓으로 값 설정.
                }

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
            if (hak_number.length == 10) year = Number(hak_number.substring(0, 4));
            if (hak_number.length == 6) hak_level = 1; // 교수
            else if (hak_number.length == 10) hak_level = 0; // 학생

            conn.query({
                sql : 'insert into user (user_id, year, hak_name, hak_number, hak_depart, hak_level, groupnmlist)' +
                ' values (?, ?, ?, ?, ?, ?, ?)',
                values : [userInfo.UID, year, userInfo.USERNAME, Number(hak_number),
                    userInfo.DPTNM, hak_level, userInfo.GROUPNMLIST]
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
            callback(conn, true, hak_level);
        }
    });
}