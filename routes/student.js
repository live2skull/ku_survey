var express = require('express');
var router = express.Router();

// const connection = require('../mod/dbms').mongoose_connection;
// var schema = require('../schema');

//
// var SurveyModel = connection.model('', schema.surveyModelSchema);

//


router.get('/list', function(req, res, next) {
    res.render('student/list')
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
