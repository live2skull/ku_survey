angular.module('kudoc')

.controller('statController', function ($scope, surveyFormFactory, statFactory, chartManager) {

    $scope.click = {};
    $scope.survey = {};
    // $scope.stat = {};

    function callback_loadStat(result, stat)
    {
        if (!result) { alert('통계 데이터를 가져오는데 실패했습니다.'); return; }

        // marshall form data.
        var survey = $scope.survey;
        var formats = chartManager.buildChartData(survey, stat);

        if (formats == undefined)
        {
            alert('경고! 가져온 데이터가 잘못되었습니다.');
            return;
        }

        var d = formats[4];
        var ctx = $("#testChart");
        var myPieChart = new Chart(ctx,{
            type: 'pie',
            data: d,
            options: {
                showAllTooltips : true
            }
        });

        //alert(formats);
    };

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
    };

    $scope.click.loadStat = function (survey_id)
    {
        surveyFormFactory.loadForm(survey_id, callback_loadForm)
    };

    function init()
    {
        $scope.click.loadStat('157525834b26df1c59a224a38fb3e8d8');
    }

    init();

})