angular.module('kudoc')

// 학생 설문 참여 :: /student/assign
.controller('assignController', function ($scope, $location, $anchorScroll, surveyFormFactory, submitFormFactory)
{
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

    $scope.survey = {};
    $scope.click = {};
    $scope.flag = {};
    $scope.flag.showSubmit = true;
    $scope.flag.showAssigned = false;
    $scope.flag.showResult = false;

    init();

    /* click Event */
    $scope.click.checkQuestion = function (quest, option) {
        // type?
        switch (quest.type)
        {
            case 1: // 단일
                for (var idx in quest.options) quest.options[idx].checked = false;
                option.checked = !option.checked;
                break;
            case 2: // 다중
                option.checked = !option.checked;
                break;
            case 3: // 순위지정
                option.checked = !option.checked;
                if (option.checked)
                {
                    //option.order = 0;
                    var maxOrder = -1;
                    for (var idx in quest.options)
                    {
                        var opt = quest.options[idx];
                        if (opt.sel_order == undefined || isNaN(opt.sel_order)) continue;

                        if (opt.sel_order > maxOrder) maxOrder = opt.sel_order;
                    }
                    option.sel_order = maxOrder + 1;
                }
                else
                {
                    var cur_order = option.sel_order;
                    option.sel_order = undefined;

                    for (var idx in quest.options)
                    {
                        var opt = quest.options[idx];
                        if (opt.sel_order == undefined || isNaN(opt.sel_order)) continue;

                        if (opt.sel_order > cur_order) opt.sel_order -= 1;
                    }

                }
                // TODO : set default order
                break;

            default:
                alert('Warning: checkQuestion function _ invalid quest type.')
        }
    };

    $scope.click.sortSelection = function (direction, quest, soption) {
        // 0-up, 1-down
        var order_cur = soption.sel_order;
        var order_dst = 99999999;
        var order_pad = 99999999;

        var options = quest.options;

        for (var i = 0; i < options.length; i++)
        {

            var q = options[i];
            if (!q.checked) continue;

            var pad = order_cur - q.sel_order;
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
            var tmp = soption.sel_order;
            var dst = options[order_dst];

            soption.sel_order = dst.sel_order;
            dst.sel_order = tmp;
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

    $scope.click.postSurvey = function () {
        // 데이터 무결성 검사.
        // 객관식의 경우.
        // 데이터가 checked 되었을때만 form 에 넘깁니다.
        var grade = Number($scope.survey.hak_grade);
        if (isNaN(grade) || grade < 1 || grade > 4) {
            alert('학년을 올바르게 입력하세요. (1~4)'); $scope.moveAnchor('grade'); return;
        }

        var forms = {};
        forms.submit = [];
        forms.survey_id = $scope.survey.survey_id;
        forms.grade = Number($scope.survey.hak_grade);

        for (var idx in $scope.survey.questions)
        {
            var question = $scope.survey.questions[idx];
            var form = {};
            form.no = question.no;
            form.type = question.type;
            form.inputs = [];
            form.selects = [];
            form.orders = [];
            form.input =  ''; // 주관식 데이터 입력

            switch (question.type)
            {
                case 0: // 주관식
                    if (question.input == '') {
                        alert('작성하지 않은 주관식 문항이 있습니다.'); $scope.moveAnchor(question.no); return;
                    }
                    else if (question.input.length > question.input.maxlength) {
                        alert('입력 허용 길이를 초과한 주관식 문항이 있습니다.'); $scope.moveAnchor(question.no); return;
                    }
                    form.input = question.input;
                    break;

                default: // 객관식 단일, 다중선택
                    var checked = false;
                    for (var i in question.options)
                    {
                        var option = question.options[i];
                        if (option.checked && option.write) {
                            checked = true;
                            if (option.input == '' || option.input == undefined) {
                                alert('세부 사항을 입력하지 않은 객관식 문항이 있습니다.'); $scope.moveAnchor(question.no); return;
                            }
                            form.selects.push(option.no);
                            form.inputs.push(option.input);
                            if (question.type == 3)
                            {
                                form.orders.push(option.sel_order);
                            }
                        }
                        else if (option.checked) {
                            checked = true;
                            form.selects.push(option.no);
                            form.inputs.push(null);
                            if (question.type == 3)
                            {
                                form.orders.push(option.sel_order);
                            }
                        }
                    }
                    if (!checked) {
                        alert('선택하지 않은 객관식 문항이 있습니다.'); $scope.moveAnchor(question.no); return;
                    }
            }
            forms.submit.push(form);
        }

        submitFormFactory.saveSubmit(forms, saveSubmitCallback);
        // 데이터 전송 (다른 모듈로 구현)
    };
    $scope.click.goMySurvey = function () {
        location.href = '/student/submits';
    };
    /* ********************************************************************************** */

    /* Callback */
    function saveSubmitCallback(result, submit_id)
    {
        if (result)
        {
            $scope.survey = null;
            $scope.flag.showSubmit = false;
            $scope.flag.showResult = true;
            $scope.flag.submit_id = submit_id;
        }
        else alert('오류 : 설문 저장에 실패했거나, 이미 참여한 설문입니다.\n잠시후 다시 시도해 주세요.');
    }

    function checkAssignCallback(result)
    {
        if (result) {}
        else
        {
            $scope.flag.showSubmit = false;
            $scope.flag.showAssigned = true;
        }
    }


    function loadFormCallback(result, form)
    {
        if (result) {
            $scope.survey = form;

            $scope.survey.hak_name = decodeURIComponent(getCookie('hak_name'));
            $scope.survey.hak_number = getCookie('hak_number');
            surveyFormFactory.checkAssignedSubmit($scope.survey_id, checkAssignCallback);
            // $scope.survey.hak_number = decodeURIComponent(getCookie());
            // $scope.survey.hak_name = decodeURIComponent(getCookie());
        }
        else {
            alert("오류 : 설문지 양식을 불러오는데 실패했습니다. 다시 시도해 주세요.");
            history.back(-1);
        }
    }
    /* ********************************************************************************** */

    function init() {
        var survey_id = $("#survey_id").val();
        $scope.survey_id = survey_id;
        surveyFormFactory.loadForm(survey_id, loadFormCallback);
    }

});
