var express = require('express');
var router = express.Router();


router.get('/create', function(req, res, next) {
    // ****************************
    // tmeporary session initializtion
    req.session.userId = 'admin';
    req.session.userType = 1;
    // ****************************

    res.render('professor/create', {mode : 'create'})
});

router.get('/edit/:surveyId', function (req, res, next) {

    // ****************************
    // Temporary SESSION INITIALIZTION
    req.session.userId = 'admin';
    req.session.userType = 1;
    // ****************************
    var survey_id = req.params.surveyId;

    res.render('professor/create', {survey_id : survey_id, mode : 'edit'})
});

router.get('/view/:submitId', function (req, res, next) {

    var submit_id = req.params.submitId;
    res.render('professor/view', {submit_id : submit_id})
});

// 사용자 설문 보기 페이지 - /view

router.get('/statistics', function (req, res, next) {
    res.render('student/statistics_search')
});

router.get('/list_form', function (req, res, next) {
    res.render('professor/list_form')
});

router.get('/list_submit', function (req, res, next) {
    res.render('professor/list_submit')
});

// router.get('/statistics/:surveyId', function (req, res, next) {
//
//     var surveyId = Number(req.params.surveyId);
//     if (isNaN(surveyId)) {res.status(404).send(); return;}
//
//     res.render('student/statistics')
// });



module.exports = router;


module.exports = router;
