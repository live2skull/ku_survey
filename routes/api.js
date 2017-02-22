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

const api_ssologin = require('./backend/ssologin')

const api_loadform = require('./backend/form/loadform');
const api_saveform = require('./backend/form/saveform');
const api_savesubmit = require('./backend/submit/savesubmit');
const api_loadsubmit = require('./backend/submit/loadsubmit');
const api_savecomment = require('./backend/comment/savecomment');
const api_loadcomment = require('./backend/comment/loadcomment');

router.post('/SSOLogin', function (req, res, next) {

    var id = req.body.id;
    var pw = req.body.pw;

    var callback = function (result) {

        res.send(JSON.stringify({result : result}));

    };

    api_ssologin.ssoLogin(callback, req.session, id, pw);

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
});

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