angular.module('kudoc')

// TODO 설문지 enable (closed_at 조정 datetimepicker 추가 필요)
// 교수 설문지 만들기 및 수정 :: /professor/create + /professor/edit/:survey_id
.controller('createController', function ($scope, $location, $anchorScroll, surveyFormFactory) {

    console.log('loaded.');

    function getFormattedDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear().toString();
        return year + '-' + month + '-' + day;
    }

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

    $scope.moveAnchor = function (qid) {
        var aid = 'qid-' + qid;
        if ($location.hash() !== aid) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash(aid);
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
    };

    $scope.input = {}; $scope.input.name = '';
    $scope.click = {};
    $scope.flag = {};
    //scope.flag.isTimeSet = false; // 다음부터는 showMain, showTimeset 으로 바꿀것!
    $scope.flag.isShowMain = true;
    $scope.flag.isShowSetTime = false;
    $scope.flag.isShowCommand = true;
    $scope.flag.isShowDeleteConfirm = false;

    $scope.flag.isEditable = true;
    $scope.flag.timErrMsg = "";

    // http://stackoverflow.com/questions/4802190/how-do-i-format-date-in-jquery-datetimepicker
    var datetime_format = {format : 'YYYY-MM-DD HH:mm:ss'};
    // var datetime_format = {format : 'YYYY-MM-DD HH:mm:ss', minDate : getFormattedDate(new Date())};
    // var datetime_format = {format : 'YYYY-MM-DD HH:mm:ss', minDate : getFormattedDate(new Date())};
    // var datetime_format = {format : 'YYYY/MM/DD HH:mm:ss'};

    $scope.survey = {
        survey_id : '',
        title : '',
        notice : '',
        no_idx : 0,
        type : 0,
        isshare: 1,

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
        // update: 2017. 05. 06
        // 설문지 종류나 제목 등은 변경할 수 있어야 함.

        // if (!$scope.flag.isEditable)
        // {
        //     alert('이 설문지에 대한 응답이 존재하므로 수정이 불가능합니다.');
        //     return;
        // }
        $scope.survey.type = Number($scope.survey.type);
        surveyFormFactory.submitForm($scope.survey, postFormCallback);
        // 새로 만들기
    };
    // 뒤로가기
    $scope.click.back = function () {
        history.back();
    };
    $scope.click.up = function () {
        $scope.moveAnchor('title');
    };
    $scope.click.apply = function () {
        if ($scope.survey.survey_id == "") alert ('먼저 설문지 변경사항을 저장해 주세요.');
        else {
            $scope.flag.isShowMain = false;
            $scope.flag.isShowSetTime = true;
            $scope.flag.isShowCommand = false;
        }
    };

    $scope.click.delete = function () {
        if (confirm('정말로 삭제합니까?')) {
             surveyFormFactory.deleteForm($scope.survey.survey_id, deleteFormCallback)
        }
    };

    $scope.click.deleteCheck = function () {
        if ($scope.survey.survey_id == "") alert ('이 설문은 아직 저장되지 않았습니다.');
        $scope.flag.isShowMain = false;
        $scope.flag.isShowCommand = false;
        $scope.flag.isShowDeleteConfirm = true;
    };

    $scope.click.deleteCancel = function () {
        $scope.flag.isShowMain = true;
        $scope.flag.isShowCommand = true;
        $scope.flag.isShowDeleteConfirm = false;
    };


    $scope.click.saveTime = function () {
        var start = $('#dtpicker-start');
        var end = $('#dtpicker-end');

        if (start.find('input').val() == "" || end.find('input').val() == "") alert("오류 : 시간이 입력되지 않았습니다.");

        var o_start = picker2obj(start);
        var o_end = picker2obj(end);

        if (o_start >= o_end) alert("오류 : 시작 기간이 종료 기간보다 빠르거나 같습니다.");
        else if (o_end <= Date.now()) alert("오류 : 종료 기간이 현재 시간보다 과거입니다.");
        else
        {
            var str_start = picker2str(start);
            var str_end = picker2str(end);

            if (confirm('설문 시작 일시 : ' + str_start + '\n설문 종료 일시 : ' + str_end + '\n다음과 같이 설정합니까?'))
                surveyFormFactory.setTimeForm($scope.survey.survey_id, false, str_start, str_end, setTimeCallback)
        }
    };
    $scope.click.eraseTime = function () {
        if (confirm('설문 참여를 일시 중단하시겠습니까?'))
            surveyFormFactory.setTimeForm($scope.survey.survey_id, true, null, null, setTimeCallback)
    };
    $scope.click.saveCancel = function () {
        // $scope.flag.isTimeSet = false;
        $scope.flag.isShowMain = true;
        $scope.flag.isShowSetTime = false;
        $scope.flag.isShowCommand = true;
    };

    function picker2str (obj)
    {
        return obj.find('input').val().replace('/', '-').replace('/', '-');
    }

    function picker2obj (obj)
    {
        return obj.data('DateTimePicker').date().toDate();
    }

    function deleteFormCallback(result)
    {
        if (result)
        {
            alert('성공적으로 삭제되었습니다.');
            location.href = '/professor/list_form'
        }
        else
        {
            alert('삭제 중 오류가 발생했습니다.');
        }
    }

    function setTimeCallback(result)
    {
        if (result)
        {
            alert('성공적으로 저장되었습니다.');
            location.href = '/professor/edit/' + $scope.survey.survey_id;
        }
        else
        {
            alert("오류 : 설문 응답시간 설정을 실패했습니다. 페이지를 새로고침 해 주세요.")
        }
    }

    function postFormCallback(result, survey_id, reason) {
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
            if (reason) { alert('오류 : 설문지 양식을 저장하는데 실패했습니다.\n' + reason); }
            else { alert('오류 : 설문지 양식을 저장하는데 실패했습니다.'); }
        }
    }

    function checkExistCallback(result)
    {
        if (result)
        {
            // do nothing! (TODO :: disable loading modal)
            $scope.flag.isEditable = true;
        }
        else
        {
            $scope.flag.isEditable = false;
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
            $scope.survey.is_share = Boolean($scope.survey.is_share);
            surveyFormFactory.checkFormEditable($scope.survey.survey_id, checkExistCallback)
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

        $('#dtpicker-start').datetimepicker(datetime_format);
        $('#dtpicker-end').datetimepicker(datetime_format);

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