angular.module('kudoc')

.controller('loginController', function ($scope, $http) {

    $scope.login = {};
    $scope.click = {};

    $scope.click.startLogin = function () {

        if ($scope.login.id == '' && $scope.login.pw == '') return;

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
        )};

    function init()
    {
        $("#login_id").keyup(function(event){
            if(event.keyCode == 13){
                $scope.click.startLogin();
            }
        });

        $("#login_pw").keyup(function(event){
            if(event.keyCode == 13){
                $scope.click.startLogin();
            }
        });

        $scope.login.id = '';
        $scope.login.pw = '';
    }

    init();

});