angular.module('kudoc')

.controller('listFormController', function ($scope, surveyListFactory) {

    $scope.surveys = [];
    $scope.click = {};
    $scope.solve = {};

    $scope.click.goCreate = function () {
        location.href = '/professor/create'
    };
    $scope.click.goEdit = function (survey_id) {
        location.href = '/professor/edit/' + survey_id;
    };
    $scope.click.getSurveyList = function () {
        surveyListFactory.listProfessorSurvey(callback_listSurvey, 3, null); // 모든 설문 불러오기
    };

    $scope.solve.getType = function (type) {
        switch (type)
        {
            case 0: return "상시상담";
            case 1: return "학과설문";
            case 2: return "학교설문";
        }
    };

    function callback_listSurvey(result, data)
    {
        if (result)
        {

        }
        else
        {
            alert('설문 리스트를 불러올 수 없습니다.')
        }
    }

    function init()
    {

        // $scope.surveys.push({
        //     survey_id : '157525834b26df1c59a224a38fb3e8d8',
        //     survey_name : '전자및정보공학과 상시상담학생설문지 기본서식',
        //     created_at : '2017-01-18',
        //     complete : true
        // })
    }

    init();
})