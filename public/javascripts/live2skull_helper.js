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