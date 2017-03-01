angular.module('kudoc')

.controller('navbarCtrl', function ($scope, sessionFactory) {

    $scope.click = {};
    $scope.checkURL = function (chk)
    {
        var url = location.href;
        url = url.substring(url.indexOf('//') + 2);
        url = url.substring(url.indexOf('/'));

        return url.indexOf(chk) != -1
    };

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