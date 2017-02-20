angular.module('kudoc')

// 학생 설문 참여 :: /student/assign
.controller('assignController', function ($scope, $location, $anchorScroll, surveyFormFactory, submitFormFactory)
{
    $scope.survey = {};
    $scope.click = {};

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
            default:
                alert('Warning: checkQuestion function _ invalid quest type.')
        }
    };
    $scope.click.postSurvey = function () {
        // 데이터 무결성 검사.
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
                        }
                        else if (option.checked) {
                            checked = true;
                            form.selects.push(option.no);
                            form.inputs.push(null);
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
    /* ********************************************************************************** */

    /* Callback */
    function saveSubmitCallback(result, submit_id)
    {
        if (result)
        {
            alert('귀하의 설문이 성공적으로 저장되었으며, 설문 번호는 ' + submit_id + ' 입니다.');
        }
        else
        {
            alert('설문 저장에 실패했습니다.');
        }
    }

    function loadFormCallback(result, form)
    {
        if (result) {
            $scope.survey = form;
        }
        else {
            alert("오류 : 설문지 양식을 불러오는데 실패했습니다. 다시 시도해 주세요.");
            history.back(-1);
        }
    }
    /* ********************************************************************************** */

    function init() {
        var survey_id = $("#survey_id").val();
        surveyFormFactory.loadForm(survey_id, loadFormCallback)
    }

})
