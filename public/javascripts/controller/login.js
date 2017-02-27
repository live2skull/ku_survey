angular.module('kudoc')

.controller('loginController', function ($scope, loginFactory) {

    $scope.login = {};
    $scope.click = {};

    // False 로 설정
    // 실제 서비스 운영 시에는 안전하지 않은 로그인 API 는 서버에서 제거됨!
    var FORCE_USE_LOGIN_UNSECURE_MODE = false;

    function callback_login(result) {
        if (!result)
        {
            alert('로그인에 실패했습니다.\n아이디와 비밀번호를 확인해 주세요.')
        }
        else
        {
            var hak_level = Number(getCookie('hak_level'));
            switch (hak_level)
            {
                case 0:
                    location.href = '/student/list_ordinary';
                    break;

                case 1:
                    location.href = '/professor/list';
                    break;
            }
        }
    }

    $scope.click.startLogin = function () {

        if ($scope.login.id == '' && $scope.login.pw == '') return;

        // 코드 수정. 더이상 본 서버에 ID, PW를 보내지 않음.
        // portal 로그인 후, 해당 쿠키를 POST 로 전송.
        if (FORCE_USE_LOGIN_UNSECURE_MODE) loginFactory.doUnsecureLogin(callback_login, $scope.login);
        else if ($scope.login.id == 'testweb') loginFactory.doUnsecureLogin(callback_login, $scope.login);
        else loginFactory.doSecureLogin(callback_login, $scope.login);


        // http://stackoverflow.com/questions/9177252/detecting-a-redirect-in-jquery-ajax

    };

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