var express = require('express');
var router = express.Router();

const deepcopy = require('deepcopy');
const dbms = require('../mod/dbms');

/*
Warning:: Service DEBUG Flag!
disabled debug flag -> ignore authentication
*/

const DEBUG = require('../config').DEBUG;

var RES_FORBIDDEN = JSON.stringify({result : false, reason : 'AUTH'});
var RES_INTERNAL_ERR = JSON.stringify({result : false, reason : 'ERR'});

const api_ssologin = require('./backend/ssologin');

const api_loadform = require('./backend/form/loadform');
const api_saveform = require('./backend/form/saveform');

const api_savesubmit = require('./backend/submit/savesubmit');
const api_loadsubmit = require('./backend/submit/loadsubmit');
const api_listsurvey = require('./backend/survey/listsurvey');

const api_savecomment = require('./backend/comment/savecomment');
const api_loadcomment = require('./backend/comment/loadcomment');

router.post('/SSOLogin', function (req, res, next) {

    var id = req.body.id;
    var pw = req.body.pw;

    var callback_ssoVerify = function (conn, result, hak_level) {
        if (result)
        {
            res.send(JSON.stringify({result : true, hak_level : hak_level}));
            conn.commit(function (err)
            {
                conn.release();
            })
        }
        else
        {
            res.send(JSON.stringify({result : false}));
            conn.rollback(function (err)
            {
                conn.release();
            })
        }

    };

    var callback_ssoLogin = function (result, userInfo) {

        if (result)
        {
            var hak_number = userInfo.USERID;

            req.session.hak_number = hak_number;
            req.session.hak_name = userInfo.USERNAME;
            req.session.user_id = userInfo.UID;
            req.session.hak_depart = userInfo.DTPNM;

            if (hak_number.length == 6) // 교수
            {
                req.session.hak_level = 1;
            }
            else if (hak_number.length == 10) // 학생
            {
                req.session.hak_level = 0;
            }
            else
            {
                console.log('Warning:: Unknown hak_level information.')
            }


            dbms.pool.getConnection(function (err, conn)
            {
               conn.beginTransaction(function (err) {
                   api_ssologin.ssoVerify(conn, callback_ssoVerify, userInfo)
               });
            });
        }
        else
        {
            res.send(JSON.stringify({result : false}));
        }

    };

    api_ssologin.ssoLogin(callback_ssoLogin, req.session, id, pw);

});

// ************************************************************************************

// 설문지 양식 불러오기
router.post('/loadform', function (req, res, next) {
    if (!DEBUG)
    {

    }

    var survey_id = req.body.survey_id;

    dbms.pool.getConnection(function (err, conn) {
        if (err)
        {
            res.send(JSON.stringify({result : false, reason : 'getConnection Failed.'}));
            conn.release(); return
        }

        var cb = function (result, form) {
            switch (result)
            {
                case -1: // error
                    res.status(500).send(JSON.stringify(RES_INTERNAL_ERR)); break;
                case 0: // cannot found
                    res.send(JSON.stringify({result : false})); break;
                case 1: // ok!
                    res.send(JSON.stringify({result : true, form: form})); break;
            }
            conn.release();
        };

        api_loadform.loadForm(conn, cb, survey_id)
    });

}); // OK

// 설문지 양식 저장하기 (새로 만들기, 수정)
router.post('/saveform', function (req, res, next) {
    if (!DEBUG)
    {

    }
    if (DEBUG)
    {
        req.session.user_id = 'admin';
    }

    var doc = req.body;

    dbms.pool.getConnection(function (err, conn) {
        conn.beginTransaction(function (err) {
            if (err)
            {
                res.send(JSON.stringify({result : false, reason : 'beginTransaction Failed.'}));
                conn.release(); return
            }
            var cb = function (result, survey_id) {
                if (result === true)
                {
                    res.send(JSON.stringify({result : true, survey_id : survey_id}));
                    conn.commit(function (err) {
                        conn.release();
                    })
                }
                else
                {
                    res.send(JSON.stringify({result : false}));
                    conn.rollback(function (err) {
                        conn.release();
                    })
                }
            };

            api_saveform.saveForm(conn, cb, doc, req.session.user_id)


        });
    });
}); // OK

// ************************************************************************************

// 설문 데이터 불러오기
router.post('/loadsubmit', function (req, res, next) {
    if (!DEBUG)
    {

    }

    var submit_id = req.body.submit_id;

    dbms.pool.getConnection(function (err, conn) {
        conn.beginTransaction(function (err) {
            if (err)
            {
                res.send(JSON.stringify({result : false, reason : 'beginTransaction Failed.'}));
                conn.release(); return
            }
            var cb = function (result, form) {
                if (result === true)
                {
                    res.send(JSON.stringify({result : true, form : form}));
                    conn.commit(function (err) {
                        conn.release();
                    })
                }
                else
                {
                    res.send(JSON.stringify({result : false}));
                    conn.rollback(function (err) {
                        conn.release();
                    })
                }
            };

            // api_saveform.saveForm(req, res, conn, cb, doc)
            api_loadsubmit.loadSubmit(conn, cb, submit_id);

        });
    });
}); // OK

