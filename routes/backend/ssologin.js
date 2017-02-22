const async = require('async');
const child_process = require('child_process');
const deepcopy = require('deepcopy');
const request = require('request');

exports.ssoLogin = function (callback, id, pw)
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
                        cb(-1);
                    }
                }
            })
        },

        function (ssoToken, cb)
        {
            // java -cp SIServerAPI.4.3.jar;. TestSso

            var jarpath = process.env.PWD + '/sso/SIServerAPI.4.3.jar';
            var ssopath = process.env.PWD + '/sso/TestSso';

            var fullpath = 'java -cp ' + jarpath + ';. ' + ssopath

            child_process.exec(path, {}, function (err, stdout, stderr) {
                if (err) { cb(err); return }
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
            callback(true);
        }
    })
};