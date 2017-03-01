var express = require('express');
var router = express.Router();

const DEBUG = require('../config').DEBUG;

function DBG_MakeUserStudent(req, res) {
    // session set
    req.session.hak_number = 2016270501;
    // req.session.hak_name = '양해찬';
    req.session.hak_name = '테스트계정';
    // req.session.user_id = 'l2ttlebit';
    req.session.user_id = 'testuser';
    req.session.hak_depart = '전자및정보공학과';
    req.session.hak_level = 0;

    // cookie set
    res.cookie('hak_number', 2016270501);
    res.cookie('hak_name' , '테스트계정');
    // res.cookie('hak_name' , '양해찬');
    res.cookie('user_id', 'testuser');
    // res.cookie('user_id', 'l2ttlebit');
    res.cookie('hak_depart', '전자및정보공학과');
    res.cookie('hak_level', 0)
}
function CHK_UserAuth(req, res) {
    var hak_level = req.session.hak_level;

    if (hak_level == undefined)
    {
        res.redirect('/');
        return false;
    }
    else if (hak_level == 1)
    {
        res.redirect('/list_ordinary');
        return false;
    }
    return true;
}

router.get('/list_ordinary', function(req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('student/list_surveys');
});

// TODO 수정 필요.
router.get('/list_department', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('student/list_surveys');
});

router.get('/list_university', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('student/list_surveys');
});

// ************************************************************************************

router.get('/assign/:surveyId', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    var survey_id = req.params.surveyId;
    res.render('student/assign', {survey_id : survey_id, hak_name : req.session.hak_name, hak_number : req.session.hak_number})
});

// ************************************************************************************

// 통계 자료 보기 - 설문 리스트 보기
router.get('/statistics', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('student/list_stat')
});

// 통계 자료 보기
router.get('/statistics/:surveyId', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    var survey_id = req.params.surveyId;
    res.render('student/statistics', { survey_id : survey_id })
});

// ************************************************************************************

router.get('/submits', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('student/mysubmit')
});

router.get('/submits/:submitId', function (req, res, next) { // OK!
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    var submitId = req.params.submitId;

    res.render('student/view', {submit_id : submitId})
});

module.exports = router;
