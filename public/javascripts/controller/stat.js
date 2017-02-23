angular.module('kudoc')

.controller('statController', function ($scope, $http) {

    $scope.click = {};
    $scope.click.loadStat = function (survey_id)
    {

    };

    function init()
    {
        $http({
            method : 'POST',
            url : '/api/loadstat',
            data : {survey_id : 'fcf0498400fe802b1737f18a056e4db4'}
        }).then(
            function (data) {
                var d = data.data;
                var result = d.result;
                if (!result) {
                    alert('로그인에 실패했습니다.\n아이디와 비밀번호를 확인해 주세요.')
                }
                else {
                    switch (d.hak_level)
                    {
                        case 0: // 학생
                            location.href = '/student/list_ordinary';
                            break;

                        case 1: // 교수
                            location.href = '/professor/list';
                            break;
                    }
                }
            },

            function (err)
            {
                alert('로그인에 실패했습니다.\n아이디와 비밀번호를 확인해 주세요.')
            }
        )
    }

    init();

})