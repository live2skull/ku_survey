var express = require('express');
var router = express.Router();

router.get('/list_ordinary', function(req, res, next) {
    res.render('student/list_ordinary')
});

router.get('/assign/:surveyId', function (req, res, next) {
    var survey_id = req.params.surveyId;
    res.render('student/assign', {survey_id : survey_id})
});

// 통계 자료 보기 - 설문 리스트 보기
router.get('/statistics', function (req, res, next) {
    res.render('student/statistics')
});

// 통계 자료 보기
router.get('/statistics/:surveyId', function (req, res, next) {

    var surveyId = req.params.surveyId;
    res.render('student/statistics')
});

router.get('/submits', function (req, res, next) {

});

router.get('/submits/:submitId', function (req, res, next) {
    var submitId = req.params.submitId;
    res.render('student/view', {submit_id : submitId})
});

module.exports = router;


module.exports = router;
