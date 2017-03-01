angular.module('kudoc')

.controller('statController', function ($scope, surveyFormFactory, statFactory, chartManager) {


    $scope.click = {};
    $scope.survey = {};
    $scope.formats = [];
    $scope.ctxs = [];

    $scope.flag = {};
    $scope.flag.statAvaliable = true;

    $scope.getMeta = function (type)
    {
        switch (type)
        {
            case 1:
                return "(단일) "; break;
            case 2:
                return "(다중) "; break;
            case 3:
                return "(순위) "; break;
        }
    };

    $scope.click.setChartIdx = function (format, idx) {
        format.idx = idx;
    };

    $scope.click.goBack = function () {
        history.back();
    };

    function callback_awaitChart()
    {
        var ctxIdx = -1;
        for (var idx in $scope.formats)
        {
            var format = $scope.formats[idx];

            // var ctx = $('#Chart-' + format.idx);
            ctxIdx++;
            $scope.ctxs.push($('#Chart-' + format.idx));

            new Chart($scope.ctxs[ctxIdx], {
                // type : 'doughnut',
                type : 'doughnut',
                data : format,
                options: {showAllTooltips : true, responsive: true,
                    legend :
                    {
                        display : true,
                        fullWidth : true,
                        position : 'bottom',
                        labels : {
                            boxWidth : 10
                        }
                    }
                }
            });
        }
    }

    function callback_loadStat(result, stat)
    {
        if (!result) { alert('통계 데이터를 가져오는데 실패했습니다.'); return; }

        // marshall form data.
        var survey = $scope.survey;

        if (!Object.keys(stat).length)
        {
            $scope.flag.statAvaliable = false;
        }

        else
        {
            var formats = chartManager.buildChartData(survey, stat);
            if (formats == undefined)
            {
                alert('경고! 가져온 데이터가 잘못되었습니다.');
                return;
            }
            $scope.formats = formats;
            setTimeout(callback_awaitChart, 500);
        }
    }

    function callback_loadForm(result, form)
    {
        if (result)
        {
            $scope.survey = form;
            statFactory.loadStat(form.survey_id, callback_loadStat);
        }
        else
        {
            alert('설문지 양식을 가져오는데 실패했습니다.')
        }
    }

    $scope.click.loadStat = function (survey_id)
    {
        surveyFormFactory.loadForm(survey_id, callback_loadForm)
    };

    function init()
    {
        var survey_id = $("#survey_id").val();
        $scope.click.loadStat(survey_id);
    }

    init();

})