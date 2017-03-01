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
                callback(d.result);
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
               data: {secure: true, ssoToken: ssoToken}
               // data: {secure: true}
            }).then(
             function (data) {
                var d = data.data;
                callback(d.result);
             },
             function () {
                callback(false);
             });
         }

         var before_portal = !(getCookie('PORTAL_SESSIONID') == "");

         function callback_loaded() {
            var ssotoken = getCookie('ssotoken');
            var portal_sessionid = getCookie('PORTAL_SESSIONID');

            if (loginWindow.closed)
            {
                console.log('SSOLogin Failed : loginWindow closed.');
                callback(-1);
            }
            else if (ssotoken == '' && before_portal)
            {
                console.log('SSOLogin Pending : POR_Session exist, ssotoken empty');
                setTimeout(callback_loaded, 100);
            }
            else if (ssotoken != '')
            {
                console.log('SSOLogin OK : ssotoken found!');
                loginWindow.close();
                sendSsoToken(ssotoken);
            }
            else if (ssotoken == '' || portal_sessionid != '' || before_portal)
            {
              // delete_cookie('PORTAL_SESSIONID', '/', '*.korea.ac.kr');
              loginWindow.close();
              callback(-1);
            }
            else setTimeout(callback_loaded, 200);
         }

         var loginWindow = window.open('https://portal.korea.ac.kr/common/Login.kpd?id=' +
             encodeURIComponent(userInfo.id)  + '&pw=' + encodeURIComponent(userInfo.pw));
         setTimeout(callback_loaded, 1000);
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
})