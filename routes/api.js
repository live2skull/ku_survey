var express = require('express');
var router = express.Router();

const deepcopy = require('deepcopy');
const dbms = require('../mod/dbms');

/*
Warning:: Service DEBUG Flag!
disabled debug flag -> ignore authentication
*/

const DEBUG = require('../config').DEBUG;
// temporary disabled!s
// const SSO_UNSECURE = require('../config').SSO_UNSECURE;

var RES_FORBIDDEN = JSON.stringify({result : false, reason : 'AUTH'});
var RES_INTERNAL_ERR = JSON.stringify({result : false, reason : 'ERR'});

const api_ssologin = require('./backend/ssologin');

const api_loadform = require('./backend/form/loadform');
const api_saveform = require('./backend/form/saveform');

const api_savesubmit = require('./backend/submit/savesubmit');
const api_loadsubmit = require('./backend/submit/loadsubmit');
const api_listsurvey = require('./backend/survey/listsurvey');
const api_listsubmit = require('./backend/submit/listsubmit');
const api_checksubmit = require('./backend/submit/checksubmit');
const api_surveytime = require('./backend/survey/surveytime');

const api_savecomment = require('./backend/comment/savecomment');
const api_loadcomment = require('./backend/comment/loadcomment');

const api_loadstat = require('./backend/stat/loadstat');
const api_loadstatmeta = require('./backend/stat/statmeta');
const api_buildchart = require('./backend/stat/buildxlsx');

// INFO
/*

hak_number 학번
hak_name 이름
hak_depart 학과
hak_level 0 학생 1 교수
user_id Portal ID

* */

router.post('/logout', function (req, res, next) {
    if (!DEBUG) req.session.destroy();
    res.send(JSON.stringify({result : true}));
});

router.post('/SSOAgree', function (req, res, next) {
    var agreement = req.body.agreement;
    var userInfo = {};

    if (!agreement) { res.redirect('/'); return }

    function callback_ssoSave (conn, result) {
        conn.release();
        if (result)
        {
            // TODO Patch : 교수 로그인 과정 수정 필요
            // TODO 데이터 값 변형 (DPTNMLIST)
            var hak_number = userInfo.USERID;
            var GROUPNMLIST = userInfo.GROUPNMLIST;
            req.session.hak_number = hak_number; res.cookie('hak_number', hak_number);
            req.session.hak_name = userInfo.USERNAME; res.cookie('hak_name', userInfo.USERNAME);
            req.session.user_id = userInfo.UID; res.cookie('user_id', userInfo.UID);
            req.session.hak_depart = userInfo.DPTNMLIST; res.cookie('hak_depart', userInfo.DPTNMLIST);

            // 교수인 경우
            if (GROUPNMLIST.indexOf("교원") != -1 || GROUPNMLIST.indexOf("직원") != -1)
            {
                req.session.hak_level = 1;
                res.cookie('hak_level' , '1');
            }
            // 학생인 경우
            else
            {
                req.session.hak_level = 0;
                res.cookie('hak_level', '0');
            }
            //
            // if (hak_number.length == 6) // 교수
            // {
            //     req.session.hak_level = 1;
            //     res.cookie('hak_level', '1');
            // }
            // else if (hak_number.length == 10) // 학생
            // {
            //     req.session.hak_level = 0;
            //     res.cookie('hak_level', '0');
            // }

            res.send(JSON.stringify({result : true}));
        }
        else res.send(JSON.stringify({result : false}));
    };

    var callback_ssoLogin = function (result, uInfo) {
        if (result)
        {
            userInfo = deepcopy(uInfo);
            dbms.pool.getConnection(function (err, conn)
            {
                api_ssologin.ssoSave(conn, callback_ssoSave, userInfo);
            });
        }
        else
        {
            res.send(JSON.stringify({result : -1}));
        }
    };

    var ssoCookie = req.cookies.ssotoken;
    // var ssoCookie = req.body.ssotoken; // 이름 주의!
    if (ssoCookie == null || ssoCookie == undefined) res.send(JSON.stringify({result : false}));
    else api_ssologin.ssoLogin(callback_ssoLogin, req.session, ssoCookie);

});

