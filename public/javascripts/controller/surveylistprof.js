angular.module('kudoc')

    .controller('submitListController', function ($scope, submitListFactory) {

        $scope.click = {};
        $scope.submits = [];

        $scope.click.goView = function (survey_id)
        {
            location.href = '/professor/view/' + survey_id;
        };


        function callback_submitList(result, data)
        {
            if (result)
            {
                $scope.submits = data;
            }
            else
            {
                alert('Warning: 설문 리스트를 불러올 수 없음.');
            }
        }

        $scope.click.getSurveyList = function () {
            // var type = getType();
            // if (type == null) { alert('Warning! page URL Information ERR!'); return }
            // if (type == 0 || type == 1) pagnation = 0;

            submitListFactory.listSubmitprof(callback_submitList);
        };

        function init() {
            $scope.click.getSurveyList();
        }

        init();

    });