// 설문 데이터 저장하기
router.post('/savesubmit', function (req, res, next) {
    if (!DEBUG)
    {

    }
    if (DEBUG)
    {
        req.session.user_id = 'student_tester'
    }

    var doc = deepcopy(req.body);

    dbms.pool.getConnection(function (err, conn) {
        conn.beginTransaction(function (err) {
            if (err)
            {
                res.send(JSON.stringify({result : false, reason : 'beginTransaction Failed.'}));
                conn.release(); return
            }
            var cb = function (result, submit_id) {
                if (result === true)
                {
                    res.send(JSON.stringify({result : true, submit_id : submit_id}));
                    conn.commit(function (err) {
                        conn.release();
                    })
                }
                else
                {
                    res.send(JSON.stringify({result : false}));
                    conn.rollback(function (err) {
                        conn.release();
                    })
                }
            };

            api_savesubmit.saveSubmit(conn, cb, doc, req.session.user_id);

        });
    });
}); // OK

// ************************************************************************************

// 설문의 코멘트 불러오기
router.post('/loadcomment', function (req, res, next) {
    if (!DEBUG)
    {

    }

    var submit_id = req.body;

    dbms.pool.getConnection(function (err, conn) {
        conn.beginTransaction(function (err)
        {
            if (err)
            {
                res.send(JSON.stringify({result : false, reason : 'beginTransaction Failed.'}));
                conn.release(); return
            }

            var cb = function (result, data) {
                if (result === true)
                {
                    res.send(JSON.stringify({result : true, data : data}));
                    conn.commit(function (err) {
                        conn.release();
                    })
                }
                else
                {
                    res.send(JSON.stringify({result : false}));
                    conn.rollback(function (err) {
                        conn.release();
                    })
                }
            };

            api_loadcomment.loadComment(conn, cb, submit_id);

        });

    });
}); // OK

// 설문의 코멘트 저장하기
router.post('/savecomment', function (req, res, next) {
    if (!DEBUG)
    {

    }
    if (DEBUG)
    {
        req.session.user_id = 'professor_test'
    }

    // submit_id , comment
    var rparam = req.body;

    dbms.pool.getConnection(function (err, conn) {
        conn.beginTransaction(function (err)
        {
            if (err)
            {
                res.send(JSON.stringify({result : false, reason : 'beginTransaction Failed.'}));
                conn.release(); return
            }

            var cb = function (result) {
                if (result === true)
                {
                    res.send(JSON.stringify({result : true}));
                    conn.commit(function (err) {
                        conn.release();
                    })
                }
                else
                {
                    res.send(JSON.stringify({result : false}));
                    conn.rollback(function (err) {
                        conn.release();
                    })
                }
            };

            api_savecomment.saveComment(conn, cb, rparam);

        });

    });

});

// ************************************************************************************

router.post('/listsurvey', function(req, res, next) {

    if (DEBUG)
    {

    }

    var type = Number(req.body.type);
    var show_closed = req.body.hide_closed;

    if (type == null || type == undefined)
    {
        res.status(500).send(JSON.stringify({result : false}));
        return;
    }

    dbms.pool.getConnection(function (err ,conn) {

        var callback = function (result, data)
        {
            if (result)
            {
                res.send(JSON.stringify({result : true, data : data}))
            }
            else
            {
                res.send(JSON.stringify({result : false}))
            }
        };

        var department = req.session.hak_depart;
        //var hak_level = req.session.hak_level;

        // hak_level 을 구분한 것은 교수의 경우 closed 된 것을 볼 수 있기 위함 (?)
        // 그런데 어차피, stat 출력을 위해서는 closed 된 것도 보아야 한다
        // 그러면 hak_level 이 아닌 closed_list 를 사용하는 것도 방법인 듯?
        // closed 컬럼을 true, false 가 아닌 시간을 지정하는 것도 방법임.
        switch (type)
        {
            case 0: // 상시상담
                // 본인 학과에 맞는 설문. 추후 수정할 수 있다.
                api_listsurvey.listSurvey(conn, callback, 0, department, show_closed);
                break;

            case 1: // 학과설문
                api_listsurvey.listSurvey(conn, callback, 1, department, show_closed);
                break;

            case 2: // 학교설문 :: 그냥 type 이 2 인 전체를 뽑으면 된다. (학교설문이므로 과를 가릴 필요 없음)
                api_listsurvey.listSurvey(conn, callback, 2, null, show_closed);
                break;

            default:
                conn.release();
                res.send(RES_FORBIDDEN);
        }
    });

});

// ************************************************************************************


// Malicious!!!
// 학사구조 불러오기
router.post('/loadstruct', function (req, res, next) {
    if (!DEBUG)
    {

    }
});

// 학사구조 저장하기
router.post('/savestruct', function (req, res, next) {
    if (!DEBUG)
    {

    }
});

// ************************************************************************************

module.exports = router;