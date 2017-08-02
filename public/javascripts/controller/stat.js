angular.module('kudoc')

.controller('statController', function ($scope, $window, surveyFormFactory, statFactory, chartManager) {


    $scope.survey_id = '';
    $scope.click = {};
    $scope.survey = {};
    $scope.formats = [];
    $scope.ctxs = [];

    $scope.flag = {};
    $scope.flag.statAvaliable = true;

    $scope.option = {};
    $scope.select = {};

    $scope.getMeta = function (type) {
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


    function callback_getFile(result, path) {
        if (result)
        {
            // window.open(path, '_blank');
            // $window.open(path);
            window.location = path;
        }
        else
        {
            alert('엑셀 파일을 가져오는데 실패했습니다.')
        }
    }

    $scope.click.getFile = function () {
        var year = Number($scope.select.year.code);
        var grade = Number($scope.select.grade.code);

        if (year == -1) year = undefined;
        if (grade == -1) grade = undefined;

        statFactory.loadStatFile($scope.survey_id, callback_getFile, year, grade)
    };

    function callback_awaitChart() {
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
                    },
                    tooltip : {
                        mode: 'average'
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
            $scope.flag.statAvaliable = true;
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

    function callback_loadStatMeta(result, data)
    {
        if (result)
        {
            surveyFormFactory.loadForm($scope.survey_id, callback_loadForm);

            var years = data.year;
            var grades = data.grade;

            $scope.option.year = [];
            $scope.option.year.push({code : -1, name : '--- 학번 세부 선택 ---'});
            
            for (var idx in years)
            {
                var year = years[idx];
                $scope.option.year.push({code : year, name : year + '학번'});
            }

            $scope.option.grade = [];
            $scope.option.grade.push({code : -1, name : '--- 학년 세부 선택 --- '});
            for (var idx in grades)
            {
                var grade = grades[idx];
                $scope.option.grade.push({code : grade, name : grade + '학년'});
            }

            $scope.select.year = $scope.option.year[0];
            $scope.select.grade = $scope.option.grade[0];

            // build select list
        }
        else
        {
            alert('설문 데이터를 가져오는데 실패했습니다.')
        }
    }

    function refreshData () {
        for (var idx in $scope.ctxs) delete $scope.ctxs[idx]
        delete $scope.ctxs; $scope.ctxs = [];
        delete $scope.formats; $scope.formats = [];

        var year = Number($scope.select.year.code);
        var grade = Number($scope.select.grade.code);

        if (year == -1) year = undefined;
        if (grade == -1) grade = undefined;
        statFactory.loadStat($scope.survey_id, callback_loadStat, year, grade);
    }

    $scope.click.loadStatMeta = function (survey_id)
    {
        statFactory.loadStatMeta(survey_id, callback_loadStatMeta)
    };
    $scope.click.changeYear = function () {
        refreshData()
    };
    $scope.click.changeGrade = function () {
        refreshData()
    };

    function init()
    {
        var survey_id = $("#survey_id").val();
        $scope.survey_id = survey_id;
        $scope.click.loadStatMeta(survey_id);
    }

    init();

});