router.post('/SSOLogin', function (req, res, next) {
    var userInfo = {};

    // DB 에 사용자 정보가 들어 있는가?
    var callback_ssoCheck = function (conn, result) {

        conn.release();

        switch (result)
        {
            // 아직 동의하지 않음.
            case 0:
                res.send(JSON.stringify({result : 0}));
                break;

            // 이미 동의함.
            case 1:
                // TODO Patch : 교수 로그인 데이터 수정 필요.

                // userInfo = deepcopy(uInfo);
                var hak_number = userInfo.USERID;
                var GROUPNMLIST = userInfo.GROUPNMLIST;

                req.session.hak_number = hak_number; res.cookie('hak_number', hak_number);
                req.session.hak_name = userInfo.USERNAME; res.cookie('hak_name', userInfo.USERNAME);
                req.session.user_id = userInfo.UID; res.cookie('user_id', userInfo.UID);
                req.session.hak_depart = userInfo.DPTNMLIST; res.cookie('hak_depart', userInfo.DPTNMLIST);

                // 교수인 경우
                if (GROUPNMLIST.indexOf("교원") != -1 || GROUPNMLIST.indexOf("직원") != -1)
                {
                    req.session.hak_level = 1;
                    res.cookie('hak_level' , '1');
                }
                // 학생인 경우
                else
                {
                    req.session.hak_level = 0;
                    res.cookie('hak_level', '0');
                }

                // if (hak_number.length == 6) // 교수
                // {
                //     req.session.hak_level = 1;
                //     res.cookie('hak_level', '1');
                // }
                // else if (hak_number.length == 10) // 학생
                // {
                //     req.session.hak_level = 0;
                //     res.cookie('hak_level', '0');
                // }
                res.send(JSON.stringify({result : 1}));
                break;

            default:
                res.send(JSON.stringify({result : -1}));
        }
    };

    // 로그인 시도 결과
    var callback_ssoLogin = function (result, uInfo) {
        if (result)
        {
            userInfo = deepcopy(uInfo);

            dbms.pool.getConnection(function (err, conn)
            {
                api_ssologin.ssoCheck(conn, callback_ssoCheck, userInfo);
            });
        }
        else
        {
            res.send(JSON.stringify({result : -1}));
        }
    };

    // 로그인 시도
    var id = req.body.id;
    var pw = req.body.pw;
    var secure = req.body.secure;

    switch (secure)
    {
        case true:
            var ssoCookie = req.cookies.ssotoken;
            // var ssoCookie = req.body.ssotoken; // 이름 주의!
            if (ssoCookie == null || ssoCookie == undefined) res.send(JSON.stringify({result : -1}));
            else api_ssologin.ssoLogin(callback_ssoLogin, req.session, ssoCookie);
            break;

        case false:
            if (DEBUG) api_ssologin.ssoLogin(callback_ssoLogin, req.session, false, id, pw);
            // else if (id == 'testweb') api_ssologin.ssoLogin(callback_ssoLogin, req.session, false, id, pw);
            else res.send(JSON.stringify({result : -1}));
            break;

        default:
            res.send(JSON.stringify({result : -1}));
    }
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

router.post('/checkform', function (req, res, next) {
    var survey_id = req.body.survey_id;

    dbms.pool.getConnection(function (err, conn) {

        var callback_checkFormData = function (result) {
            conn.release();
            if (result) res.send(JSON.stringify({result : true}));
            else res.send(JSON.stringify({result : false, reason : '이미 이 설문지에 대한 응답이 있으므로, 설문을 저장할 수 없습니다.'}));
        };

        api_saveform.checkExistFormData(conn, callback_checkFormData, survey_id);
    });
})

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

            var callback_checkFormData = function (result)
            {
                if (result) api_saveform.saveForm(conn, callback_saveForm, doc, req.session.user_id);
                else {
                    res.send(JSON.stringify({result : false, reason : '이미 이 설문지에 대한 응답이 있으므로, 설문을 저장할 수 없습니다.'}));
                    conn.rollback(function (err) {
                        conn.release();
                    })
                }
            };

            var callback_saveForm = function (result, survey_id) {
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

            var survey_id = doc.survey_id;
            if (survey_id != "") api_saveform.checkExistFormData(conn, callback_checkFormData, survey_id);
            else api_saveform.saveForm(conn, callback_saveForm, doc, req.session.user_id)

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
                    if (isNaN(submit_id)) res.send(JSON.stringify({result : false}));
                    else res.send(JSON.stringify({result : false, reason : err}));
                    conn.rollback(function (err) {
                        conn.release();
                    })
                }
            };

            api_savesubmit.saveSubmit(conn, cb, doc, req.session.user_id);

        });
    });
}); // OK

