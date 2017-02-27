angular.module('kudoc.clientAPI', ['live2skull.helper'])


.factory('surveyFormFactory', function ($http, lv2sHelper) {
    return {
        submitForm : function (survey, callback) {
            $http({
                method : 'POST',
                url : '/api/saveform',
                data : survey
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result)
                    {
                        callback(d.result);
                        //alert('Warning: saveform failed. / rst');
                    }
                    callback(d.result, d.survey_id);
                },
                function (err)
                {
                    // TODO : session error
                    callback(false, null, err);
                }
            )
        }
        ,
        loadForm : function (survey_id, callback) {
            $http({
                method : 'POST',
                url : '/api/loadform',
                data : {survey_id : survey_id}
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        // convert datetime object.
                        lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
                        callback(d.result, d.form);
                    }
                },
                function ()
                {
                    callback()
                }
            )
        }
    }
})

.factory('submitFormFactory', function ($http, lv2sHelper) {
    return {
        saveSubmit : function (submit, callback) {
            $http({
                method : 'POST',
                url : '/api/savesubmit',
                data : submit
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        // convert datetime object.
                        lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
                        callback(true, d.submit_id);
                    }
                },
                function ()
                {
                    callback(false);
                }
            )
        },

        loadSubmit : function (submit_id, callback) {
            $http({
                method : 'POST',
                url : '/api/loadsubmit',
                data : {submit_id : submit_id}
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        // convert datetime object.
                        lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
                        callback(true, d.form);
                    }
                },
                function ()
                {
                    callback(false);
                }
            )
        }
    }
})

.factory('surveyListFactory', function ($http)
{
    return {
        listSurvey : function (type, show_closed, pagnation, callback)
        {
            $http({
                method : 'POST',
                url : '/api/listsurvey',
                data : {type : type, show_closed : show_closed, pagnation : pagnation}
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        // convert datetime object.
                        // lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
                        callback(true, d.data);
                    }
                },
                function ()
                {
                    callback(false);
                }
            )
        },
    }
})

.factory('submitListFactory', function ($http)
{
    return {
        listSubmitprof : function (callback)
        {
            $http({
                method : 'POST',
                url : '/api/listsubmit',
                data : {},
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        // convert datetime object.
                        // lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
                        callback(true, d.data);
                    }
                },
                function ()
                {

                }
            )
        }
    }
})

.factory('statFactory', function ($http) {
   return {
       loadStat : function (survey_id, callback) {
           $http({
               method : 'POST',
               url : '/api/loadstat',
               data : {survey_id : survey_id}
           }).then(
           function (data) {
               var d = data.data;
               var result = d.result;
               if (!result) {
                   callback(false)
               }
               else {
                   callback(true, d.data)
               }

           },

           function (err)
           {
               callback(false)
           }
       )}
   }
})

.factory('commentManagerFactory', function ($http) {
    return {
        saveComment : function (submit_id, comment, callback) {
            $http({
                method : 'POST',
                url : '/api/savecomment',
                data : {submit_id : submit_id, comment : comment}
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        callback(true);
                    }
                },
                function ()
                {
                    callback(false);
                }
            )
        },

        loadComment : function (submit_id, callback)
        {
            $http({
                method : 'POST',
                url : '/api/loadcomment',
                data : {submit_id : submit_id}
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        callback(true, d);
                    }
                },
                function ()
                {
                    callback(false);
                }
            )
        }
    }
})

.factory('miscFactory', function ($http) {
    return {
        loadDeps : function (callback)
        {
            $http({
                method : 'POST',
                url : '/api/loaddep'
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result)
                    {
                        callback(d.result);
                        //alert('Warning: saveform failed. / rst');
                    }
                    callback(d.result, d);
                },
                function (callback)
                {
                    // TODO : session error
                    callback(false);
                }
            )
        },

        loadHaks : function (callback)
        {
            $http({
                method : 'POST',
                url : '/api/loadhak'
            }).then(
                function (data)
                {

                },
                function (callback)
                {
                    callback(false)
                }
            )
        }
    }
})

.factory('viewHelper', function () {

    function search_q(form, no)
    {
        for (var idx in form.questions)
        {
            var q = form.questions[idx];

            if (q.no == no)
            {
                return q;
            }
        }
    }

    function search_o(opts, no)
    {
        for (var idx in opts)
        {
            var o = opts[idx];

            if (o.no == no)
            {
                return o;
            }
        }
    }

    return {
        mergeViewData : function (form, submit) {

            for (var idx in submit.submit)
            {
                var s = submit.submit[idx];
                var no = s.no;
                var q = search_q(form, no);
                var type = q.type;

                switch (type)
                {
                    case 0:
                        q.input = s.input;
                        break;

                    default:
                        // o - form (option)
                        // s - submit
                        var o = search_o(q.options, s.select);
                        o.checked = true;
                        o.input = s.input;

                        if (type == 3)
                        {
                            o.order = s.order;
                        }
                        break;
                }
            }

            form.hak_name = submit.hak_name;
            form.grade = submit.grade; 
            form.hak_number = submit.hak_number; 
            form.hak_depart = submit.hak_depart;
            form.created_at = submit.created_at;
        }
    }
});



// function esteregg() {
//
//     var message = '러블리즈(Lovelyz) "R U Ready?" Album Preview';
//     var loc = 'QCdqIWLW7UY';
//     var src = 'http://www.youtube.com/embed/' + loc + '?playlist=' + loc + '&autoplay=1&loop=1';
//     var width = $('#main-container').width();
//     var height = $(window).height() - 120;
//     var html = '<iframe id="frame_holder" width="' + width + '" height="' + height + '" src="' + src + '" frameborder="0" allowfullscreen></iframe>';
//
//     $('#main-container').html(html);
//
//     $(window).resize(function () {
//         var holder = $('#frame_holder');
//         holder.width($('#main-container').width());
//         holder.height($(window).height() - 120);
//     });
//
//
//     $('#ResponsiveNav').html('');
//     $('#navbar-brand-span').html('<img id="navbar-brand" width="40" src="/public/images/logo-hidden.png" alt="brand">&nbsp;&nbsp;' + message);
//     $('#navbar-brand-span').addClass("navbar-another");
//     $('#navbar-brand-span').removeClass('navbar-brand-span');
//     $('#application-navbar').removeClass('navbar-inverse');
//     $('#application-navbar').addClass('navbar-2');
//
//     $("body").css("background-color","#d4c052");
//     $('#main-container').css('background-color', "#000000");
//
//     console.clear();
// }

