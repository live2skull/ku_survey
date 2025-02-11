var express = require('express');
var router = express.Router();

var helper = require('../mod/helper');
const DEBUG = helper.getBoolConfig('debug');

router.get('/', function(req, res, next) {

  // cors require 하여 사용
  // SSO 로그인을 사용 가능하도록 헤더 조작.
  // res.set({
  //   "Access-Control-Allow-Methods" : "POST, GET, OPTIONS, DELETE",
  //   "Access-Control-Max-Age": "3600",
  //   "Access-Control-Allow-Headers": "x-requested-with",
  //   "Access-Control-Allow-Origin": "portal.korea.ac.kr"
  // });

  res.render('login.jade', {DEBUG: DEBUG})

});


router.get('/test_entry', function (req, res, next) {

  res.render('login_test.jade')

});

// https://www.privacy.go.kr/a3sc/per/inf/perInfStep01.do

router.get('/join', function(req, res, next) {

  res.render('join.jade')
});


module.exports = router;