// 이미 설문에 참여했는지 검증하기 - NON DEBUG
router.post('/checkassignedsubmit', function (req, res, next) {

    var user_id = req.session.user_id;
    if (user_id == undefined) { res.send(JSON.stringify({result : false})); return }

    var survey_id = req.body.survey_id;

    dbms.pool.getConnection(function (err, conn) {

       function callback(result)
       {
           conn.release();
           res.send(JSON.stringify({result : result}))
       }

      if (err) res.send(JSON.stringify({result : false}));

       api_checksubmit.checkAssignedSubmit(conn, callback, user_id, survey_id);

   });
});

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
        req.session.hak_depart = '전자및정보공학과';
    }

    var type = Number(req.body.type);

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
        var hak_level = req.session.hak_level;
        var user_id = req.session.user_id;
        var show_closed = req.body.show_closed;
        var pagnation = req.body.pagnation;

        // hak_level 을 구분한 것은 교수의 경우 closed 된 것을 볼 수 있기 위함 (?)
        // 그런데 어차피, stat 출력을 위해서는 closed 된 것도 보아야 한다
        // 그러면 hak_level 이 아닌 closed_list 를 사용하는 것도 방법인 듯?
        // closed 컬럼을 true, false 가 아닌 시간을 지정하는 것도 방법임.
        if (hak_level == 0)
        {
            switch (type)
            {
                case 0: // 상시상담
                    // 본인 학과에 맞는 설문. 추후 수정할 수 있다.
                    api_listsurvey.listSurveyStudent(conn, callback, 0, department, show_closed, pagnation);
                    break;

                case 1: // 학과설문
                    api_listsurvey.listSurveyStudent(conn, callback, 1, department, show_closed, pagnation);
                    break;

                case 2: // 학교설문 :: 그냥 type 이 2 인 전체를 뽑으면 된다. (학교설문이므로 과를 가릴 필요 없음)
                    api_listsurvey.listSurveyStudent(conn, callback, 2, null, show_closed, pagnation);
                    break;

                case 3:
                    api_listsurvey.listSurveyStudent(conn, callback, 3, null, show_closed, null); // ALL!
                    break;

                default:
                    conn.release();
                    res.send(RES_FORBIDDEN);
            }
        }
        else if (hak_level == 1 && show_closed)
        {
            api_listsurvey.listSurveyStudent(conn, callback, 3, null, show_closed, null);
        }
        else if (hak_level == 1)
        {
            api_listsurvey.listSurveyProfessor(conn, callback, type, user_id, null, null);
        }
        else
        {
            conn.release();
            res.send(RES_FORBIDDEN);
        }

    });

});

