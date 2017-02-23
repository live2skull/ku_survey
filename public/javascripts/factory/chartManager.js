angular.module('kudoc')

.factory('chartManager', function () {

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function searchOpt2no(options, no)
    {
        for (var idx in options)
        {
            var option = options[idx];
            if (option.no == no) return option;
        }
    }

    return  {
         buildChartData : function (form, data) {
             // 하나의 Question - 하나의 format 데이터.
             if (form == undefined || data == undefined) return undefined;

             var formats = [];

             for (var idx in form.questions)
             {
                 var question = form.questions[idx];
                 if (question.type == 0) continue;

                 var format = {};
                 format['name'] = question.name; // unused
                 format['order'] = question.order; // unused
                 var labels = []; var datas = []; var colors = [];

                 var stats = data[question.no];
                 for (var i in stats)
                 {
                     var stat = stats[i];
                     colors.push(getRandomColor());

                     switch (question.type)
                         {
                         case 3: // 순위형 (객관식 여러개 선택가능 - order 로 정렬되어있음
                             var key = stat[0]; var value = stat[1];
                             var option = searchOpt2no(question.options, key);
                             // order + 1 을 해주어야 함.
                             labels.push('#' + (Number(i) + 1) + '. ' + option.name); datas.push(value);
                             break;

                         default: // 일반형 (객관식 단일, 다중선택)
                             // value :: stat!
                             var option = searchOpt2no(question.options, i);
                             labels.push(option.name); datas.push(stat);
                             break;
                     }
                 }

                 format['labels'] = labels;
                 format['datasets'] = [];
                 format['datasets'].push({data : datas, backgroundColor : colors});
                 formats.push(format);
             }

             return formats

         }
    }
});

// http://stackoverflow.com/questions/36992922/chart-js-v2-how-to-make-tooltips-always-appear-on-pie-chart
// bower install chart.js#2.1.0 (최신 버전과 호환되지 않음!)

Chart.pluginService.register({
    beforeRender: function (chart) {
        if (chart.config.options.showAllTooltips) {
            // create an array of tooltips
            // we can't use the chart tooltip because there is only one tooltip per chart
            chart.pluginTooltips = [];
            chart.config.data.datasets.forEach(function (dataset, i) {
                chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                    chart.pluginTooltips.push(new Chart.Tooltip({
                        _chart: chart.chart,
                        _chartInstance: chart,
                        _data: chart.data,
                        _options: chart.options,
                        _active: [sector]
                    }, chart));
                });
            });

            // turn off normal tooltips
            chart.options.tooltips.enabled = false;
        }
    },
    afterDraw: function (chart, easing) {
        if (chart.config.options.showAllTooltips) {
            // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
            if (!chart.allTooltipsOnce) {
                if (easing !== 1)
                    return;
                chart.allTooltipsOnce = true;
            }

            // turn on tooltips
            chart.options.tooltips.enabled = true;
            Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                tooltip.initialize();
                tooltip.update();
                // we don't actually need this since we are not animating tooltips
                tooltip.pivot();
                tooltip.transition(easing).draw();
            });
            chart.options.tooltips.enabled = false;
        }
    }
});