angular.module('kudoc')

// 교수 전용 페이지.
.controller('searchSubmitListController', function ($scope, surveyListFactory, submitListFactory) {

    $scope.click = {};
    $scope.solve = {};
    $scope.flag = {};

    $scope.survey_type = 0;
    $scope.searchFilter = "";

    $scope.select = {};
    $scope.select.survey_id = "";
    $scope.select.survey_title = ">> 먼저 설문을 선택하세요. <<";

    $scope.surveys = [];
    $scope.submits = [];

    function callback_listMySurvey(result, data) {
        if (result) // 성공
        {
            $scope.surveys = data;
        }
        else // 실패
        {
            alert('설문지 데이터 불러오기 실패.')
        }
    }
    function callback_listSubmit(result, data)
    {
        if (result) // 성공
        {
            $scope.submits = data;
        }
        else
        {
            alert('설문 참여자 데이터 불러오기 실패.')
        }
    }

    $scope.click.changeType = function () {
        var type = $scope.survey_type;

        // 본인이 작성한 설문지 양식 불러오기.
        surveyListFactory.listProfessorSurvey(callback_listMySurvey, type, null);
    };
    $scope.click.setSurvey = function (title, survey_id) {
        $scope.select.survey_id = survey_id;
        $scope.select.survey_title = title;

        submitListFactory.listSubmitProf(callback_listSubmit, survey_id);
    };
    $scope.click.resetFilter = function () {
        $scope.searchFilter = "";
    };
    $scope.click.goView = function (submit_id) {
        window.open('/professor/view/' + submit_id)
    };

    $scope.solve.getType = function (type) {
        switch (type)
        {
            case 0: return "상시상담";
            case 1: return "학과설문";
            case 2: return "학교설문";
        }
    };
    $scope.solve.getClosed = function (closed_at) {
        if (closed_at == "1970. 1. 1. 오전 9:00:00") return "정해지지 않음.";
        else return closed_at;
    };

    init();

    // unused.
    function patchViewport() {

        function resizeMe()
        {
            var win = $(window);
            var container = $('#main-container');

            var winHeight = win.height();
            container.height(winHeight - 180);
        }

        $(window).resize(resizeMe);
        resizeMe();
    }
    function init() {

        // patchViewport();
        // Patch! 무한 스크롤 가능하도록 함.

        $scope.survey_type = 0;
        surveyListFactory.listProfessorSurvey(callback_listMySurvey, 0, null);
    }
});