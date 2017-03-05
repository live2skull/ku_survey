angular.module('kudoc', ['kudoc.clientAPI'])

.run(['$anchorScroll', function($anchorScroll) { $anchorScroll.yOffset = 50; }]);

console.log("%c고려대학교 세종캠퍼스 온라인 학생설문시스템", "color: #6a000b; font-size:28px; font-weight: 800");
console.log('%c프로그램 버전 : 1.0 | 2017. 03. 06 최종 확인', 'color: #000000; font-size: 12px; font-weight: 600');
console.log('%c개발자 : 고려대학교 세종캠퍼스 전자및정보공학과 양해찬 (live2skull@gmail.com)', 'color: #000000; font-size: 12px; font-weight: 600');
console.log('---------------------------------------------------------------------');

