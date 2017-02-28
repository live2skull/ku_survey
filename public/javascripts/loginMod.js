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
                  callback(-1);
               }
               else if (ssotoken == '' && before_portal)
               {
                  setTimeout(callback_loaded, 100);
               }
               else if (ssotoken != '')
               {
                  loginWindow.close();
                  sendSsoToken(ssotoken);
               }
               else if (ssotoken == '' || portal_sessionid != '' || before_portal)
               {
                  // delete_cookie('PORTAL_SESSIONID', '/', '*.korea.ac.kr');
                  loginWindow.close();
                  callback(-1);
               }
               else setTimeout(callback_loaded, 100);
         }

         var loginWindow = window.open('https://portal.korea.ac.kr/common/Login.kpd?id=' +
             encodeURIComponent(userInfo.id)  + '&pw=' + encodeURIComponent(userInfo.pw));
         setTimeout(callback_loaded, 100);
         // addListener(loginWindow, "DOMContentLoaded", callback_loaded);
         // loginWindow.on
         // loginWindow.addEventListener('load', callback_loaded, true);

         // jQuery.ajax({
         //    type: "POST",
         //    url: 'https://portal.korea.ac.kr/common/Login.kpd',
         //    data: {id : userInfo.id, pw : userInfo.pw, direct_div : '', pw_pass : '', browser : 'chrome'},
         //    success: function () {},
         //    dataType: 'application/x-www-form-urlencoded'
         //    // 이 요청은 항상 실패합니다. ssotoken 을 이용해 로그인을 시도합니다.
         // }).fail(function () {
         //
         //    var ssotoken = getCookie('ssotoken');
         //    if (ssotoken == "") callback(false);
         //
         //    sendSsoToken(ssotoken);
         //
         // });

         // var request = new XMLHttpRequest();
         // var params = "action=something";
         // request.open('POST', 'https://portal.korea.ac.kr/common/Login.kpd', true);
         // // request.open('POST', 'http://localhost:3000/api/SSOLogin', true);
         // request.onreadystatechange = function () {
         //    if (this.readyState === this.DONE) {
         //       console.log(this.responseURL);
         //    }
         // };
         // request.onreadystatechange = function() {if (request.readyState==4) alert("It worked!");};
         // // request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         // // request.setRequestHeader("Content-length", params.length);
         // // request.setRequestHeader("Connection", "close");
         // request.send(params);
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