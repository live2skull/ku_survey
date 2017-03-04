var express = require('express');
var router = express.Router();

const DEBUG = require('../config').DEBUG;

function DBG_MakeUserStudent(req, res) {
    // session set
    req.session.hak_number = 130012;
    req.session.hak_name = '나교수';
    req.session.user_id = 'proftest';
    req.session.hak_depart = '전자및정보공학과';
    req.session.hak_level = 1;

    // cookie set
    res.cookie('hak_number', 130012);
    res.cookie('hak_name' , '나교수');
    res.cookie('user_id', 'proftest');
    res.cookie('hak_depart', '전자및정보공학과');
    res.cookie('hak_level', 1)
}
function CHK_UserAuth(req, res) {
    var hak_level = req.session.hak_level;

    if (hak_level == undefined)
    {
        res.redirect('/');
        return false;
    }
    else if (hak_level == 0)
    {
        res.redirect('/list_submit');
        return false;
    }
    return true;
}

router.get('/debug_entry', function (req, res, next) {
    DBG_MakeUserStudent(req, res);
    res.redirect('/professor/list_submit');
});


router.get('/create', function(req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('professor/create', {mode : 'create'})
});

router.get('/edit/:surveyId', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;
    var survey_id = req.params.surveyId;

    res.render('professor/create', {survey_id : survey_id, mode : 'edit'})
});

router.get('/view/:submitId', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    var submit_id = req.params.submitId;
    res.render('professor/view', {submit_id : submit_id})
});

// 사용자 설문 보기 페이지 - /view

router.get('/statistics', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('professor/list_stat')
});

router.get('/statistics/:surveyId', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    var survey_id = req.params.surveyId;
    res.render('professor/statistics', { survey_id : survey_id })
});

router.get('/list_form', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('professor/list_form')
});

router.get('/list_submit', function (req, res, next) {
    if (DEBUG) DBG_MakeUserStudent(req, res);
    if (!CHK_UserAuth(req, res)) return;

    res.render('professor/list_student_submit')
});

// router.get('/statistics/:surveyId', function (req, res, next) {
//
//     var surveyId = Number(req.params.surveyId);
//     if (isNaN(surveyId)) {res.status(404).send(); return;}-
//
//     res.render('student/statistics')
// });



module.exports = router;
