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

      doDebugLogin : function (callback)
      {
          $http({
              method: 'POST',
              url: '/api/SSOLogin',
              data: {secure: true, ssoToken: getCookie('ssotoken')}
              // data: {secure: true}
          }).then(
              function (data) {
                  var d = data.data;
                  callback(d.result);
              },
              function () {
                  callback(false);
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
         var DELAY_WAIT_LOGIN = 1000;
         var DELAY_WAIT_TERM = 200;

         var last_token = getCookie('ssotoken');
         var last_session = getCookie('PORTAL_SESSIONID');

          var loginWindow = window.open('https://portal.korea.ac.kr/common/Login.kpd?id=' +
              encodeURIComponent(userInfo.id)  + '&pw=' + encodeURIComponent(userInfo.pw));

         function callback_retry() {
             var token = getCookie('ssotoken');
             if (loginWindow.closed)
             {
                 console.log('SSOLogin Failed : loginWindow closed.');
                 callback(-1);
             }
             else if (token != "")
             {
                 loginWindow.close();
                 sendSsoToken(token);
             }
             else setTimeout(callback_retry, DELAY_WAIT_TERM);
         }

         function callback_started() {
             var token = getCookie('ssotoken');
             var session = getCookie('PORTAL_SESSIONID');
             if (loginWindow.closed)
             {
                 console.log('SSOLogin Failed : loginWindow closed.');
                 callback(-1);
             }
             else if (token != "" && session != "")
             {
                 loginWindow.close();
                 sendSsoToken(token);
             }
             else if (token == "" && session != "")
             {
                 console.log('SSOLogin Failed : Auth failed.');
                 loginWindow.close();
                 callback(-1);
             }
             else setTimeout(callback_started, DELAY_WAIT_TERM);
         }

         function callback_logined() {
             var token = getCookie('ssotoken');
             if (loginWindow.closed)
             {
                 console.log('SSOLogin Failed : loginWindow closed.');
                 callback(-1);
             }
             else if (token != last_token)
             {
                 loginWindow.close();
                 sendSsoToken(token);
             }
             else setTimeout(callback_logined, DELAY_WAIT_TERM);
         }

         // 로그인에 실패함.
         if (last_session != "" && last_token == "") setTimeout(callback_retry, DELAY_WAIT_LOGIN);
         // 처음 시도
         else if (last_session == "" && last_token == "") setTimeout(callback_started, DELAY_WAIT_LOGIN);
         // 로그인되어 있음
         else if (last_session != "" && last_token != "") setTimeout(callback_logined, DELAY_WAIT_LOGIN);
         else alert('Warning: SSO Login status checking failed!');
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