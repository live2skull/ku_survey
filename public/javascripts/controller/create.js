angular.module('kudoc')

// 교수 설문지 만들기  :: /professor/create + /professor/edit/:survey_id
.controller('createController', function ($scope, surveyFormFactory) {

    function getMaxArguments_Question() {

        // var maxNo = -1;
        var maxOrder = -1;
        for (var idx in $scope.survey.questions)
        {
            var q = $scope.survey.questions[idx];
            // if (q.no > maxNo) maxNo = q.no;
            if (q.order > maxOrder) maxOrder = q.order;
        }

        $scope.survey.no_idx++;
        return {no : $scope.survey.no_idx - 1, order : maxOrder};
    }

    function getMaxArguments_Option(question) {
        var maxOrder = -1;
        for (var idx in question.options)
        {
            var o = question.options[idx];
            if (o.order > maxOrder) maxOrder = o.order;
        }

        question.no_idx++;
        return {no: question.no_idx - 1, order: maxOrder}

    }

    $scope.input = {}; $scope.input.name = '';
    $scope.click = {};

    $scope.survey = {
        survey_id : '',
        title : '',
        notice : '',
        no_idx : 0,

        // undefined - survey_id, professor_id, started_at, created_at, finished_at, modified_at, closed

        questions : []
    };


    $scope.option = {}; $scope.select = {};
    $scope.option.type =
        [
            // {code: -1, name: '-- 기간 선택 --'},
            {code: 0, name: '주관식'},
            {code: 1, name: '객관식 (단일선택)'},
            {code: 2, name: '객관식 (다중선택)'},
            {code: 3, name: '객관식 (순위지정)'}
    ];
    $scope.select.type = $scope.option.type[0];

    // $scope.click.updateYear = function () {
    //     $scope.flag.listShow = $scope.select.year.code;
    //     // alert($scope.select.year.code);
    // };

    // TODO - module!
    // $scope.click.goStat = function (survey_id) {
    //     var curl = window.location.href;
    //     if (curl[curl.length - 1] != '/') curl += '/';
    //     curl += survey_id.toString();
    //
    //     window.location.href = curl;
    // };

    // $scope.click.updateYear();

    // TODO 데이터 삭제 후 새로 만들 때, 이전 데이터의 무결성 검증
    $scope.click.createQuestion = function () {
        var name = $scope.input.name;
        if (name == '') {
            alert('이름을 입력해주세요.');
            return;
        }

        var sarg = getMaxArguments_Question();
        var code = $scope.select.type.code;
        $scope.survey.questions.push(
            {
                no : sarg.no + 1,
                order : sarg.order + 1,
                name : name,
                type : code,
                type_select : $scope.option.type[code],
                options : [],
                options_select : {},
                no_idx : 0
            }
        );


        // $scope.select.type = $scope.option.type[0];
        $scope.input.name = '';
    };
    $scope.click.removeQuestion = function (no) {
        for (var idx in $scope.survey.questions)
        {
            var q = $scope.survey.questions[idx];
            if (q.no == no) {
                $scope.survey.questions.splice(Number(idx), 1);
                break;
            }
        }
    };
    $scope.click.sortQuestion = function (direction, squest) {
        // 0-up, 1-down
        var order_cur = squest.order;
        var order_dst = 99999999;
        var order_pad = 99999999;

        var questions = $scope.survey.questions;

        for (var i = 0; i < questions.length; i++)
        {
            var q = questions[i];
            var pad = order_cur - q.order;
            switch (direction)
            {
                case 0: // 위로 올림 - 본인보다 적은 수
                    if (pad <= 0) continue;
                    break;
                case 1: // 아래로 내림 - 본인보다 큰 수
                    if (pad >= 0) continue;
                    break;
            }

            pad = Math.abs(pad);
            if (pad < order_pad && pad != 0)
            {
                order_dst = i;
                order_pad = pad;
            }
        }

        if (order_pad != 99999999)
        {
            var tmp = squest.order;
            var dst = questions[order_dst];

            squest.order = dst.order;
            dst.order = tmp;
        }

    };
    $scope.click.changeQuestionType = function (quest) {
        quest.type = quest.type_select.code;
    };

    $scope.click.createSelection = function (quest) {
        var name = quest.options_select.name;
        if (name == '' || name == undefined) {
            alert('이름을 입력해주세요.');
            return;
        }

        var sarg = getMaxArguments_Option(quest);
        quest.options.push(
            {
                no : sarg.no + 1,
                order : sarg.order + 1,
                name : name,
                write : false // 개인 설정 가능.
            }
        );
        quest.options_select.name = '';
    };
    $scope.click.editSelection = function (option) {
        var edit = prompt("다음 항목의 이름을 수정 : " + option.name, "");
        if (edit != null && edit != '' && edit.length <= 50) {
            option.name = edit;
        }

    };
    $scope.click.removeSelection = function (options, no) {
        for (var idx in options)
        {
            var o = options[idx];
            if (o.no == no) {
                options.splice(Number(idx), 1);
                break;
            }
        }
    };
    $scope.click.sortSelection = function (direction, quest, soption) {
        // 0-up, 1-down
        var order_cur = soption.order;
        var order_dst = 99999999;
                var order_pad = 99999999;

                var options = quest.options;

                for (var i = 0; i < options.length; i++)
                {
                    var q = options[i];
                    var pad = order_cur - q.order;
                    switch (direction)
                    {
                        case 0: // 위로 올림 - 본인보다 적은 수
                            if (pad <= 0) continue;
                            break;
                        case 1: // 아래로 내림 - 본인보다 큰 수
                            if (pad >= 0) continue;
                            break;
                    }

                    pad = Math.abs(pad);
                    if (pad < order_pad && pad != 0)
                    {
                order_dst = i;
                order_pad = pad;
            }
        }

        if (order_pad != 99999999)
        {
            var tmp = soption.order;
            var dst = options[order_dst];

            soption.order = dst.order;
            dst.order = tmp;
        }
    };

    $scope.click.postForm = function () {
        surveyFormFactory.submitForm($scope.survey, postFormCallback);
        // 새로 만들기
    };
    // 뒤로가기
    $scope.click.back = function () {

    };

    function postFormCallback(result, survey_id, err) {
        if (result)
        {
            alert('성공적으로 저장되었습니다.');
            switch ($scope.survey.mode)
            {
                case 'create':
                    location.href = '/professor/edit/' + survey_id;
                    break;
                case 'edit':
                    location.reload();
                    break;
            }
        }
        else {
            alert('오류 : 설문지 양식을 저장하는데 실패했습니다.');
        }
    }
    function loadFormCallback(result, form)
    {
        if (result)
        {
            // $scope.survey = form;

            for (var idx in form.questions)
            {
                var question = form.questions[idx];
                question.type_select = $scope.option.type[question.type];
                // question.type_select.code = question.type;
                question.option_select = {};
            }

            $scope.survey = form;
        }
        else {
            alert("오류 : 설문지 양식을 불러오는데 실패했습니다. 다시 시도해 주세요.");
            history.back(-1);
        }

        var mode = $("#mode").val();
        $scope.survey.mode = mode;


    }

    function init() {
        var survey_id = $("#survey_id").val();
        $scope.survey.survey_id = survey_id;

        // reload survey form!
        if (survey_id != '')
        {
            surveyFormFactory.loadForm(survey_id, loadFormCallback);
        }
        else
        {
            var mode = $("#mode").val();
            $scope.survey.mode = mode;
        }
    }

    init();
});