angular.module('kudoc')

.controller('surveylistController', function ($scope) {

    $scope.click = {};
    $scope.surveys = [];

    $scope.click.goAssign = function (survey_id)
    {
        location.href = '/student/assign/' + survey_id;
    };

    function init() {
        $scope.surveys.push({
            survey_id : '157525834b26df1c59a224a38fb3e8d8',
            title : '전자및정보공학과 상시상담설문지 기본서식',
            professor : '교수님 성함',
            department : '전자및정보공학과'
        })
    }

    init();

    //
    // function test(d) {
    //     $scope.surveys.push(d)
    // }
    //
    // $scope.surveys = [];
    //
    // test({title: '2016 2차 정기 학생상담설문', closed_at: '2016. 10. 31', professor: '배진규',
    //     department: '전자및정보공학과', participants_cnt: 17, complete: true});
    // test({title: '학과수업 무단휴강조사', closed_at: '2016. 12. 24', professor: '오보람',
    //     department: '교무기획팀', participants_cnt: 2, complete: false});
    // test({title: '2016학년도 겨울계절수업 희망과목 조사', closed_at: '2016. 11. 25', professor: '류동현',
    //     department: '학사지원본부', participants_cnt: 9, complete: true});
    // test({title: '인문관 강의실 출결관리 만족도 조사', closed_at: '2016. 12. 31', professor: '최선영',
    //     department: '교무기획팀', participants_cnt: 25, complete: true});

});