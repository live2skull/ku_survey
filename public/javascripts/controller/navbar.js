angular.module('kudoc')

.controller('navbarCtrl', function ($scope, sessionFactory) {

    $scope.click = {};
    function checkValidateShow() {
        return $(window).width() > 480;
    };
    $scope.checkURL = function (chk)
    {
        var url = location.href;
        url = url.substring(url.indexOf('//') + 2);
        url = url.substring(url.indexOf('/'));

        return url.indexOf(chk) != -1
    };
    $scope.resolveTitle = function () {
        if (checkValidateShow()) return "고려대학교 세종캠퍼스 온라인 학생설문시스템";
        else return "고려대학교 온라인 학생설문시스템"
    }

    function callback_logout () {
        location.href = '/';
    }

    $scope.click.logout = function () {
        if (confirm('로그아웃 하시겠습니까?')) sessionFactory.doLogout(callback_logout)
    };

    function init()
    {
        $scope.user = decodeURIComponent(getCookie('hak_name'));
    }

    init();
});