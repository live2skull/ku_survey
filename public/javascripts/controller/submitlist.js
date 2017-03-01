angular.module('kudoc')

.controller('submitListController', function ($scope, submitListFactory) {
    $scope.click = {};
    $scope.flag = {};
    $scope.submits = [];

    $scope.flag.isAvaliable = true;
    // data 에서 원하는 정보 추출.
    function callback_submitList(result, data) {
        if (result)
        {
            if (!data.length) { // 데이터 없음
                $scope.flag.isAvaliable = false;
            }
            else
            {
                $scope.flag.isAvaliable = true;
                $scope.submits = data;
            }
        }
        else
        {
            alert("Warning:: 정보를 가져오는 동안 오류가 발생했습니다.")
        }
    }

    $scope.checkValidateShow = function () {
        return $(window).width() > 480;
    };

    // TODO :: 교수 버전 지원
    // stat 과 같이 학생, 교수의 API 파일을 통일합니다.
    $scope.click.getSurveyList = function () {
        var hak_level = Number(getCookie('hak_level'));

        switch (hak_level)
        {
            case 0:
                submitListFactory.listSubmitStud(callback_submitList);
                break;

            case 1:
                // ... more arguments >> 고급 검색 기능 사용!
                submitListFactory.listSubmitProf(callback_submitList);
                break;
        }
    };
    $scope.click.goView = function (submit_id) {
        var hak_level = Number(getCookie('hak_level'));
        switch (hak_level)
        {
            case 0:
                location.href = '/student/submits/' + submit_id;
                break;

            case 1:
                location.href = '/professor/submits/' + submit_id;
                break;
        }
    };

    function init()
    {
        $scope.click.getSurveyList();
    }

    init();
});