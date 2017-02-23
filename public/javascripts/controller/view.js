angular.module('kudoc')

.controller('viewController', function ($scope, commentManagerFactory, surveyFormFactory, submitFormFactory, viewHelper) {

    $scope.submit_id = '';
    $scope.click = {};
    $scope.survey = {};

    // hak_department 를 설정하기 전, 코드를 가져와서 match 시킴.

    // $scope.survey.title = '2017 전자및정보공학과 정기 상담신청';
    // $scope.survey.notice = '';
    // $scope.survey.notice = '여러분들의 상담을 위해 사용되는 자료입니다. 성실하게 작성해 주시기 바랍니다.';
    /* *********** 중요!!! 학번과 학년 데이터를 서버로 전송 시 int 형태로 변경하여 보낼 것. */
    // $scope.survey.hak_number = '2016270501';
    // $scope.survey.hak_name = '양해찬';
    // $scope.survey.hak_grade = '';
    /* ********************************************************************* */
    $scope.survey.questions = [];
    // https://docs.angularjs.org/api/ng/service/$anchorScroll
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

    $scope.click.checkQuestion = function ($event) {
        $event.preventDefault();
        // type?
        // switch (quest.type)
        // {
        //     case 1: // 단일
        //         for (var idx in quest.options) quest.options[idx].checked = false;
        //         option.checked = !option.checked;
        //         break;
        //     case 2: // 다중
        //         option.checked = !option.checked;
        //         break;
        //     default:
        //         alert('Warning: checkQuestion function _ invalid quest type.')
        // }
    };
    $scope.click.postComment = function () {
        commentManagerFactory.saveComment($scope.submit_id, $scope.survey.comment, saveCommentCallback)
    };

    /* ********************************************************************* */

    function saveCommentCallback(result)
    {
        if (result)
        {
            alert('성공적으로 저장 되었습니다.');
        }
        else
        {
            alert('Warning: 데이터 저장 중 오류 발생.');
        }
    }

    // callback -> 아래에서 위로 (정의 순서만 그렇게 했음)
    function loadCommentCallback(result, comment)
    {
        if (result) {
            $scope.survey.comment = comment.data;
        }
        else {
            alert("오류 : 코멘트 데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.");
            history.back(-1);
        }
    }

    // call loadComment
    function loadFormCallback(result, form)
    {
        if (result) {

            viewHelper.mergeViewData(form, $scope.tmp);
            $scope.survey = form;

            // TODO :: 교수, 학생 모드에 맞추어야 함.
            delete $scope.tmp;
            commentManagerFactory.loadComment($scope.submit_id, loadCommentCallback)
        }
        else {
            alert("오류 : 설문지 양식을 불러오는데 실패했습니다. 다시 시도해 주세요.");
            history.back(-1);
        }
    }

    // call loadForm
    function loadSubmitCallback(result, form)
    {
        if (result)
        {
            $scope.tmp = form;
            surveyFormFactory.loadForm(form.survey_id, loadFormCallback)
        }

        else {
            alert("오류 : 설문 데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.");
            history.back(-1);
        }
    }

    function init() {
        var submit_id = $("#submit_id").val();
        $scope.submit_id = submit_id;
        submitFormFactory.loadSubmit(submit_id, loadSubmitCallback);
    }

    init();

})