router.post('/listsubmit', function (req, res, next) {
    dbms.pool.getConnection(function (err ,conn) {

        var callback = function (result, data) {
            conn.release();
            if (result) {
                res.send(JSON.stringify({result: true, data: data}))
            }
            else {
                res.send(JSON.stringify({result: false}))
            }
        };

        var user_id = req.session.user_id;
        var hak_level = Number(req.cookies.hak_level);

        switch (hak_level)
        {
            case 0:
                // 내가 지금까지 설문한 전체 데이터
                api_listsubmit.listSubmit_Student(conn, callback, user_id);
                break;

            case 1:
                // TODO :: 사용 용도 ???
                // 본인이 작성한 설문에 대한 전체 데이터 ->>> 사용 안함!
                // >>> 사용함. survey_id 추가.
                var survey_id = req.body.survey_id;
                api_listsubmit.listSubmit_Professor(conn, callback, user_id, survey_id);
                break;

            default:
                res.send(JSON.stringify({result: false}))
        }
    });
});

// ************************************************************************************

router.post('/loadstat', function (req, res, next) {

    var survey_id = req.body.survey_id;
    var filter_year = req.body.filter_year;
    var filter_grade = req.body.filter_grade;

    dbms.pool.getConnection(function (err, conn) {

        var callback = function (result, data)
        {
            conn.release();
            if (result) res.send(JSON.stringify({result : result, data : data}));
            else res.send(JSON.stringify({result : result}))
        };

        api_loadstat.loadStat(conn, callback, survey_id, filter_year, filter_grade);

    });
});

router.post('/loadstatfile', function (req, res, next) {

    var survey_id = req.body.survey_id;
    var filter_year = req.body.filter_year;
    var filter_grade = req.body.filter_grade;

    dbms.pool.getConnection(function (err, conn) {

        var data_stat = [];
        var data_form = [];

        var callback_buildXLSXFile = function (result, path)
        {
            if (result) res.send(JSON.stringify({result : true, path : path}));
            else res.send(JSON.stringify({result : false}));
        };

        var callback_loadform = function (result, data)
        {
            conn.release();
            if (result)
            {
                data_form = data;
                api_buildchart.buildXLSXFile(callback_buildXLSXFile, req.session.user_id, data_stat, data_form, filter_year, filter_grade);
            }
            else
            {
                res.send(JSON.stringify({result : false}));
            }
        };

        var callback_loadstat = function (result, data)
        {
            if (result)
            {
                data_stat = data;
                api_loadform.loadForm(conn, callback_loadform, survey_id);
                //res.send(JSON.stringify({result : result, data : data}));
            }
            else
            {
                conn.release();
                res.send(JSON.stringify({result : false}))
            }
        };

        api_loadstat.loadStat(conn, callback_loadstat, survey_id, filter_year, filter_grade);

    });

})

// ************************************************************************************

router.post('/surveytime', function (req, res, next) {

    if (req.session.hak_level != 1) {res.send(JSON.stringify({result : false})); return }

    dbms.pool.getConnection(function (err, conn) {

        function callback_surveytime(result)
        {
            conn.release();
            res.send(JSON.stringify({result : result}));
        }

        if (err) { conn.release(); res.send(JSON.stringify({result : false})); }
        var reset = req.body.reset;
        var survey_id = req.body.survey_id;
        if (reset) api_surveytime.setSurveyTime(conn, callback_surveytime, survey_id, reset);
        else api_surveytime.setSurveyTime(conn, callback_surveytime, survey_id, false, req.body.started_at, req.body.closed_at);
    });
})

router.post('/loadstatmeta', function (req, res, next) {

    dbms.pool.getConnection(function (err, conn) {

        function callback_getMeta(result, data) {
            conn.release();
            if (result) res.send(JSON.stringify({result : true, data : data}));
            else res.send(JSON.stringify({result : false}));
        }

        if (err) { conn.release(); res.send(JSON.stringify({result : false})); }

        var survey_id = req.body.survey_id;
        api_loadstatmeta.loadStatMeta(conn, callback_getMeta, survey_id);
    })
})



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