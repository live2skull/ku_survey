angular.module('kudoc')

.controller('surveylistController', function ($scope, surveyListFactory) {

    $scope.click = {};
    $scope.surveys = [];

    function getType()
    {
        var url = location.href;
        if (url.indexOf('list_ordinary') != -1) return 0;
        if (url.indexOf('list_department') != -1) return 1;
        if (url.indexOf('list_university') != -1) return 2;

        return null;
    }

    $scope.click.goAssign = function (survey_id)
    {
        location.href = '/student/assign/' + survey_id;
    };

    function callback_surveyList(result, data)
    {
        if (result)
        {
            $scope.surveys = data;
        }
        else
        {
            alert('Warning: 설문 리스트를 불러올 수 없음.');
        }
    }

    $scope.click.getSurveyList = function (pagnation, department) {
        var type = getType();
        if (type == null) { alert('Warning! page URL Information ERR!'); return }
        if (type == 0 || type == 1) pagnation = 0;

        surveyListFactory.listSurvey(type, false, pagnation, callback_surveyList);
    };

    function init() {
        $scope.click.getSurveyList();
    }

    init();

});