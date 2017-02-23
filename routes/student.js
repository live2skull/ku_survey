var express = require('express');
var router = express.Router();

router.get('/list_ordinary', function(req, res, next) {
    res.render('student/list_ordinary')
});

router.get('/assign/:surveyId', function (req, res, next) {
    var survey_id = req.params.surveyId;
    res.render('student/assign', {survey_id : survey_id})
});


router.get('/statistics', function (req, res, next) {
    res.render('student/statistics_search')
});

router.get('/statistics/:surveyId', function (req, res, next) {

    var surveyId = Number(req.params.surveyId);
    if (isNaN(surveyId)) {res.status(404).send(); return;}

    res.render('student/statistics')
});



module.exports = router;


module.exports = router;
