angular.module('kudoc.clientAPI', [])


.factory('surveyFormFactory', function ($http, lv2sHelper) {
    return {
        validateForm :
            function (survey)
            {

            }
        ,
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
                        // convert datetime object.
                        // lv2sHelper.recv_tIso2Stirng(d.form, ['created_at', 'modified_at'], true);
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
                        var o = search_o(q.options, s.select);
                        o.checked = true;
                        o.input = s.input;
                        break;
                }
            }
        }
    }
})
