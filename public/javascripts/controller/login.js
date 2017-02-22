angular.module('kudoc')

.controller('loginController', function ($scope, $http) {

    $scope.login = {};

    $scope.click = {};
    $scope.click.startLogin = function () {

        $http({
            method : 'POST',
            url : '/api/SSOLogin',
            data : $scope.login
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
                            location.href = '/student/list';
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

})