const async = require('async');
const child_process = require('child_process');
const deepcopy = require('deepcopy');
const request = require('request');

exports.ssoLogin = function (callback, session, id, pw)
{
    var task = [
        function (cb) {
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
            var batch = process.cwd() + '/sso/run.sh ' + ssoToken;

            child_process.exec(batch, {timeout: 5000, killSignal: 'SIGINT'}, function (err, stdout, stderr) {
                if (err) {
                    cb(err);
                    return
                }

                var data = '';
                try {
                    data = JSON.parse(stdout);
                }
                catch (ex) {
                    err(ex);
                }

                for (var idx in data)
                {
                    var d = data[idx]; session.idx = d;
                }

                cb(null)

            });
        },

    ];

    async.waterfall(task, function (err) {
        if (err)
        {
            callback(false);
        }
        else
        {
            callback(true);
        }
    })
};