angular.module('kudoc')

// Using :: list_ordinary_department_university, statistics
.controller('surveylistController', function ($scope, surveyListFactory, lv2sHelper) {

    $scope.click = {};
    $scope.func = {};
    $scope.surveys = [];
    $scope.flag = {};
    $scope.flag.showList = false;
    $scope.flag.showNothing = false;

    function getType()
    {
        var url = location.href;
        if (url.indexOf('list_ordinary') != -1) return 0;
        if (url.indexOf('list_department') != -1) return 1;
        if (url.indexOf('list_university') != -1) return 2;
        if (url.indexOf('statistics') != 1) return 3; // ALL! - 동작 방식은 동일합니다.

        return null;
    }

    $scope.func.getHeader = function () {
        var dmsg = "진행중인 ";
        switch (getType())
        {
            case 0:
                return dmsg + "상시상담 설문";
                break;
            case 1:
                return dmsg + "학과 설문";
                break;
            case 2:
                return dmsg + "학교 설문";
                break;
        }
    };

    $scope.checkValidateShow = function () {
        return $(window).width() > 480;
    };

    $scope.click.goAssign = function (survey_id)
    {
        location.href = '/student/assign/' + survey_id;
    };

    $scope.click.goStat = function (survey_id) {
        var level = Number(getCookie('hak_level'));

        switch (level)
        {
            case 0:
                location.href = '/student/statistics/' + survey_id;
                break;

            case 1:
                location.href = '/professor/statistics/' + survey_id;
                break;
        }
    };

    function callback_surveyList(result, data)
    {
        if (result)
        {
            if (data.length)
            {
                $scope.surveys = data;
                $scope.flag.showList = true;
            }
            else
            {
                $scope.flag.showNothing = true;
            }
        }
        else
        {
            alert('Warning: 설문 리스트를 불러올 수 없음.');
        }
    }

    // TODO : FUTURE UPDATE
    // 학과설문 (1) 다른 학과 데이터 불러오지 않음. (추후 지원 예정)
    $scope.click.getSurveyList = function (pagnation, department) {
        var type = getType();
        if (type == null) { alert('Warning! page URL Information ERR!'); return }
        if (type == 0 || type == 1) pagnation = 0;
        // pagnation => 추후 해당 기능 지원 예정.

        var show_closed = false;
        if (type == 3) show_closed = true;
        surveyListFactory.listSurvey(type, show_closed, pagnation, callback_surveyList);
    };

    function init() {
        $scope.click.getSurveyList();
    }

    init();

});