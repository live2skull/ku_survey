angular.module('kudoc')

.controller('navbarCtrl', function ($scope) {

    $scope.click = {};
    $scope.checkURL = function (chk)
    {
        var url = location.href;
        url = url.substring(url.indexOf('//') + 2);
        url = url.substring(url.indexOf('/'));

        return url.indexOf(chk) != -1
    };

    $scope.click.logout = function () {

    };

    function init()
    {
        $scope.user = decodeURIComponent(getCookie('hak_name'));
    }

    init();
});