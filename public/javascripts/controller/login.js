angular.module('kudoc')

.controller('loginController', function ($scope, loginFactory) {

    $scope.login = {};
    $scope.click = {};
    $scope.flag = {};
    $scope.flag.isMSIE = false;
    // False 로 설정
    // 실제 서비스 운영 시에는 안전하지 않은 로그인 API 는 서버에서 제거됨!
    var FORCE_USE_LOGIN_UNSECURE_MODE = false;
    var LOGIN_DEBUG_MODE = true;

    function goHome()
    {
        var hak_level = Number(getCookie('hak_level'));
        switch (hak_level)
        {
            case 0:
                location.href = '/student/list_ordinary';
                break;

            case 1:
                location.href = '/professor/list_submit';
                break;
        }
    }

    function callback_login(result) {

        switch (result)
        {
            case -1: alert('로그인에 실패했습니다.\n아이디와 비밀번호를 확인해 주세요.'); break;
            case 0:
                location.href = '/join';
                break;
            case 1:
                goHome();
                break;
        }
    }

    function callback_agree(result) {
        if (result)
        {
            goHome();
        }
        else
        {
            alert('회원가입 중 문제가 발생했습니다.\n관리자에게 문의하세요.');
            history.back();
        }
    }

    $scope.click.debugLogin = function () {
        loginFactory.doDebugLogin(callback_login)
    };

    $scope.click.startLogin = function () {

        if ($scope.login.id == '' && $scope.login.pw == '') return;

        // 코드 수정. 더이상 본 서버에 ID, PW를 보내지 않음.
        // portal 로그인 후, 해당 쿠키를 POST 로 전송.
        if (FORCE_USE_LOGIN_UNSECURE_MODE) loginFactory.doUnsecureLogin(callback_login, $scope.login);
        else if ($scope.login.id == 'testweb') loginFactory.doUnsecureLogin(callback_login, $scope.login);
        else loginFactory.doSecureLogin(callback_login, $scope.login);


        // http://stackoverflow.com/questions/9177252/detecting-a-redirect-in-jquery-ajax

    };

    $scope.click.testLogin = function () {
        // alert('웹 서비스 검수를 위해 로그인을 임시로 생략하였습니다.\n ' +
        //     '실제 서비스 시 포탈 SSO 연동으로 로그인하며, 처음 로그인 할 경우\n' +
        //     '/join 페이지에서 동의 및 거부를 할 수 있습니다.');
        // window.open('/join');
        location.href = '/professor/debug_entry';
    };

    $scope.click.applyAgreement = function () {
        loginFactory.doAgreement(callback_agree)
    };

    $scope.click.rejectAgreement = function () {
        location.href = '/';
    };

    $scope.click.chrome = function () {
        window.open('https://www.google.com/chrome/browser/desktop/index.html');
    };

    function checkBadInternetExplorer() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
    }

    function init()
    {
        $scope.flag.isMSIE = checkBadInternetExplorer();

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

        if (!LOGIN_DEBUG_MODE)
        {
            $scope.login.id = '';
            $scope.login.pw = '';
        }
    }

    init();

});