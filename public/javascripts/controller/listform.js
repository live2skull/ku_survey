angular.module('kudoc')

.controller('listFormController', function ($scope) {

    $scope.surveys = [];
    $scope.click = {};

    $scope.click.goCreate = function () {
        location.href = '/professor/create'
    }

    $scope.click.goEdit = function (survey_id) {
        location.href = '/professor/edit/' + survey_id;
    };

    function init()
    {
        // miscFactory.loadDeps(loadDepsCallback)
        // TODO : dummy data

        $scope.surveys.push({
            survey_id : '157525834b26df1c59a224a38fb3e8d8',
            survey_name : '전자및정보공학과 상시상담학생설문지 기본서식',
            created_at : '2017-01-18',
            complete : true
        })
    }

    init();
})