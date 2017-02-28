angular.module('live2skull.helper', [])

.factory('lv2sHelper', function () {
   return {
       // true -> ISO 2 String || false -> String 2 Server (Mysql DateTime)
       recv_tIso2Stirng :
           function (obj, clist, flag)
           {
               // dateFormat : already loaded.
               // using moment.js
               for (var idx in clist)
               {
                   var oidx = clist[idx];
                   var target = obj[oidx];

                   switch (flag)
                   {
                       case true:
                           var now = new Date(target);
                           // Error!!
                           // obj[idx] = dateFormat(now, 'yyyy-mm-dd hh-MM-ss TT');
                           obj[oidx] = now.toLocaleString();
                           break;[]

                       case false:
                           var now = new Date(target);
                           obj[oidx] = moment(now).format('YYYY-MM-DD HH:mm:ss');
                           break;
                   }
               }
           }
   }
});

function deleteCookie(c_name) {
    document.cookie = encodeURIComponent(c_name) + "=deleted; expires=" + new Date(0).toUTCString();
}

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');

    for(var i=0; i<ca.length;i++){
        var c = ca[i];
        while(c.charAt(0)==' ') c = c.substring(1);
        if(c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}