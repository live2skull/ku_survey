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
        },

        checkAssignedSubmit : function (survey_id, callback) {
            $http({
                method : 'POST',
                url : '/api/checkassignedsubmit',
                data : {survey_id : survey_id}
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    callback(result);
                },
                function ()
                {
                    callback(false);
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
                        // lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
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
                        // var forms = d.form;
                        // for (var idx in forms)
                        // {
                        //     var form = forms[idx];
                        //     lv2sHelper.recv_tIso2Stirng(form, ['created_at', 'modified_at'], true);
                        // }
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

.factory('surveyListFactory', function ($http, lv2sHelper)
{
    return {
        // 통계 자료 출력 및 학생 전용
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
                        var datas = d.data;
                        for (var idx in datas)
                        {
                            // var form = forms[idx];
                            lv2sHelper.recv_tIso2Stirng(datas[idx], ['created_at', 'modified_at', 'started_at', 'closed_at'], true);
                        }
                        callback(true, d.data);
                    }
                },
                function ()
                {
                    callback(false);
                }
            )
        },

        // pagnation -- not used
        // 교수 본인이 작성한 설문지 양식 불러오기.
        listProfessorSurvey : function (callback, type, pagnation)
        {
            $http({
                method : 'POST',
                url : '/api/listsurvey',
                data : {type : type, pagnation : pagnation}
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        // convert datetime object.
                        var datas = d.data;
                        for (var idx in datas)
                        {
                            // var form = forms[idx];
                            lv2sHelper.recv_tIso2Stirng(datas[idx], ['created_at', 'modified_at', 'started_at', 'closed_at'], true);
                        }
                        // lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
                        callback(true, d.data);
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

.factory('submitListFactory', function ($http, lv2sHelper)
{
    return {
        // 이건 설문 데이터 가져오기
        // 전체 설문 데이터?
        listSubmitProf : function (callback, survey_id)
        {
            $http({
                method : 'POST',
                url : '/api/listsubmit',
                data : {survey_id : survey_id},
            }).then(
                function (data)
                {
                    var d = data.data;
                    var result = d.result;
                    if (!result) callback(d.result);
                    else
                    {
                        var submits = d.data;
                        for (var idx in submits)
                        {
                            var submit = submits[idx];
                            lv2sHelper.recv_tIso2Stirng(submit, ['created_at'], true);
                        }
                        // convert datetime object.
                        // var data = d.data;
                        // for (var idx in data)
                        // {
                        //     var da = data[idx];
                        //     lv2sHelper.recv_tIso2Stirng(da, ['created_at', 'modified_at', 'closed_at'], true);
                        // }
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

        // 본인이 설문한 데이터만 모두 불러온다.
        listSubmitStud : function (callback)
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
                        var submits = d.data;
                        for (var idx in submits)
                        {
                            var submit = submits[idx];
                            lv2sHelper.recv_tIso2Stirng(submit, ['created_at'], true);
                        }
                        callback(true, d.data);
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
})

.factory('sessionFactory', function ($http) {
    return {
        doLogout : function (callback) {
            $http({
                method: 'POST',
                url: '/api/logout',
                data: {}
            }).then(
                function (data) {
                    var d = data.data;
                    callback(d.result);
                },
                function () {
                    callback(false);
                });
        }
    }
});