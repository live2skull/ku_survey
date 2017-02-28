angular.module('KU_SSO', [])

.factory('loginFactory', function ($http)
{
   return {
      // 서버에 아이디, 비밀번호 정보를 보냅니다.
      doUnsecureLogin : function (callback, userInfo)
      {
         $http({
            method: 'POST',
            url: '/api/SSOLogin',
            data: {secure: false, id : userInfo.id, pw : userInfo.pw}
         }).then(
             function (data) {
                var d = data.data;
                callback(d.result);
             },
             function () {
                return false;
             });
      },

      // portal 에서 ssoToken 을 가져온 뒤 서버로 토큰 정보를 보냅니다.
      // 도메인이 kuvey.korea.ac.kr 일 때만 가능함.
      doSecureLogin : function (callback, userInfo)
      {
         function sendSsoToken(ssoToken) {
            $http({
               method: 'POST',
               url: '/api/SSOLogin',
               // data: {secure: true, ssoToken: ssoToken}
               data: {secure: true}
            }).then(
             function (data) {
                var d = data.data;
                callback(d.result);
             },
             function () {
                return false;
             });
         }

         jQuery.ajax({
            type: "POST",
            url: 'https://portal.korea.ac.kr/common/Login.kpd',
            data: {id : userInfo.id, pw : userInfo.pw, direct_div : '', pw_pass : '', browser : 'chrome'},
            success: function () {},
            dataType: 'application/x-www-form-urlencoded'
            // 이 요청은 항상 실패합니다. ssotoken 을 이용해 로그인을 시도합니다.
         }).fail(function () {

            var ssotoken = getCookie('ssotoken');
            if (ssotoken == "") callback(false);

            sendSsoToken(ssotoken);

         });
      },

      doAgreement : function (callback) {
         $http({
            method: 'POST',
            url: '/api/SSOAgree',
            data: {agreement : true}
         }).then(
             function (data) {
                var d = data.data;
                callback(d.result);
             },
             function () {
                return false;
             });
      }
   }
});